import {
  type ComponentPropsWithRef,
  createContext,
  type PointerEvent,
  type ReactNode,
  use,
  useRef,
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

/** Base UI's default wait before a tooltip shows on hover. */
const DELAY = 600;

type Timing = { delay?: number; closeDelay?: number };

const TimingContext = createContext<Timing | null>(null);
const TooltipContext = createContext<ReturnType<typeof usePopupRoot> | null>(
  null,
);

function useTooltip() {
  const tooltip = use(TooltipContext);
  if (!tooltip) throw new Error('A tooltip part must be inside <Tooltip>.');
  return tooltip;
}

function TooltipProvider({
  delay = 0,
  closeDelay,
  children,
}: Timing & { timeout?: number; children?: ReactNode }) {
  return (
    <TimingContext value={{ delay, closeDelay }}>{children}</TimingContext>
  );
}

function Tooltip({
  disabled,
  children,
  ...props
}: PopupRootProps & { disabled?: boolean; children?: ReactNode }) {
  const root = usePopupRoot(props);
  const open = root.open && !disabled;
  return (
    <TooltipContext
      value={{ ...root, open, status: disabled ? 'closed' : root.status }}
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
  function show(event: Event) {
    const trigger = event.currentTarget as HTMLElement | null;
    // Its own menu or popover is open: the name would cover it.
    if (trigger?.getAttribute('aria-expanded') === 'true') return;
    tooltip.setOpen(true, 'trigger-hover', event);
  }
  function hide(event: Event, reason: string) {
    tooltip.setOpen(false, reason, event);
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
          later(delay ?? timing?.delay ?? DELAY, () => show(native));
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
        {...popupState(tooltip.open)}
        // DESIGN.md's tooltip (recipes.ts). No arrow.
        className={cn(
          TOOLTIP,
          'z-50 origin-(--transform-origin) data-open:animate-in data-open:fade-in-0 data-open:zoom-in-95 data-closed:animate-out data-closed:fade-out-0 data-closed:zoom-out-95',
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
