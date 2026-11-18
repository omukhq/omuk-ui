import {
  type ComponentPropsWithRef,
  createContext,
  type PointerEvent,
  type ReactNode,
  use,
  useRef,
  useState,
} from 'react';
import {
  PopupFrame,
  type PopupRootProps,
  popupState,
  triggerState,
  usePopupRoot,
} from './popup';
import type { Align, Side } from './position';
import { TOOLTIP } from './recipes';
import { mergeProps, type RenderProp, useMergedRef, useRender } from './render';
import { cn } from './utils';

// A name that shows on hover after a delay, at once on keyboard focus, and
// goes on Escape, a press, or when the pointer or the focus leaves.
//
// Inside a TooltipProvider the tooltips are a group, as Base UI's: one shows
// at a time. Opening one closes the group's open one at once, with no exit
// animation, and for a short while after one closes the next opens with no
// delay. So a pointer sliding along a row of icons leaves no trail of fading
// names (owner, 18 Nov 2026).

/** Base UI's default wait before a tooltip shows on hover. */
const DELAY = 600;

/** After a group's tooltip closes, the next one opens with no delay for this long. */
const GROUP_WINDOW = 400;

/** One tooltip, as its group sees it. */
type Member = { closeInstantly: () => void };

/**
 * A provider's group: the tooltip shown last (open, or still fading out),
 * whether it is open, and when it closed.
 */
type Group = { last: Member | null; showing: boolean; closedAt: number };

type Timing = { delay?: number; closeDelay?: number; group?: Group };

const TimingContext = createContext<Timing | null>(null);
type TooltipState = ReturnType<typeof usePopupRoot> & {
  /** Closing without its exit animation: another of the group opened. */
  instant: boolean;
  member: Member;
};

const TooltipContext = createContext<TooltipState | null>(null);

function useTooltip() {
  const tooltip = use(TooltipContext);
  if (!tooltip) throw new Error('A tooltip part must be inside <Tooltip>.');
  return tooltip;
}

function TooltipProvider({
  delay = 0,
  closeDelay,
  children,
}: Omit<Timing, 'group'> & { timeout?: number; children?: ReactNode }) {
  // One object for the provider's life: the tooltips write to it.
  const [group] = useState<Group>(() => ({
    last: null,
    showing: false,
    closedAt: 0,
  }));
  return (
    <TimingContext value={{ delay, closeDelay, group }}>
      {children}
    </TimingContext>
  );
}

function Tooltip({
  disabled,
  children,
  ...props
}: PopupRootProps & { disabled?: boolean; children?: ReactNode }) {
  const root = usePopupRoot(props);
  const [instant, setInstant] = useState(false);
  const open = root.open && !disabled;
  // A stable handle, so the group can tell this tooltip from the others.
  const [member] = useState<Member>(() => ({ closeInstantly() {} }));
  member.closeInstantly = () => {
    setInstant(true);
    root.setOpen(false, 'group');
  };
  if (root.open && instant) setInstant(false);
  return (
    <TooltipContext
      value={{
        ...root,
        open,
        status: disabled ? 'closed' : root.status,
        instant,
        member,
      }}
    >
      {children}
    </TooltipContext>
  );
}

type TooltipTriggerProps = ComponentPropsWithRef<'button'> & {
  render?: RenderProp;
  /** Milliseconds before it shows on hover. */
  delay?: number;
  closeDelay?: number;
  closeOnClick?: boolean;
};

function TooltipTrigger({
  delay,
  closeDelay,
  closeOnClick = true,
  render,
  ref,
  ...props
}: TooltipTriggerProps) {
  const tooltip = useTooltip();
  const timing = use(TimingContext);
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined);
  // Pressed: no tooltip again until the pointer leaves.
  const pressed = useRef(false);
  const merged = useMergedRef(ref, tooltip.setTrigger);

  function later(ms: number, then: () => void) {
    clearTimeout(timer.current);
    if (ms > 0) timer.current = setTimeout(then, ms);
    else then();
  }
  const group = timing?.group;
  function show(event: Event) {
    const trigger = event.currentTarget as HTMLElement | null;
    // Its own menu or popover is open: the name would cover it.
    if (trigger?.getAttribute('aria-expanded') === 'true') return;
    if (group) {
      // The one before, open or fading out, goes at once.
      if (group.last && group.last !== tooltip.member) {
        group.last.closeInstantly();
      }
      group.last = tooltip.member;
      group.showing = true;
    }
    tooltip.setOpen(true, 'trigger-hover', event);
  }
  function hide(event: Event, reason: string) {
    if (group?.last === tooltip.member && group.showing) {
      group.showing = false;
      group.closedAt = Date.now();
    }
    tooltip.setOpen(false, reason, event);
  }
  /** The wait before it shows: none while the group is warm. */
  function openDelay() {
    const warm =
      group && (group.showing || Date.now() - group.closedAt < GROUP_WINDOW);
    return warm ? 0 : (delay ?? timing?.delay ?? DELAY);
  }

  return useRender(
    'button',
    mergeProps(
      {
        ref: merged,
        'data-slot': 'tooltip-trigger',
        ...triggerState(tooltip.open),
        onPointerEnter(event: PointerEvent<HTMLElement>) {
          if (event.pointerType === 'touch' || pressed.current) return;
          const native = event.nativeEvent;
          later(openDelay(), () => show(native));
        },
        onPointerLeave(event: PointerEvent<HTMLElement>) {
          pressed.current = false;
          const native = event.nativeEvent;
          later(closeDelay ?? timing?.closeDelay ?? 0, () =>
            hide(native, 'trigger-hover'),
          );
        },
        onPointerDown(event: PointerEvent<HTMLElement>) {
          pressed.current = true;
          clearTimeout(timer.current);
          if (closeOnClick) hide(event.nativeEvent, 'trigger-press');
        },
        onFocus(event: React.FocusEvent<HTMLElement>) {
          // Keyboard focus only: a click focuses the button too.
          if (event.currentTarget.matches(':focus-visible')) {
            show(event.nativeEvent);
          }
        },
        onBlur(event: React.FocusEvent<HTMLElement>) {
          clearTimeout(timer.current);
          hide(event.nativeEvent, 'trigger-focus');
        },
      },
      props,
    ),
    render,
  );
}

function TooltipContent({
  className,
  side = 'top',
  sideOffset = 4,
  align = 'center',
  alignOffset = 0,
  children,
  ...props
}: ComponentPropsWithRef<'div'> & {
  side?: Side;
  sideOffset?: number;
  align?: Align;
  alignOffset?: number;
}) {
  const tooltip = useTooltip();
  return (
    <PopupFrame
      root={tooltip}
      kind="tooltip"
      placement={{ side, align, sideOffset, alignOffset }}
      finalFocus={false}
      className="isolate z-50"
    >
      <div
        data-slot="tooltip-content"
        data-side={side}
        data-align={align}
        data-instant={tooltip.instant ? '' : undefined}
        {...popupState(tooltip.open)}
        // DESIGN.md's tooltip (recipes.ts). No arrow.
        className={cn(
          TOOLTIP,
          'z-50 origin-(--transform-origin) data-open:animate-in data-open:fade-in-0 data-open:zoom-in-95 data-closed:animate-out data-closed:fade-out-0 data-closed:zoom-out-95 data-instant:animate-none',
          className,
        )}
        {...props}
      >
        {children}
      </div>
    </PopupFrame>
  );
}

export { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger };
