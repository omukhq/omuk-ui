'use client';

// The menu both dropdown-menu.tsx and context-menu.tsx draw, as Base UI's
// Menu is for its two: one set of items, so a context menu's items work in
// a dropdown and the other way round (the sidebar's row menu does that).
//
// WAI-ARIA menu: the arrow keys, Home and End move the highlight (the DOM
// focus), typing finds an item, Enter and Space choose it, Right opens a
// submenu and Left or Escape closes it, Tab closes the menu.
import {
  type ComponentPropsWithRef,
  createContext,
  type KeyboardEvent,
  type PointerEvent,
  type ReactNode,
  type RefObject,
  use,
  useId,
  useRef,
  useState,
} from 'react';
import {
  type FinalFocus,
  namePopup,
  type OpenChangeDetails,
  PopupFrame,
  type PopupRoot,
  type PopupRootProps,
  popupState,
  swallowClick,
  triggerState,
  usePopupRoot,
} from './popup';
import type { Align, Box, Side } from './position';
import { mergeProps, type RenderProp, useMergedRef, useRender } from './render';

/** What the popup focuses as it opens: an end item, itself, or nothing. */
type Highlight = 'first' | 'last' | 'popup' | 'none';

/**
 * The triangle the pointer may cross, from a submenu's trigger to it.
 * `rest`: the timer that gives it up when the pointer stops inside.
 */
type SafeZone = { x: number; y: number; menu: HTMLElement; rest?: number };

/** How long the pointer may rest in the safe triangle, in milliseconds. */
const SAFE_REST = 300;

type MenuState = PopupRoot & {
  kind: 'dropdown' | 'context' | 'sub';
  modal: boolean;
  parent: MenuState | null;
  /** Closes the whole menu, submenus and all. */
  closeAll: (reason: string, event?: Event) => void;
  highlight: RefObject<Highlight>;
  /** The id of the submenu open in this menu. */
  openSub: string | null;
  setOpenSub: (id: string | null) => void;
  safe: RefObject<SafeZone | null>;
  /** A context menu's pointer: the menu opens there. */
  point: Box | null;
  setPoint: (point: Box | null) => void;
};

const MenuContext = createContext<MenuState | null>(null);
/** The id of the submenu a part is in, for its trigger and its popup. */
const SubIdContext = createContext('');

function useMenu() {
  const menu = use(MenuContext);
  if (!menu) throw new Error('A menu part must be inside a menu.');
  return menu;
}

type MenuRootProps = PopupRootProps & {
  modal?: boolean;
  disabled?: boolean;
  children?: ReactNode;
};

function useMenuState(
  kind: MenuState['kind'],
  root: PopupRoot,
  parent: MenuState | null,
  modal: boolean,
): MenuState {
  const highlight = useRef<Highlight>('popup');
  const safe = useRef<SafeZone | null>(null);
  const [openSub, setOpenSub] = useState<string | null>(null);
  const [point, setPoint] = useState<Box | null>(null);
  // A closed menu has no submenu open when it opens again.
  if (!root.open && openSub !== null) setOpenSub(null);
  return {
    ...root,
    kind,
    modal,
    parent,
    closeAll:
      parent?.closeAll ??
      ((reason, event) => root.setOpen(false, reason, event)),
    highlight,
    openSub,
    setOpenSub,
    safe,
    point,
    setPoint,
  };
}

export function MenuRoot({
  modal = true,
  disabled: _disabled,
  children,
  ...props
}: MenuRootProps) {
  const menu = useMenuState('dropdown', usePopupRoot(props), null, modal);
  return <MenuContext value={menu}>{children}</MenuContext>;
}

export function ContextMenuRoot({ children, ...props }: MenuRootProps) {
  const menu = useMenuState('context', usePopupRoot(props), null, true);
  return <MenuContext value={menu}>{children}</MenuContext>;
}

export function MenuSubmenuRoot({
  children,
  onOpenChange,
  ...props
}: MenuRootProps) {
  const parent = useMenu();
  const id = useId();
  const root = usePopupRoot({
    ...props,
    open: parent.open && parent.openSub === id,
    onOpenChange(next: boolean, details: OpenChangeDetails) {
      onOpenChange?.(next, details);
      if (!details.isCanceled) parent.setOpenSub(next ? id : null);
    },
  });
  const menu = useMenuState('sub', root, parent, false);
  return (
    <MenuContext value={menu}>
      <SubIdContext value={id}>{children}</SubIdContext>
    </MenuContext>
  );
}

// --- Triggers ---------------------------------------------------------------

type TriggerProps = ComponentPropsWithRef<'button'> & {
  render?: RenderProp;
  nativeButton?: boolean;
  openOnHover?: boolean;
};

export function MenuTrigger({
  render,
  nativeButton: _nativeButton,
  openOnHover: _openOnHover,
  ref,
  ...props
}: TriggerProps) {
  const menu = useMenu();
  const merged = useMergedRef(ref, menu.setTrigger);
  return useRender(
    'button',
    mergeProps(
      {
        type: 'button',
        ref: merged,
        'aria-haspopup': 'menu',
        'aria-expanded': menu.open,
        ...triggerState(menu.open),
        onClick(event: React.MouseEvent) {
          // Enter or Space: highlight the first item, as a keyboard user
          // expects; a pointer opens the menu with nothing highlighted.
          menu.highlight.current = event.detail === 0 ? 'first' : 'popup';
          menu.setOpen(!menu.open, 'trigger-press', event);
        },
        onKeyDown(event: KeyboardEvent) {
          if (event.key !== 'ArrowDown' && event.key !== 'ArrowUp') return;
          event.preventDefault();
          menu.highlight.current = event.key === 'ArrowDown' ? 'first' : 'last';
          menu.setOpen(true, 'trigger-press', event);
        },
      },
      props,
    ),
    render,
  );
}

/** How long a finger rests before a context menu opens (no right button). */
const LONG_PRESS = 500;
/** How far it may move meanwhile. */
const LONG_PRESS_SLOP = 10;
/** Base UI's: a menu opened by a finger starts this far right of it. */
const TOUCH_OFFSET = 10;

export function ContextMenuTriggerPart({
  render,
  ref,
  ...props
}: ComponentPropsWithRef<'div'> & { render?: RenderProp }) {
  const menu = useMenu();
  const merged = useMergedRef(ref, menu.setTrigger);
  const press = useRef<{ x: number; y: number; timer: number } | null>(null);

  function openAt(event: Event, box: Box, keyboard: boolean) {
    menu.setPoint(box);
    menu.highlight.current = keyboard ? 'first' : 'popup';
    menu.setOpen(true, 'trigger-press', event);
  }
  function cancelPress() {
    if (press.current) clearTimeout(press.current.timer);
    press.current = null;
  }

  return useRender(
    'div',
    mergeProps(
      {
        ref: merged,
        ...triggerState(menu.open),
        onContextMenu(event: React.MouseEvent<HTMLElement>) {
          event.preventDefault();
          cancelPress();
          // Shift+F10 or the menu key: no pointer, so under the focused element.
          const keyboard =
            (event.nativeEvent as globalThis.PointerEvent).pointerType === '' ||
            (event.clientX === 0 && event.clientY === 0);
          if (keyboard) {
            const target = (
              event.target as HTMLElement
            ).getBoundingClientRect();
            openAt(
              event.nativeEvent,
              { left: target.left, top: target.bottom, width: 0, height: 0 },
              true,
            );
          } else {
            openAt(
              event.nativeEvent,
              { left: event.clientX, top: event.clientY, width: 0, height: 0 },
              false,
            );
          }
        },
        // A long press on a touch screen that has no context menu event.
        onPointerDown(event: PointerEvent<HTMLElement>) {
          if (event.pointerType !== 'touch') return;
          const { clientX: x, clientY: y } = event;
          const native = event.nativeEvent;
          cancelPress();
          press.current = {
            x,
            y,
            timer: window.setTimeout(() => {
              press.current = null;
              swallowClick();
              openAt(
                native,
                { left: x + TOUCH_OFFSET, top: y, width: 0, height: 0 },
                false,
              );
            }, LONG_PRESS),
          };
        },
        onPointerMove(event: PointerEvent<HTMLElement>) {
          const start = press.current;
          if (
            start &&
            Math.hypot(event.clientX - start.x, event.clientY - start.y) >
              LONG_PRESS_SLOP
          ) {
            cancelPress();
          }
        },
        onPointerUp: cancelPress,
        onPointerCancel: cancelPress,
      },
      props,
    ),
    render,
  );
}

// --- The popup --------------------------------------------------------------

// Disabled items stay in the arrow keys' path (WAI-ARIA, and Base UI).
const ITEMS = '[role=menuitem],[role=menuitemcheckbox],[role=menuitemradio]';

function itemsOf(popup: Element) {
  return [...popup.querySelectorAll<HTMLElement>(ITEMS)];
}

function focusItem(item: HTMLElement | undefined) {
  item?.focus({ preventScroll: false });
}

/** Typing letters finds the next item that starts with them. */
const TYPEAHEAD_RESET = 750;

export type MenuPopupProps = ComponentPropsWithRef<'div'> & {
  side?: Side;
  sideOffset?: number;
  align?: Align;
  alignOffset?: number;
  finalFocus?: FinalFocus;
  /** The positioner's classes (Base UI's Positioner className). */
  positionerClassName?: string;
};

export function MenuPopup({
  side = 'bottom',
  sideOffset = 0,
  align = 'center',
  alignOffset = 0,
  finalFocus,
  positionerClassName,
  onKeyDown,
  onPointerEnter,
  ref,
  ...props
}: MenuPopupProps) {
  const menu = useMenu();
  const subId = use(SubIdContext);
  const id = useId();
  const typed = useRef({ text: '', at: 0 });
  const sub = menu.kind === 'sub';
  // The menu takes its trigger's name: the button, the submenu's item, or
  // the area a context menu opened on. A caller's aria-label wins. A new
  // function each render, so it follows a new trigger.
  function name(node: HTMLDivElement | null) {
    if (node && !props['aria-labelledby']) {
      namePopup(node, id, menu.trigger);
    }
  }
  const merged = useMergedRef(ref, name);

  function focusIn(positioner: HTMLElement) {
    const popup = positioner.firstElementChild as HTMLElement | null;
    if (!popup) return;
    const how = menu.highlight.current;
    menu.highlight.current = 'popup';
    // The first or last item that can be chosen; the arrow keys then also
    // stop on disabled ones, as Base UI's do.
    const items = itemsOf(popup).filter(
      (item) => !item.hasAttribute('data-disabled'),
    );
    if (how === 'first') focusItem(items[0]);
    else if (how === 'last') focusItem(items.at(-1));
    else if (how === 'popup') popup.focus({ preventScroll: true });
  }

  function closeSub(reason: string) {
    menu.parent?.setOpenSub(null);
    if (reason !== 'outside-press') menu.trigger?.focus();
  }

  function keys(event: KeyboardEvent<HTMLDivElement>) {
    const popup = event.currentTarget;
    // A submenu's keys bubble here through React, not through the DOM.
    if (!popup.contains(event.target as Node)) return;
    const items = itemsOf(popup);
    const at = items.indexOf(document.activeElement as HTMLElement);
    const back =
      document.documentElement.dir === 'rtl' ? 'ArrowRight' : 'ArrowLeft';
    switch (event.key) {
      case 'ArrowDown':
        focusItem(items[(at + 1) % items.length]);
        break;
      case 'ArrowUp':
        focusItem(
          items[
            at < 0 ? items.length - 1 : (at - 1 + items.length) % items.length
          ],
        );
        break;
      case 'Home':
        focusItem(items[0]);
        break;
      case 'End':
        focusItem(items.at(-1));
        break;
      case back:
        if (!sub) return;
        closeSub('arrow');
        break;
      case 'Tab':
        menu.closeAll('focus-out', event.nativeEvent);
        break;
      default: {
        if (
          event.key.length !== 1 ||
          event.ctrlKey ||
          event.metaKey ||
          event.altKey
        ) {
          return;
        }
        const now = event.timeStamp;
        const buffer = typed.current;
        if (now - buffer.at > TYPEAHEAD_RESET) buffer.text = '';
        // Space chooses the item (its own keys did that); it is part of a
        // search only after a letter ("new f").
        if (event.key === ' ' && buffer.text === '') return;
        buffer.text += event.key.toLowerCase();
        buffer.at = now;
        // A repeated first letter steps on; more letters narrow from here.
        // A disabled item is never found: it cannot be chosen.
        const from = buffer.text.length === 1 ? at + 1 : Math.max(at, 0);
        const order = [...items.slice(from), ...items.slice(0, from)];
        const found = order.find(
          (item) =>
            !item.hasAttribute('data-disabled') &&
            (item.textContent ?? '')
              .trim()
              .toLowerCase()
              .startsWith(buffer.text),
        );
        if (!found) return;
        focusItem(found);
      }
    }
    event.preventDefault();
    event.stopPropagation();
  }

  return (
    <PopupFrame
      root={menu}
      kind={menu.modal ? 'menu' : 'popover'}
      anchor={menu.kind === 'context' ? menu.point : undefined}
      contextTrigger={menu.kind === 'context'}
      placement={{ side, align, sideOffset, alignOffset }}
      className={positionerClassName}
      initialFocus={focusIn}
      finalFocus={sub ? false : finalFocus}
      onDismiss={sub ? closeSub : undefined}
    >
      <div
        ref={merged}
        role="menu"
        tabIndex={-1}
        // Its trigger finds it by this, for the pointer's safe zone.
        data-submenu={sub ? subId : undefined}
        data-side={side}
        data-align={align}
        {...popupState(menu.open)}
        onKeyDown={(event) => {
          onKeyDown?.(event);
          keys(event);
        }}
        onPointerEnter={(event) => {
          onPointerEnter?.(event);
          if (menu.parent) menu.parent.safe.current = null;
        }}
        {...props}
      />
    </PopupFrame>
  );
}

// --- Items ------------------------------------------------------------------

/** Whether the pointer is heading for the open submenu, across the triangle. */
function towardSub(safe: SafeZone | null, x: number, y: number) {
  if (!safe) return false;
  const rect = safe.menu.getBoundingClientRect();
  const edge = rect.left >= safe.x ? rect.left : rect.right;
  const corners = [
    [safe.x, safe.y],
    [edge, rect.top],
    [edge, rect.bottom],
  ];
  let sign = 0;
  for (let i = 0; i < 3; i++) {
    const [ax, ay] = corners[i] as [number, number];
    const [bx, by] = corners[(i + 1) % 3] as [number, number];
    const cross = (bx - ax) * (y - ay) - (by - ay) * (x - ax);
    if (cross === 0) continue;
    if (sign === 0) sign = Math.sign(cross);
    else if (Math.sign(cross) !== sign) return false;
  }
  return true;
}

type ItemOptions = {
  role: 'menuitem' | 'menuitemcheckbox' | 'menuitemradio';
  disabled?: boolean;
  closeOnClick: boolean;
  /** The submenu this item opens, if it is a submenu's trigger. */
  opens?: string;
};

/** The props every kind of item shares: highlight, keys, choosing. */
function useItemProps(menu: MenuState, options: ItemOptions) {
  const { role, disabled, closeOnClick, opens } = options;
  return {
    role,
    tabIndex: -1,
    'aria-disabled': disabled || undefined,
    'data-disabled': disabled ? '' : undefined,
    onPointerMove(event: PointerEvent<HTMLElement>) {
      if (event.pointerType === 'touch' || disabled) return;
      const zone = menu.safe.current;
      if (zone && towardSub(zone, event.clientX, event.clientY)) {
        // Heading for the submenu: wait. A pointer that rests in the
        // triangle is not going there: then this item takes the highlight.
        const item = event.currentTarget;
        clearTimeout(zone.rest);
        zone.rest = window.setTimeout(() => {
          if (menu.safe.current !== zone) return;
          menu.safe.current = null;
          if (item.matches(':hover')) item.focus({ preventScroll: true });
        }, SAFE_REST);
        return;
      }
      if (zone) clearTimeout(zone.rest);
      menu.safe.current = null;
      if (document.activeElement !== event.currentTarget) {
        event.currentTarget.focus({ preventScroll: true });
      }
    },
    onPointerLeave(event: PointerEvent<HTMLElement>) {
      if (event.pointerType === 'touch') return;
      const item = event.currentTarget;
      if (opens && menu.openSub === opens) return;
      if (document.activeElement === item) {
        item
          .closest<HTMLElement>('[role=menu]')
          ?.focus({ preventScroll: true });
      }
    },
    onFocus(event: React.FocusEvent<HTMLElement>) {
      event.currentTarget.setAttribute('data-highlighted', '');
      // Another item highlighted: the open submenu closes.
      if (menu.openSub !== null && menu.openSub !== opens)
        menu.setOpenSub(null);
    },
    onBlur(event: React.FocusEvent<HTMLElement>) {
      event.currentTarget.removeAttribute('data-highlighted');
    },
    onKeyDown(event: KeyboardEvent<HTMLElement>) {
      if (event.target !== event.currentTarget) return;
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        event.currentTarget.click();
        // WAI-ARIA menu: Enter ticks a checkbox or radio item and closes
        // the menu; Space ticks it and keeps the menu open.
        if (event.key === 'Enter' && role !== 'menuitem' && !disabled) {
          menu.closeAll('item-press', event.nativeEvent);
        }
      }
    },
    onClick(event: React.MouseEvent) {
      if (disabled) {
        event.preventDefault();
        return;
      }
      if (closeOnClick) menu.closeAll('item-press', event.nativeEvent);
    },
  };
}

type ItemProps = ComponentPropsWithRef<'div'> & {
  render?: RenderProp;
  disabled?: boolean;
  closeOnClick?: boolean;
  label?: string;
  nativeButton?: boolean;
};

export function MenuItem({
  render,
  disabled,
  closeOnClick = true,
  label: _label,
  nativeButton: _nativeButton,
  onClick,
  ...props
}: ItemProps) {
  const menu = useMenu();
  return useRender(
    'div',
    mergeProps(
      useItemProps(menu, { role: 'menuitem', disabled, closeOnClick }),
      { ...props, onClick: disabled ? undefined : onClick },
    ),
    render,
  );
}

export function MenuSubmenuTrigger({
  render,
  disabled,
  delay = 100,
  openOnHover = true,
  label: _label,
  nativeButton: _nativeButton,
  ref,
  ...props
}: ItemProps & { delay?: number; openOnHover?: boolean }) {
  const sub = useMenu();
  const id = use(SubIdContext);
  const parent = sub.parent ?? sub;
  const merged = useMergedRef(ref, sub.setTrigger);
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined);
  const base = useItemProps(parent, {
    role: 'menuitem',
    disabled,
    closeOnClick: false,
    opens: id,
  });

  function open(highlight: Highlight, event: Event) {
    clearTimeout(timer.current);
    sub.highlight.current = highlight;
    sub.setOpen(true, 'trigger-press', event);
  }

  return useRender(
    'div',
    mergeProps(
      {
        ...base,
        ref: merged,
        'aria-haspopup': 'menu',
        'aria-expanded': sub.open,
        'data-open': sub.open ? '' : undefined,
        ...triggerState(sub.open),
        onPointerMove(event: PointerEvent<HTMLElement>) {
          base.onPointerMove(event);
          if (event.pointerType === 'touch' || disabled || !openOnHover) return;
          if (sub.open || timer.current !== undefined) return;
          const native = event.nativeEvent;
          timer.current = setTimeout(() => {
            timer.current = undefined;
            open('none', native);
          }, delay);
        },
        onPointerLeave(event: PointerEvent<HTMLElement>) {
          clearTimeout(timer.current);
          timer.current = undefined;
          const popup = sub.open
            ? document.querySelector<HTMLElement>(
                `[data-submenu="${CSS.escape(id)}"]`,
              )
            : null;
          parent.safe.current = popup
            ? { x: event.clientX, y: event.clientY, menu: popup }
            : null;
          base.onPointerLeave(event);
        },
        onKeyDown(event: KeyboardEvent<HTMLElement>) {
          const forward =
            document.documentElement.dir === 'rtl' ? 'ArrowLeft' : 'ArrowRight';
          if (
            event.key !== forward &&
            event.key !== 'Enter' &&
            event.key !== ' '
          ) {
            return;
          }
          event.preventDefault();
          event.stopPropagation();
          if (!disabled) open('first', event.nativeEvent);
        },
        onClick(event: React.MouseEvent) {
          if (!disabled)
            open(event.detail === 0 ? 'first' : 'none', event.nativeEvent);
        },
      },
      props,
    ),
    render,
  );
}

const CheckedContext = createContext(false);

export function MenuCheckboxItem({
  render,
  checked: controlled,
  defaultChecked = false,
  onCheckedChange,
  disabled,
  closeOnClick = false,
  label: _label,
  nativeButton: _nativeButton,
  onClick,
  children,
  ...props
}: Omit<ItemProps, 'defaultChecked'> & {
  checked?: boolean;
  defaultChecked?: boolean;
  onCheckedChange?: (
    checked: boolean,
    eventDetails: { reason: string; event: Event },
  ) => void;
}) {
  const menu = useMenu();
  const [own, setOwn] = useState(defaultChecked);
  const checked = controlled ?? own;
  const element = useRender(
    'div',
    mergeProps(
      {
        ...useItemProps(menu, {
          role: 'menuitemcheckbox',
          disabled,
          closeOnClick,
        }),
        'aria-checked': checked,
        'data-checked': checked ? '' : undefined,
        'data-unchecked': checked ? undefined : '',
      },
      {
        ...props,
        children,
        onClick: disabled
          ? undefined
          : (event: React.MouseEvent<HTMLDivElement>) => {
              onClick?.(event);
              onCheckedChange?.(!checked, {
                reason: 'item-press',
                event: event.nativeEvent,
              });
              setOwn(!checked);
            },
      },
    ),
    render,
  );
  return <CheckedContext value={checked}>{element}</CheckedContext>;
}

/** Draws its children only while its item is checked. */
export function MenuItemIndicator({
  keepMounted = false,
  className,
  children,
}: {
  keepMounted?: boolean;
  className?: string;
  children?: ReactNode;
}) {
  const checked = use(CheckedContext);
  if (!checked && !keepMounted) return null;
  return (
    <span
      className={className}
      data-checked={checked ? '' : undefined}
      data-unchecked={checked ? undefined : ''}
    >
      {children}
    </span>
  );
}

type RadioGroupState = {
  value: unknown;
  select: (value: unknown, event: Event) => void;
  disabled?: boolean;
};

const RadioGroupContext = createContext<RadioGroupState | null>(null);

export function MenuRadioGroup({
  value: controlled,
  defaultValue,
  onValueChange,
  disabled,
  render,
  ...props
}: Omit<ComponentPropsWithRef<'div'>, 'defaultValue'> & {
  value?: unknown;
  defaultValue?: unknown;
  onValueChange?: (
    // biome-ignore lint/suspicious/noExplicitAny: Base UI's signature; callers type the value (`(next: ViewMode) => …`).
    value: any,
    eventDetails: { reason: string; event: Event },
  ) => void;
  disabled?: boolean;
  render?: RenderProp;
}) {
  const [own, setOwn] = useState(defaultValue);
  const value = controlled === undefined ? own : controlled;
  function select(next: unknown, event: Event) {
    if (Object.is(next, value)) return;
    onValueChange?.(next, { reason: 'item-press', event });
    setOwn(next);
  }
  return (
    <RadioGroupContext value={{ value, select, disabled }}>
      {useRender('div', { role: 'group', ...props }, render)}
    </RadioGroupContext>
  );
}

export function MenuRadioItem({
  render,
  value,
  disabled: ownDisabled,
  closeOnClick = false,
  label: _label,
  nativeButton: _nativeButton,
  onClick,
  children,
  ...props
}: ItemProps & { value: unknown }) {
  const menu = useMenu();
  const group = use(RadioGroupContext);
  const disabled = ownDisabled || group?.disabled;
  const checked = group ? Object.is(group.value, value) : false;
  const element = useRender(
    'div',
    mergeProps(
      {
        ...useItemProps(menu, {
          role: 'menuitemradio',
          disabled,
          closeOnClick,
        }),
        'aria-checked': checked,
        'data-checked': checked ? '' : undefined,
        'data-unchecked': checked ? undefined : '',
      },
      {
        ...props,
        children,
        onClick: disabled
          ? undefined
          : (event: React.MouseEvent<HTMLDivElement>) => {
              onClick?.(event);
              group?.select(value, event.nativeEvent);
            },
      },
    ),
    render,
  );
  return <CheckedContext value={checked}>{element}</CheckedContext>;
}

export function MenuGroup({
  render,
  ...props
}: ComponentPropsWithRef<'div'> & { render?: RenderProp }) {
  return useRender('div', { role: 'group', ...props }, render);
}

export function MenuSeparator({
  render,
  ...props
}: ComponentPropsWithRef<'div'> & { render?: RenderProp }) {
  return useRender(
    'div',
    { role: 'separator', 'aria-orientation': 'horizontal', ...props },
    render,
  );
}

/** Base UI's Menu.Portal: our popups portal themselves. */
export function MenuPortal({
  children,
}: {
  children?: ReactNode;
  container?: unknown;
  keepMounted?: boolean;
}) {
  return children;
}
