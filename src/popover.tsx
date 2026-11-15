import {
  type ComponentPropsWithRef,
  createContext,
  type KeyboardEvent,
  type ReactNode,
  use,
  useId,
} from 'react';
import {
  type FinalFocus,
  PopupFrame,
  type PopupRoot,
  type PopupRootProps,
  popupState,
  tabbables,
  triggerState,
  usePopupRoot,
} from './popup';
import type { Align, Side } from './position';
import { POP, SURFACE } from './recipes';
import { mergeProps, type RenderProp, useMergedRef, useRender } from './render';
import { PHONE_TOUCH } from './touch';
import { cn } from './utils';

// A non-modal panel beside its button: a click outside or Escape closes it,
// and the focus goes in when it opens and back to the button when it closes.

type PopoverState = PopupRoot & { id: string };

const PopoverContext = createContext<PopoverState | null>(null);

function usePopover() {
  const popover = use(PopoverContext);
  if (!popover) throw new Error('A popover part must be inside <Popover>.');
  return popover;
}

function Popover({
  children,
  ...props
}: PopupRootProps & { modal?: boolean | 'trap-focus'; children?: ReactNode }) {
  const root = usePopupRoot(props);
  const id = useId();
  return <PopoverContext value={{ ...root, id }}>{children}</PopoverContext>;
}

function PopoverTrigger({
  render,
  nativeButton: _nativeButton,
  ref,
  ...props
}: ComponentPropsWithRef<'button'> & {
  render?: RenderProp;
  nativeButton?: boolean;
}) {
  const popover = usePopover();
  const merged = useMergedRef(ref, popover.setTrigger);
  return useRender(
    'button',
    mergeProps(
      {
        type: 'button',
        ref: merged,
        'data-slot': 'popover-trigger',
        'aria-haspopup': 'dialog',
        'aria-expanded': popover.open,
        'aria-controls': popover.open ? popover.id : undefined,
        ...triggerState(popover.open),
        onClick(event: React.MouseEvent) {
          popover.setOpen(!popover.open, 'trigger-press', event);
        },
      },
      props,
    ),
    render,
  );
}

// On a phone (below 640, DESIGN.md §9, board 9-Phone) a popover is a bottom
// sheet: the window's full width at its foot, over the scrim, a grip on top,
// the same content with 48-tall controls. In CSS, so nothing has to know the
// width: `!` beats the place the frame writes inline (position.ts), and the
// scrim is the top-layer popover's own ::backdrop. A press on the scrim is
// a press outside (popup.tsx).
const SHEET_FRAME =
  'max-sm:inset-x-0! max-sm:top-auto! max-sm:bottom-0! max-sm:w-auto! max-sm:backdrop:bg-scrim';
const SHEET = cn(
  'max-sm:w-full! max-sm:rounded-t-xl max-sm:rounded-b-none max-sm:pb-4 max-sm:shadow-lg',
  'max-sm:data-open:zoom-in-100 max-sm:data-open:slide-in-from-bottom max-sm:data-closed:zoom-out-100 max-sm:data-closed:slide-out-to-bottom',
  'max-sm:before:mx-auto max-sm:before:mt-2 max-sm:before:h-1 max-sm:before:w-8 max-sm:before:shrink-0 max-sm:before:rounded-full max-sm:before:bg-border',
  PHONE_TOUCH,
);

/** Tab past either end of the panel closes it, the focus back on the button. */
function closeOnTabOut(popover: PopoverState) {
  return (event: KeyboardEvent<HTMLElement>) => {
    if (event.key !== 'Tab') return;
    const all = tabbables(event.currentTarget);
    const edge = event.shiftKey ? all[0] : all.at(-1);
    if (all.length && event.target !== edge) return;
    event.preventDefault();
    popover.setOpen(false, 'focus-out', event);
  };
}

function PopoverContent({
  className,
  align = 'center',
  alignOffset = 0,
  side = 'bottom',
  sideOffset = 4,
  initialFocus,
  finalFocus,
  onKeyDown,
  ...props
}: ComponentPropsWithRef<'div'> & {
  side?: Side;
  sideOffset?: number;
  align?: Align;
  alignOffset?: number;
  initialFocus?: boolean | React.RefObject<HTMLElement | null>;
  finalFocus?: FinalFocus;
}) {
  const popover = usePopover();
  function focusIn(panel: HTMLElement) {
    if (initialFocus === false) return;
    const target =
      initialFocus && initialFocus !== true ? initialFocus.current : null;
    (
      target ??
      tabbables(panel)[0] ??
      panel.querySelector<HTMLElement>('[role=dialog]')
    )?.focus();
  }
  return (
    <PopupFrame
      root={popover}
      kind="popover"
      placement={{ side, align, sideOffset, alignOffset }}
      className={`isolate z-50 ${SHEET_FRAME}`}
      initialFocus={focusIn}
      finalFocus={finalFocus}
    >
      <div
        role="dialog"
        id={popover.id}
        tabIndex={-1}
        aria-labelledby={`${popover.id}-title`}
        aria-describedby={`${popover.id}-description`}
        data-slot="popover-content"
        data-side={side}
        data-align={align}
        {...popupState(popover.open)}
        // DESIGN.md, section 3, Popover: `p-1 rounded-lg bg-page shadow-sm`,
        // a width that is a multiple of 64. Content that needs room (a
        // form) pads itself.
        className={cn(
          SURFACE,
          POP,
          'z-50 flex w-64 flex-col gap-4',
          className,
          SHEET,
        )}
        onKeyDown={(event) => {
          onKeyDown?.(event);
          closeOnTabOut(popover)(event);
        }}
        {...props}
      />
    </PopupFrame>
  );
}

function PopoverHeader({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="popover-header"
      className={cn('flex flex-col gap-1 text-sm', className)}
      {...props}
    />
  );
}

function PopoverTitle({
  className,
  render,
  ...props
}: ComponentPropsWithRef<'h2'> & { render?: RenderProp }) {
  const popover = usePopover();
  return useRender(
    'h2',
    {
      id: `${popover.id}-title`,
      'data-slot': 'popover-title',
      className: cn('leading-tight font-semibold', className),
      ...props,
    },
    render,
  );
}

function PopoverDescription({
  className,
  render,
  ...props
}: ComponentPropsWithRef<'p'> & { render?: RenderProp }) {
  const popover = usePopover();
  return useRender(
    'p',
    {
      id: `${popover.id}-description`,
      'data-slot': 'popover-description',
      className: cn('text-muted', className),
      ...props,
    },
    render,
  );
}

export {
  Popover,
  PopoverContent,
  PopoverDescription,
  PopoverHeader,
  PopoverTitle,
  PopoverTrigger,
};
