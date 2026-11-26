'use client';

import {
  type ComponentProps,
  createContext,
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
//
// A side drawer's viewport is also its swipe: a sideways scroller with two
// snap points, the drawer and an empty space as wide as the window beside
// it. It opens at the scroll's start, with the drawer in view (`right` is
// a reversed row, so its start is the right edge). A swipe toward the edge
// scrolls the drawer out, with the browser's own momentum and snap (Modern
// Web Guidance audit); a short one snaps back. A slide or a translate past
// the scroll's start is cut off, not scrolled to, so the open and close
// slides stay as they were. It scrolls only on a touch screen (a coarse
// pointer), as the swipe it replaces did: with a mouse, Left or Right on a
// button in the drawer would scroll it out and close it.
const SWIPE_SCROLLER =
  'items-stretch overflow-hidden overscroll-x-contain no-scrollbar snap-x snap-mandatory pointer-coarse:overflow-x-auto';

const VIEWPORT_BY_DIRECTION: Record<Direction, string> = {
  right: `flex-row-reverse ${SWIPE_SCROLLER}`,
  left: SWIPE_SCROLLER,
  top: 'items-start justify-stretch',
  bottom: 'items-end justify-stretch',
};

/** Where the drawer and the space beside it snap, in the scroll's order. */
const SNAP_BY_DIRECTION: Partial<
  Record<Direction, { popup: string; space: string }>
> = {
  right: { popup: 'snap-end', space: 'snap-start' },
  left: { popup: 'snap-start', space: 'snap-end' },
};

// Each drawer rounds its two inward-facing corners (`rounded-xl`, as a
// dialog).
const POPUP_BY_DIRECTION: Record<Direction, string> = {
  right:
    'h-full w-3/4 max-w-sm shrink-0 rounded-l-xl translate-x-0 starting:translate-x-full data-closed:translate-x-full',
  left: 'h-full w-3/4 max-w-sm shrink-0 rounded-r-xl translate-x-0 starting:-translate-x-full data-closed:-translate-x-full',
  top: 'h-full max-h-4/5 w-full rounded-b-xl translate-y-0 starting:-translate-y-full data-closed:-translate-y-full',
  bottom:
    'h-full max-h-4/5 w-full rounded-t-xl translate-y-0 starting:translate-y-full data-closed:translate-y-full',
};

/**
 * A scroll of a side drawer's viewport: once the empty space fills it (the
 * drawer is all out of view), the drawer closes. By the space's box, not
 * scrollLeft, which counts the other way in a reversed row and in
 * right-to-left text; and not the drawer's, which its slide in moves.
 */
function onSwipeScroll(
  viewport: HTMLElement,
  close: (event: Event) => void,
  event: Event,
) {
  if (viewport.dataset.swiped !== undefined) return;
  const space = viewport.querySelector('[data-slot=drawer-swipe-space]');
  if (!space) return;
  const box = viewport.getBoundingClientRect();
  const empty = space.getBoundingClientRect();
  if (Math.abs(empty.left - box.left) > 1) return;
  // Once: the scroll goes on firing while it settles.
  viewport.dataset.swiped = '';
  close(event);
}

function DrawerContent({
  className,
  children,
  initialFocus,
  ref,
  ...props
}: ComponentProps<typeof ModalPopup>) {
  const { direction, close } = use(DrawerContext);
  const snap = SNAP_BY_DIRECTION[direction];
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
        onScroll={
          snap
            ? (event) =>
                onSwipeScroll(event.currentTarget, close, event.nativeEvent)
            : undefined
        }
      >
        <ModalPopup
          ref={merged}
          tabIndex={-1}
          data-slot="drawer-content"
          className={cn(
            'pointer-events-auto flex flex-col bg-page text-sm text-foreground shadow-lg outline-none forced-edge will-change-transform',
            'transition-transform duration-400 ease-out',
            POPUP_BY_DIRECTION[direction],
            snap?.popup,
            // Reduced motion: it fades in and out where it stands, no slide.
            // A finger still swipes it out (the scroll).
            'motion-reduce:transition-opacity motion-reduce:starting:translate-none motion-reduce:starting:opacity-0 motion-reduce:data-closed:translate-none motion-reduce:data-closed:opacity-0',
            className,
          )}
          {...props}
        >
          {children}
        </ModalPopup>
        {snap && (
          <div
            aria-hidden
            data-slot="drawer-swipe-space"
            className={cn('w-full shrink-0', snap.space)}
          />
        )}
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
