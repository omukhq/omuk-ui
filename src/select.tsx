import { CheckIcon, ChevronDownIcon, ChevronUpIcon } from 'lucide-react';
import {
  type ComponentPropsWithRef,
  createContext,
  type KeyboardEvent,
  type ReactNode,
  type Ref,
  type RefObject,
  use,
  useId,
  useRef,
  useState,
} from 'react';
import { FormValue } from './form-value';
import {
  type OpenChangeDetails,
  PopupFrame,
  type PopupRoot,
  type PopupRootProps,
  popupState,
  triggerState,
  usePopupRoot,
} from './popup';
import { type Align, type Box, boxOf, type Side } from './position';
import {
  FIELD,
  FIELD_OFF,
  FIELD_SIZE,
  type FieldSize,
  MENU_SEPARATOR,
  OPTION_ROW,
  POP,
  SECTION_LABEL,
  SURFACE,
  TICK_SLOT,
} from './recipes';
import { mergeProps, type RenderProp, useMergedRef, useRender } from './render';
import { cn } from './utils';

// A select: a button that shows the chosen value, and a listbox in a popup
// (WAI-ARIA select-only combobox). The focus moves through the options
// (roving focus): the arrow keys, Home and End move it, typing finds an
// option, Enter and Space choose it. On the closed button, the arrow keys,
// Enter and Space open the list, and typing chooses the next match.
//
// The list opens below its button. With alignItemWithTrigger (as Base
// UI's default) it opens over the button instead, the chosen option's text
// on the button's text, and falls back to below when there is no room.

/** Base UI's `items`: `{ value, label }` pairs (flat or in groups), or a map. */
type Items =
  | readonly { value: unknown; label?: ReactNode; items?: never }[]
  | readonly { items: readonly { value: unknown; label?: ReactNode }[] }[]
  | Record<string, ReactNode>;

export type ChangeDetails = Omit<OpenChangeDetails, 'trigger'>;

function details(reason: string, event: Event | undefined) {
  let canceled = false;
  return {
    reason,
    event,
    cancel() {
      canceled = true;
    },
    get isCanceled() {
      return canceled;
    },
  };
}

/** The label `items` gives a value, or the value itself (Base UI's rule). */
function labelOf(
  value: unknown,
  items: Items | undefined,
  toLabel: ((value: never) => string) | undefined,
): ReactNode {
  if (value == null) return null;
  if (toLabel) return toLabel(value as never);
  if (typeof value === 'object' && 'label' in value && value.label != null) {
    return value.label as ReactNode;
  }
  if (items && !Array.isArray(items)) {
    return (items as Record<string, ReactNode>)[String(value)] ?? String(value);
  }
  const key =
    typeof value === 'object' && 'value' in value ? value.value : value;
  const flat = ((items ?? []) as { value?: unknown; items?: unknown }[])
    .flatMap((item) => (Array.isArray(item.items) ? item.items : [item]))
    .find((item) => item.value === key);
  if (flat?.label != null) return flat.label;
  if (typeof value === 'object') {
    return 'value' in value ? String(value.value) : '';
  }
  return String(value);
}

/** Every value `items` lists, with its label as text, for type-to-find. */
function entriesOf(items: Items | undefined) {
  if (!items) return [];
  if (!Array.isArray(items)) {
    return Object.entries(items).map(([value, label]) => ({
      value: value as unknown,
      text: String(label ?? value),
    }));
  }
  return (items as { value?: unknown; label?: unknown; items?: unknown }[])
    .flatMap((item) =>
      Array.isArray(item.items)
        ? (item.items as { value: unknown; label?: unknown }[])
        : [item],
    )
    .map((item) => ({
      value: item.value,
      text: String(item.label ?? item.value),
    }));
}

type SelectState = PopupRoot & {
  id: string;
  value: unknown;
  hasValue: boolean;
  label: ReactNode;
  disabled: boolean;
  readOnly: boolean;
  modal: boolean;
  isEqual: (a: unknown, b: unknown) => boolean;
  choose: (value: unknown, event: Event) => void;
  /** Type-to-find on the closed button: the next value whose label matches. */
  find: (text: string, from: unknown) => unknown;
  /** What gets the focus when the list opens. */
  start: RefObject<'selected' | 'last'>;
  typed: RefObject<{ text: string; at: number }>;
};

const SelectContext = createContext<SelectState | null>(null);

function useSelect() {
  const select = use(SelectContext);
  if (!select) throw new Error('A select part must be inside <Select>.');
  return select;
}

type SelectProps<Value> = PopupRootProps & {
  value?: Value | null;
  defaultValue?: Value | null;
  onValueChange?: (value: Value, eventDetails: ChangeDetails) => void;
  items?: Items;
  itemToStringLabel?: (value: Value) => string;
  itemToStringValue?: (value: Value) => string;
  isItemEqualToValue?: (item: Value, value: Value) => boolean;
  name?: string;
  id?: string;
  required?: boolean;
  disabled?: boolean;
  readOnly?: boolean;
  modal?: boolean;
  inputRef?: Ref<HTMLInputElement>;
  children?: ReactNode;
};

/** Typing letters finds the next option that starts with them. */
const TYPEAHEAD_RESET = 750;

function matchNext<T>(
  list: T[],
  textOf: (item: T) => string,
  typed: { text: string; at: number },
  key: string,
  now: number,
  at: number,
) {
  if (now - typed.at > TYPEAHEAD_RESET) typed.text = '';
  typed.text += key.toLowerCase();
  typed.at = now;
  // A repeated first letter steps on; more letters narrow from here.
  const from = typed.text.length === 1 ? at + 1 : Math.max(at, 0);
  const order = [...list.slice(from), ...list.slice(0, from)];
  return order.find((item) =>
    textOf(item).trim().toLowerCase().startsWith(typed.text),
  );
}

function isTypeKey(event: KeyboardEvent) {
  return (
    event.key.length === 1 &&
    event.key !== ' ' &&
    !event.ctrlKey &&
    !event.metaKey &&
    !event.altKey
  );
}

function Select<Value>({
  value: controlled,
  defaultValue = null,
  onValueChange,
  items,
  itemToStringLabel,
  itemToStringValue,
  isItemEqualToValue,
  name,
  id,
  required,
  disabled = false,
  readOnly = false,
  modal = true,
  inputRef,
  children,
  ...props
}: SelectProps<Value>) {
  const root = usePopupRoot(props);
  const ownId = useId();
  const [own, setOwn] = useState<unknown>(defaultValue);
  const value = controlled === undefined ? own : controlled;
  const start = useRef<'selected' | 'last'>('selected');
  const typed = useRef({ text: '', at: 0 });

  function isEqual(a: unknown, b: unknown) {
    if (a == null || b == null) return a === b;
    return isItemEqualToValue
      ? isItemEqualToValue(a as Value, b as Value)
      : Object.is(a, b);
  }

  function choose(next: unknown, event: Event) {
    if (!isEqual(next, value)) {
      const change = details('item-press', event);
      onValueChange?.(next as Value, change);
      if (!change.isCanceled) setOwn(next);
    }
    root.setOpen(false, 'item-press', event);
  }

  function find(text: string, from: unknown) {
    const entries = entriesOf(items);
    const at = entries.findIndex((entry) => isEqual(entry.value, from));
    return matchNext(
      entries,
      (entry) => entry.text,
      typed.current,
      text,
      performance.now(),
      at,
    )?.value;
  }

  const hasValue = value != null;
  const label = labelOf(value, items, itemToStringLabel);
  const formValue = hasValue
    ? itemToStringValue
      ? itemToStringValue(value as Value)
      : typeof value === 'object' && 'value' in (value as object)
        ? String((value as { value: unknown }).value)
        : String(value)
    : '';

  return (
    <SelectContext
      value={{
        ...root,
        id: id ?? ownId,
        value,
        hasValue,
        label,
        disabled,
        readOnly,
        modal,
        isEqual,
        choose,
        find,
        start,
        typed,
      }}
    >
      {children}
      {name && (
        <FormValue
          ref={inputRef}
          name={name}
          value={formValue}
          required={required}
          disabled={disabled}
          focusTarget={() => root.trigger}
        />
      )}
    </SelectContext>
  );
}

const GroupContext = createContext<string | undefined>(undefined);

function SelectGroup({
  className,
  render,
  ...props
}: ComponentPropsWithRef<'div'> & { render?: RenderProp }) {
  const id = useId();
  return (
    <GroupContext value={id}>
      {useRender(
        'div',
        {
          role: 'group',
          'aria-labelledby': id,
          'data-slot': 'select-group',
          className: cn('scroll-my-1', className),
          ...props,
        },
        render,
      )}
    </GroupContext>
  );
}

function SelectValue({
  className,
  render,
  placeholder,
  children,
  ...props
}: Omit<ComponentPropsWithRef<'span'>, 'children'> & {
  render?: RenderProp;
  placeholder?: ReactNode;
  // biome-ignore lint/suspicious/noExplicitAny: Base UI's signature; callers type the value.
  children?: ReactNode | ((value: any) => ReactNode);
}) {
  const select = useSelect();
  const shown =
    typeof children === 'function'
      ? children(select.value)
      : (children ??
        (!select.hasValue && placeholder != null ? placeholder : select.label));
  return useRender(
    'span',
    {
      'data-slot': 'select-value',
      'data-placeholder': select.hasValue ? undefined : '',
      className: cn('flex flex-1 text-left', className),
      ...props,
      children: shown,
    },
    render,
  );
}

function SelectTrigger({
  className,
  size = 'md',
  children,
  render,
  nativeButton: _nativeButton,
  disabled: ownDisabled,
  ref,
  ...props
}: ComponentPropsWithRef<'button'> & {
  /** The height, as Button's: xs 24, sm 28, md 32 (default), lg 36. */
  size?: FieldSize;
  render?: RenderProp;
  nativeButton?: boolean;
}) {
  const select = useSelect();
  const merged = useMergedRef(ref, select.setTrigger);
  const disabled = select.disabled || ownDisabled;

  function open(event: React.SyntheticEvent, at: 'selected' | 'last') {
    if (select.readOnly) return;
    select.start.current = at;
    select.setOpen(true, 'trigger-press', event);
  }

  return useRender(
    'button',
    mergeProps(
      {
        type: 'button',
        ref: merged,
        id: select.id,
        role: 'combobox',
        'aria-haspopup': 'listbox',
        'aria-expanded': select.open,
        'aria-controls': select.open ? `${select.id}-list` : undefined,
        'aria-readonly': select.readOnly || undefined,
        'data-slot': 'select-trigger',
        'data-size': size,
        'data-placeholder': select.hasValue ? undefined : '',
        'data-disabled': disabled ? '' : undefined,
        disabled,
        ...triggerState(select.open),
        // A field (DESIGN.md, section 3) with the chevron at the end; open,
        // it keeps the focus ring and the chevron points up.
        className: cn(
          FIELD,
          disabled && FIELD_OFF,
          // A button, so the theme's field size (16 on phones) does not
          // reach it, and it does not need to: nothing is typed into it.
          "flex w-fit items-center justify-between gap-2 px-3 text-sm whitespace-nowrap aria-expanded:focus-ring data-placeholder:text-muted *:data-[slot=select-value]:line-clamp-1 *:data-[slot=select-value]:flex *:data-[slot=select-value]:items-center *:data-[slot=select-value]:gap-2 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
          FIELD_SIZE[size],
          size === 'xs' && 'px-2',
          className,
        ),
        onClick(event: React.MouseEvent) {
          if (select.open) select.setOpen(false, 'trigger-press', event);
          else open(event, 'selected');
        },
        onKeyDown(event: KeyboardEvent) {
          if (select.open) return;
          if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
            event.preventDefault();
            open(event, event.key === 'ArrowUp' ? 'last' : 'selected');
          } else if (isTypeKey(event) && !select.readOnly) {
            // Closed: typing chooses the next option that matches.
            const found = select.find(event.key, select.value);
            if (found !== undefined && !select.isEqual(found, select.value)) {
              select.choose(found, event.nativeEvent);
            }
          }
        },
        children: (
          <>
            {children}
            {select.open ? (
              <ChevronUpIcon
                aria-hidden
                strokeWidth={1.5}
                className="pointer-events-none size-4 text-muted"
              />
            ) : (
              <ChevronDownIcon
                aria-hidden
                strokeWidth={1.5}
                className="pointer-events-none size-4 text-muted"
              />
            )}
          </>
        ),
      },
      props,
    ),
    render,
  );
}

// --- The popup --------------------------------------------------------------

const OPTIONS = '[role=option]';

function optionsOf(popup: Element) {
  return [...popup.querySelectorAll<HTMLElement>(OPTIONS)];
}

function enabled(options: HTMLElement[]) {
  return options.filter((option) => !option.hasAttribute('data-disabled'));
}

function focusOption(option: HTMLElement | undefined) {
  option?.focus({ preventScroll: true });
  option?.scrollIntoView({ block: 'nearest' });
}

/** Base UI's collision padding: how near the window's edge a popup may go. */
const EDGE = 5;

type Edges = { up: boolean; down: boolean };

const ScrollContext = createContext<{
  edges: Edges;
  touch: boolean;
  popup: RefObject<HTMLDivElement | null>;
  measure: (popup: HTMLElement) => void;
} | null>(null);

function SelectContent({
  className,
  children,
  side = 'bottom',
  sideOffset = 4,
  align = 'start',
  alignOffset = 0,
  alignItemWithTrigger = false,
  onScroll,
  ref,
  ...props
}: ComponentPropsWithRef<'div'> & {
  side?: Side;
  sideOffset?: number;
  align?: Align;
  alignOffset?: number;
  alignItemWithTrigger?: boolean;
}) {
  const select = useSelect();
  const popup = useRef<HTMLDivElement | null>(null);
  const merged = useMergedRef(ref, popup);
  // The box that puts the chosen option over the trigger's text, once
  // measured; null when it does not fit (the list opens below instead).
  const [over, setOver] = useState<Box | null | undefined>(undefined);
  const [edges, setEdges] = useState<Edges>({ up: false, down: false });
  if (select.status === 'closed' && over !== undefined) setOver(undefined);
  const touch = select.how === 'touch';
  const aligning = alignItemWithTrigger && !touch && over !== null;

  function measure(element: HTMLElement) {
    const up = element.scrollTop > 1;
    const down =
      element.scrollTop + element.clientHeight < element.scrollHeight - 1;
    if (up !== edges.up || down !== edges.down) setEdges({ up, down });
  }

  /** Where the popup goes so the option's text sits on the value's. */
  function alignTo(list: HTMLElement, option: HTMLElement | undefined) {
    const trigger = select.trigger;
    if (!trigger || !option) return null;
    const value = trigger.querySelector('[data-slot=select-value]') ?? trigger;
    const text = option.querySelector('[data-item-text]') ?? option;
    const box = list.getBoundingClientRect();
    const at = text.getBoundingClientRect();
    const target = value.getBoundingClientRect();
    const top =
      target.top +
      target.height / 2 -
      (at.top - box.top + list.scrollTop + at.height / 2);
    const fits =
      top >= EDGE &&
      top + list.scrollHeight <= document.documentElement.clientHeight - EDGE;
    if (!fits) return null;
    return {
      top,
      left: box.left + target.left - at.left,
      width: boxOf(trigger).width,
      height: 0,
    };
  }

  function focusIn(positioner: HTMLElement) {
    const list = positioner.firstElementChild as HTMLElement | null;
    if (!list) return;
    const options = optionsOf(list);
    const selected = options.find((option) =>
      option.hasAttribute('data-selected'),
    );
    const usable = enabled(options);
    const target =
      select.start.current === 'last' ? usable.at(-1) : (selected ?? usable[0]);
    select.start.current = 'selected';
    if (alignItemWithTrigger && !touch && over === undefined) {
      setOver(alignTo(list, selected ?? usable[0]));
    }
    focusOption(target);
    measure(list);
  }

  function keys(event: KeyboardEvent<HTMLDivElement>) {
    const list = event.currentTarget;
    const options = enabled(optionsOf(list));
    const at = options.indexOf(document.activeElement as HTMLElement);
    switch (event.key) {
      case 'ArrowDown':
        focusOption(options[Math.min(at + 1, options.length - 1)]);
        break;
      case 'ArrowUp':
        focusOption(options[at < 0 ? options.length - 1 : Math.max(at - 1, 0)]);
        break;
      case 'Home':
        focusOption(options[0]);
        break;
      case 'End':
        focusOption(options.at(-1));
        break;
      case 'Tab':
        select.setOpen(false, 'focus-out', event);
        return;
      default: {
        if (!isTypeKey(event)) return;
        const found = matchNext(
          options,
          (option) => option.textContent ?? '',
          select.typed.current,
          event.key,
          event.timeStamp,
          at,
        );
        if (!found) return;
        focusOption(found);
      }
    }
    event.preventDefault();
    event.stopPropagation();
  }

  return (
    <PopupFrame
      root={select}
      kind={select.modal ? 'menu' : 'popover'}
      anchor={aligning ? over : undefined}
      placement={
        aligning && over
          ? { side: 'bottom', align: 'start', sideOffset: 0, alignOffset: 0 }
          : { side, align, sideOffset, alignOffset }
      }
      className="isolate z-50"
      initialFocus={focusIn}
    >
      <div
        ref={merged}
        tabIndex={-1}
        data-slot="select-content"
        data-align-trigger={aligning}
        data-side={side}
        data-align={align}
        {...popupState(select.open)}
        // A menu's surface (DESIGN.md, section 3): options are rows with the
        // tick at the start, no fill on the chosen one.
        className={cn(
          SURFACE,
          POP,
          'relative isolate z-50 max-h-(--available-height) w-(--anchor-width) min-w-48 overflow-x-hidden overflow-y-auto',
          aligning && 'animate-none',
          className,
        )}
        onScroll={(event) => {
          onScroll?.(event);
          measure(event.currentTarget);
        }}
        {...props}
      >
        <ScrollContext value={{ edges, touch, popup, measure }}>
          <SelectScrollUpButton />
          <div
            role="listbox"
            id={`${select.id}-list`}
            aria-labelledby={select.trigger?.id || undefined}
            onKeyDown={keys}
          >
            {children}
          </div>
          <SelectScrollDownButton />
        </ScrollContext>
      </div>
    </PopupFrame>
  );
}

function SelectLabel({
  className,
  render,
  ...props
}: ComponentPropsWithRef<'div'> & { render?: RenderProp }) {
  const id = use(GroupContext);
  return useRender(
    'div',
    {
      id,
      'data-slot': 'select-label',
      className: cn(SECTION_LABEL, 'pl-2', className),
      ...props,
    },
    render,
  );
}

function SelectItem({
  className,
  children,
  value,
  disabled = false,
  label: _label,
  render,
  onClick,
  ...props
}: ComponentPropsWithRef<'div'> & {
  value?: unknown;
  disabled?: boolean;
  /** Base UI's text for type-to-find; the option's text is used here. */
  label?: string;
  render?: RenderProp;
}) {
  const select = useSelect();
  const selected = select.isEqual(value ?? null, select.value);
  return useRender(
    'div',
    mergeProps(
      {
        role: 'option',
        tabIndex: -1,
        'aria-selected': selected,
        'aria-disabled': disabled || undefined,
        'data-slot': 'select-item',
        'data-selected': selected ? '' : undefined,
        'data-disabled': disabled ? '' : undefined,
        className: cn(
          OPTION_ROW,
          '*:data-item-text:flex *:data-item-text:items-center *:data-item-text:gap-2',
          className,
        ),
        onPointerMove(event: React.PointerEvent<HTMLElement>) {
          if (event.pointerType === 'touch' || disabled) return;
          if (document.activeElement !== event.currentTarget) {
            event.currentTarget.focus({ preventScroll: true });
          }
        },
        onFocus(event: React.FocusEvent<HTMLElement>) {
          event.currentTarget.setAttribute('data-highlighted', '');
        },
        onBlur(event: React.FocusEvent<HTMLElement>) {
          event.currentTarget.removeAttribute('data-highlighted');
        },
        onKeyDown(event: KeyboardEvent<HTMLElement>) {
          if (event.key !== 'Enter' && event.key !== ' ') return;
          event.preventDefault();
          event.stopPropagation();
          event.currentTarget.click();
        },
      },
      {
        ...props,
        onClick(event: React.MouseEvent<HTMLDivElement>) {
          if (disabled) return;
          onClick?.(event);
          select.choose(value ?? null, event.nativeEvent);
        },
        children: (
          <>
            <span className={TICK_SLOT}>
              {selected && (
                <CheckIcon strokeWidth={1.5} className="pointer-events-none" />
              )}
            </span>
            <span
              data-item-text=""
              className="flex min-w-0 flex-1 gap-2 whitespace-nowrap"
            >
              {children}
            </span>
          </>
        ),
      },
    ),
    render,
  );
}

function SelectSeparator({
  className,
  render,
  ...props
}: ComponentPropsWithRef<'div'> & { render?: RenderProp }) {
  return useRender(
    'div',
    {
      role: 'separator',
      'aria-orientation': 'horizontal',
      'data-slot': 'select-separator',
      className: cn('pointer-events-none', MENU_SEPARATOR, className),
      ...props,
    },
    render,
  );
}

/** How often a hovered scroll arrow scrolls the list, in milliseconds. */
const SCROLL_STEP = 40;

/**
 * Shown while the list can scroll that way; the pointer resting on it
 * scrolls the list. Not for touch, which scrolls the list itself.
 */
function ScrollArrow({
  up,
  className,
  children,
  ...props
}: ComponentPropsWithRef<'div'> & { up: boolean }) {
  const scroll = use(ScrollContext);
  const timer = useRef<ReturnType<typeof setInterval>>(undefined);
  if (!scroll || scroll.touch || !(up ? scroll.edges.up : scroll.edges.down)) {
    return null;
  }
  const { popup, measure } = scroll;
  function stop() {
    clearInterval(timer.current);
    timer.current = undefined;
  }
  return (
    <div
      aria-hidden
      // Kept at the list's edge while it scrolls under it.
      style={{ position: 'sticky' }}
      className={className}
      onPointerEnter={() => {
        stop();
        timer.current = setInterval(() => {
          const list = popup.current;
          const before = list?.scrollTop;
          if (!list) return stop();
          const step = list.querySelector<HTMLElement>(OPTIONS)?.offsetHeight;
          list.scrollTop += (up ? -1 : 1) * (step ?? 1);
          measure(list);
          // At the end, or the list closed: nothing more to scroll.
          if (list.scrollTop === before || !list.isConnected) stop();
        }, SCROLL_STEP);
      }}
      onPointerLeave={stop}
      {...props}
    >
      {children}
    </div>
  );
}

function SelectScrollUpButton({
  className,
  ...props
}: ComponentPropsWithRef<'div'>) {
  return (
    <ScrollArrow
      up
      data-slot="select-scroll-up-button"
      className={cn(
        'top-0 z-10 flex w-full cursor-default items-center justify-center bg-page py-1 text-muted',
        className,
      )}
      {...props}
    >
      <ChevronUpIcon strokeWidth={1.5} className="size-4" />
    </ScrollArrow>
  );
}

function SelectScrollDownButton({
  className,
  ...props
}: ComponentPropsWithRef<'div'>) {
  return (
    <ScrollArrow
      up={false}
      data-slot="select-scroll-down-button"
      className={cn(
        'bottom-0 z-10 flex w-full cursor-default items-center justify-center bg-page py-1 text-muted',
        className,
      )}
      {...props}
    >
      <ChevronDownIcon strokeWidth={1.5} className="size-4" />
    </ScrollArrow>
  );
}

export {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectScrollDownButton,
  SelectScrollUpButton,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
};
