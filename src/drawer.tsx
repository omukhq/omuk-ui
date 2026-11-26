import {
  type ComponentProps,
  createContext,
  type PointerEvent,
  use,
  useRef,
  useState,
} from 'react';
import {
  ModalBackdrop,
  ModalClose,
  ModalDescription,
  ModalPopup,
  ModalPortal,
  ModalRoot,
  type ModalRootProps,
  ModalTitle,
  ModalTrigger,
} from './modal';
import type { OpenChangeDetails } from './popup';
import { useMergedRef } from './render';
import { cn } from './utils';

// A panel that slides in from an edge of the window: the modal <dialog> of
// dialog.tsx (modal.tsx), with the drawer's own parts inside it. A finger
// (or a pen) can swipe it back out toward its edge.

type Direction = 'left' | 'right' | 'top' | 'bottom';

type DrawerState = {
  direction: Direction;
  /** Closes the drawer as a swipe does. */
  close: (event: Event) => void;
};

const DrawerContext = createContext<DrawerState>({
  direction: 'right',
  close() {},
});

type DrawerProps = Omit<ModalRootProps, 'onOpenChange'> & {
  direction?: Direction;
  onOpenChange?: (open: boolean, eventDetails: OpenChangeDetails) => void;
};

function Drawer({
  direction = 'right',
  open,
  defaultOpen = false,
  onOpenChange,
  children,
  ...props
}: DrawerProps) {
  // Held here, not in the dialog: a swipe closes it from inside.
  const [own, setOwn] = useState(defaultOpen);
  const isOpen = open ?? own;

  function change(next: boolean, details: OpenChangeDetails) {
    onOpenChange?.(next, details);
    if (!details.isCanceled) setOwn(next);
  }

  function close(event: Event) {
    if (!isOpen) return;
    let canceled = false;
    change(false, {
      reason: 'swipe',
      event,
      trigger: undefined,
      cancel() {
        canceled = true;
      },
      get isCanceled() {
        return canceled;
      },
    });
  }

  return (
    <DrawerContext value={{ direction, close }}>
      <ModalRoot role="dialog" open={isOpen} onOpenChange={change} {...props}>
        {children}
      </ModalRoot>
    </DrawerContext>
  );
}

function DrawerTrigger(props: ComponentProps<typeof ModalTrigger>) {
  return <ModalTrigger data-slot="drawer-trigger" {...props} />;
}

function DrawerPortal(props: ComponentProps<typeof ModalPortal>) {
  return <ModalPortal {...props} />;
}

function DrawerClose(props: ComponentProps<typeof ModalClose>) {
  return <ModalClose data-slot="drawer-close" {...props} />;
}

// `starting:` (CSS @starting-style) is the frame before the drawer shows,
// and data-closed is on while it closes: the transform and the opacity
// transition from and to those.
function DrawerOverlay({
  className,
  ...props
}: ComponentProps<typeof ModalBackdrop>) {
  return (
    <ModalBackdrop
      data-slot="drawer-overlay"
      className={cn(
        'fixed inset-0 z-50 bg-scrim opacity-100 transition-opacity duration-300 ease-out',
        'starting:opacity-0 data-closed:opacity-0',
        className,
      )}
      {...props}
    />
  );
}

// The viewport lets presses through to the overlay, which closes the drawer;
// the drawer takes them back.
const VIEWPORT_BY_DIRECTION: Record<Direction, string> = {
  right: 'items-stretch justify-end',
  left: 'items-stretch justify-start',
  top: 'items-start justify-stretch',
  bottom: 'items-end justify-stretch',
};

// Each drawer rounds its two inward-facing corners (`rounded-xl`, as a
// dialog). `data-swiping` is on while a finger drags it, which moves it by
// --drawer-swipe-movement-*.
const POPUP_BY_DIRECTION: Record<Direction, string> = {
  right:
    'h-full w-3/4 max-w-sm rounded-l-xl translate-x-0 starting:translate-x-full data-closed:translate-x-full data-swiping:translate-x-(--drawer-swipe-movement-x)',
  left: 'h-full w-3/4 max-w-sm rounded-r-xl translate-x-0 starting:-translate-x-full data-closed:-translate-x-full data-swiping:translate-x-(--drawer-swipe-movement-x)',
  top: 'h-full max-h-4/5 w-full rounded-b-xl translate-y-0 starting:-translate-y-full data-closed:-translate-y-full data-swiping:translate-y-(--drawer-swipe-movement-y)',
  bottom:
    'h-full max-h-4/5 w-full rounded-t-xl translate-y-0 starting:translate-y-full data-closed:translate-y-full data-swiping:translate-y-(--drawer-swipe-movement-y)',
};

/** How far a finger moves before it counts as a swipe, in CSS pixels. */
const SLOP = 10;
/** The share of the drawer's size a swipe must cover to close it. */
const CLOSE_SHARE = 0.4;
/** Or the speed, in CSS pixels per millisecond, of a flick. */
const FLICK = 0.5;

/** The swipe toward the drawer's edge: its distance along that way. */
function along(direction: Direction, dx: number, dy: number) {
  if (direction === 'right') return dx;
  if (direction === 'left') return -dx;
  return direction === 'bottom' ? dy : -dy;
}

function useSwipe(direction: Direction, close: (event: Event) => void) {
  const swipe = useRef<{
    x: number;
    y: number;
    at: number;
    moved: number;
    on: boolean;
  } | null>(null);
  const horizontal = direction === 'left' || direction === 'right';
  const axis = horizontal ? 'x' : 'y';

  function reset(popup: HTMLElement) {
    swipe.current = null;
    delete popup.dataset.swiping;
    popup.style.removeProperty('transition');
    popup.style.removeProperty(`--drawer-swipe-movement-${axis}`);
  }

  return {
    onPointerDown(event: PointerEvent<HTMLElement>) {
      if (event.pointerType === 'mouse') return;
      swipe.current = {
        x: event.clientX,
        y: event.clientY,
        at: event.timeStamp,
        moved: 0,
        on: false,
      };
    },
    onPointerMove(event: PointerEvent<HTMLElement>) {
      const start = swipe.current;
      if (!start) return;
      const popup = event.currentTarget;
      const dx = event.clientX - start.x;
      const dy = event.clientY - start.y;
      const toward = along(direction, dx, dy);
      if (!start.on) {
        const across = Math.abs(horizontal ? dy : dx);
        if (Math.max(Math.abs(toward), across) < SLOP) return;
        // Across the way out, or the other way: a scroll, not a swipe.
        if (toward <= across) {
          swipe.current = null;
          return;
        }
        start.on = true;
        popup.setPointerCapture(event.pointerId);
        popup.dataset.swiping = '';
        // The drawer follows the finger, with no transition behind it.
        popup.style.transition = 'none';
      }
      start.moved = Math.max(0, toward);
      const sign = direction === 'left' || direction === 'top' ? -1 : 1;
      popup.style.setProperty(
        `--drawer-swipe-movement-${axis}`,
        `${sign * start.moved}px`,
      );
    },
    onPointerUp(event: PointerEvent<HTMLElement>) {
      const start = swipe.current;
      const popup = event.currentTarget;
      if (!start?.on) {
        swipe.current = null;
        return;
      }
      const size = horizontal ? popup.offsetWidth : popup.offsetHeight;
      const speed = start.moved / Math.max(1, event.timeStamp - start.at);
      // Let go: the transition moves the drawer out, or back.
      reset(popup);
      if (start.moved > size * CLOSE_SHARE || speed > FLICK) {
        close(event.nativeEvent);
      }
    },
    onPointerCancel(event: PointerEvent<HTMLElement>) {
      reset(event.currentTarget);
    },
  };
}

function DrawerContent({
  className,
  children,
  initialFocus,
  ref,
  ...props
}: ComponentProps<typeof ModalPopup>) {
  const { direction, close } = use(DrawerContext);
  const swipe = useSwipe(direction, close);
  const horizontal = direction === 'left' || direction === 'right';
  // Base UI's drawer takes the focus on the panel itself, not on its first
  // field: no focus ring on open, and no keyboard popping up on a phone.
  // Once per opening (a new panel each time), after the <dialog> has moved
  // the focus to the first field.
  const focused = useRef<HTMLElement | null>(null);
  const merged = useMergedRef(ref, (node: HTMLDivElement | null) => {
    if (!node || node === focused.current || initialFocus !== undefined) return;
    focused.current = node;
    node.focus({ preventScroll: true });
  });
  return (
    <DrawerPortal>
      <DrawerOverlay />
      <div
        data-slot="drawer-viewport"
        className={cn(
          'pointer-events-none fixed inset-0 z-50 flex',
          VIEWPORT_BY_DIRECTION[direction],
        )}
      >
        <ModalPopup
          ref={merged}
          tabIndex={-1}
          data-slot="drawer-content"
          // A side drawer keeps vertical scrolling and takes the sideways
          // drag; a top or bottom one leaves the drag to its content.
          style={horizontal ? { touchAction: 'pan-y' } : undefined}
          className={cn(
            'pointer-events-auto flex flex-col bg-page text-sm text-foreground shadow-lg outline-none forced-edge will-change-transform',
            'transition-transform duration-400 ease-out',
            POPUP_BY_DIRECTION[direction],
            // Reduced motion: it fades in and out where it stands, no slide.
            // A finger still drags it (data-swiping).
            'motion-reduce:transition-opacity motion-reduce:starting:translate-none motion-reduce:starting:opacity-0 motion-reduce:data-closed:translate-none motion-reduce:data-closed:opacity-0',
            className,
          )}
          {...(horizontal ? swipe : {})}
          {...props}
        >
          {children}
        </ModalPopup>
      </div>
    </DrawerPortal>
  );
}

function DrawerHeader({ className, ...props }: ComponentProps<'div'>) {
  return (
    <div
      data-slot="drawer-header"
      className={cn(
        'flex flex-col gap-2 p-4 text-center sm:text-left',
        className,
      )}
      {...props}
    />
  );
}

function DrawerFooter({ className, ...props }: ComponentProps<'div'>) {
  return (
    <div
      data-slot="drawer-footer"
      className={cn('mt-auto flex flex-col gap-2 p-4', className)}
      {...props}
    />
  );
}

function DrawerTitle({
  className,
  ...props
}: ComponentProps<typeof ModalTitle>) {
  return (
    <ModalTitle
      data-slot="drawer-title"
      className={cn('text-lg leading-tight font-semibold', className)}
      {...props}
    />
  );
}

function DrawerDescription({
  className,
  ...props
}: ComponentProps<typeof ModalDescription>) {
  return (
    <ModalDescription
      data-slot="drawer-description"
      className={cn('text-sm text-muted', className)}
      {...props}
    />
  );
}

export {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  DrawerPortal,
  DrawerTitle,
  DrawerTrigger,
};
