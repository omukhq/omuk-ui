// What every popup here shares (tooltip, popover, menu, dialog): the open
// state, the stack of open popups that Escape and an outside press act on,
// and the frame that shows a popup in the top layer, places it, plays its
// enter and exit animations and moves the focus in and back out.
//
// Native `popover="manual"` rather than `auto`: the browser's light dismiss
// hides at once, so the exit animation (data-closed) could not play, and it
// knows nothing of a submenu portalled outside its parent. We do the dismiss.
import { type ReactNode, type RefObject, useState } from 'react';
import { createPortal } from 'react-dom';
import { type Box, boxOf, type Placement, place } from './position';
import { isComposing } from './utils';

export type InteractionType = 'mouse' | 'touch' | 'pen' | 'keyboard' | '';

/** Base UI's `eventDetails`, the parts callers read. */
export type OpenChangeDetails = {
  reason: string;
  event: Event | undefined;
  trigger: Element | undefined;
  cancel: () => void;
  readonly isCanceled: boolean;
};

export type PopupRootProps = {
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean, eventDetails: OpenChangeDetails) => void;
  /** Called once the enter or the exit animation has finished. */
  onOpenChangeComplete?: (open: boolean) => void;
};

/** Where focus goes when the popup closes, as Base UI's `finalFocus`. */
export type FinalFocus =
  | boolean
  | RefObject<HTMLElement | null>
  | ((closeType: InteractionType) => boolean | HTMLElement | null | undefined);

/** A React event or a DOM one: the DOM event is what details carry. */
type AnyEvent = Event | { nativeEvent: Event };

function nativeOf(event: AnyEvent | undefined) {
  return event && 'nativeEvent' in event ? event.nativeEvent : event;
}

export function interactionOf(event: Event | undefined): InteractionType {
  if (!event) return '';
  if (event.type.startsWith('key')) return 'keyboard';
  if ('pointerType' in event && event.pointerType) {
    return event.pointerType as InteractionType;
  }
  // A click with no presses behind it came from Enter or Space.
  if (event instanceof MouseEvent)
    return event.detail === 0 ? 'keyboard' : 'mouse';
  return '';
}

export type PopupRoot = ReturnType<typeof usePopupRoot>;

/**
 * Open or closed, controlled (`open`) or not (`defaultOpen`). A popup stays
 * mounted while its exit animation plays: `status` is 'closing' then.
 */
export function usePopupRoot({
  open: controlled,
  defaultOpen = false,
  onOpenChange,
  onOpenChangeComplete,
}: PopupRootProps) {
  const [own, setOwn] = useState(defaultOpen);
  const open = controlled ?? own;
  const [mounted, setMounted] = useState(open);
  if (open && !mounted) setMounted(true);
  const [trigger, setTrigger] = useState<HTMLElement | null>(null);
  // How the popup last opened or closed: the keyboard, a pointer, or code.
  const [how, setHow] = useState<InteractionType>('');

  function setOpen(next: boolean, reason: string, event?: AnyEvent) {
    if (next === open) return;
    const native = nativeOf(event);
    let canceled = false;
    onOpenChange?.(next, {
      reason,
      event: native,
      trigger: trigger ?? undefined,
      cancel() {
        canceled = true;
      },
      get isCanceled() {
        return canceled;
      },
    });
    if (canceled) return;
    setHow(interactionOf(native));
    setOwn(next);
  }

  return {
    open,
    status: open ? 'open' : mounted ? 'closing' : ('closed' as const),
    how,
    trigger,
    setTrigger,
    setOpen,
    entered() {
      onOpenChangeComplete?.(true);
    },
    exited() {
      setMounted(false);
      onOpenChangeComplete?.(false);
    },
  };
}

/** The attributes Base UI puts on a trigger while its popup is open. */
export function triggerState(open: boolean) {
  return { 'data-popup-open': open ? '' : undefined };
}

/** The attributes Base UI puts on a popup: open, or closing. */
export function popupState(open: boolean) {
  return {
    'data-open': open ? '' : undefined,
    'data-closed': open ? undefined : '',
  };
}

// --- The stack of open popups ----------------------------------------------

type Layer = {
  element: HTMLElement;
  close: (event: Event) => void;
  /** A tooltip: Escape closes it, and still reaches the page. */
  passive: boolean;
  /** A press anywhere: the popup decides if it was outside. */
  press?: (event: PointerEvent) => void;
};

const layers = new Map<HTMLElement, Layer>();
// The order popups first opened in: a re-render re-registers a popup
// without moving it to the top.
const order = new WeakMap<HTMLElement, number>();
let opened = 0;

function rank(element: HTMLElement) {
  return order.get(element) ?? 0;
}

function top() {
  let found: Layer | undefined;
  for (const layer of layers.values()) {
    if (!found || rank(layer.element) > rank(found.element)) found = layer;
  }
  return found;
}

/** Escape closes the newest popup, and only that one. */
function onEscape(event: KeyboardEvent) {
  if (event.key !== 'Escape' || isComposing(event)) return;
  const layer = top();
  if (!layer) return;
  if (!layer.passive) {
    event.preventDefault();
    event.stopPropagation();
  }
  layer.close(event);
}

/**
 * A press, for every open popup: one listener, which looks each popup's
 * handler up as it calls it. React can commit between two listeners (its
 * microtask), and a popup that re-registered its own listener then would
 * miss the press that closed its submenu.
 */
function onPress(event: PointerEvent) {
  const elements = [...layers.keys()].sort((a, b) => rank(b) - rank(a));
  for (const element of elements) layers.get(element)?.press?.(event);
}

export function addLayer(layer: Layer) {
  if (!order.has(layer.element)) order.set(layer.element, ++opened);
  if (layers.size === 0) {
    document.addEventListener('keydown', onEscape, true);
    document.addEventListener('pointerdown', onPress, true);
  }
  layers.set(layer.element, layer);
  return () => {
    layers.delete(layer.element);
    if (layers.size === 0) {
      document.removeEventListener('keydown', onEscape, true);
      document.removeEventListener('pointerdown', onPress, true);
    }
  };
}

/** Inside `element`, or inside a popup opened after it (its submenu, say). */
export function insideLayer(element: HTMLElement, target: Node) {
  if (element.contains(target)) return true;
  for (const layer of layers.values()) {
    if (rank(layer.element) > rank(element) && layer.element.contains(target)) {
      return true;
    }
  }
  return false;
}

/** Eats the click that ends a press: it only closed a modal menu. */
export function swallowClick() {
  function stop(event: Event) {
    event.preventDefault();
    event.stopPropagation();
  }
  document.addEventListener('click', stop, { capture: true, once: true });
  document.addEventListener(
    'pointerup',
    () => setTimeout(() => document.removeEventListener('click', stop, true)),
    { capture: true, once: true },
  );
}

/** The longest a close waits for its exit animation. */
const EXIT_LIMIT_MS = 2000;

/**
 * Resolves when the element's animations (and its children's) have ended.
 * An endless one (a spinning icon on a busy button, a pulse) never ends,
 * so it is left out, and the wait has a limit: without one the popup never
 * closed and the page stayed inert (Modern Web Guidance,
 * animate-to-from-top-layer).
 */
export function animationsDone(element: HTMLElement) {
  const finite = element
    .getAnimations({ subtree: true })
    .filter(
      (animation) => animation.effect?.getTiming().iterations !== Infinity,
    );
  return Promise.race([
    Promise.allSettled(finite.map((animation) => animation.finished)),
    new Promise((done) => setTimeout(done, EXIT_LIMIT_MS)),
  ]);
}

export function focusTarget(
  finalFocus: FinalFocus | undefined,
  how: InteractionType,
  trigger: HTMLElement | null,
) {
  const value =
    typeof finalFocus === 'function' ? finalFocus(how) : (finalFocus ?? true);
  if (value === false) return null;
  if (value === true || value == null) return trigger;
  return 'current' in value ? value.current : value;
}

/**
 * Names a dialog by its title (`<id>-title`) and describes it by its
 * description (`<id>-description`), only when they are inside it: an id
 * that points at nothing leaves the dialog with no name. With no title, it
 * takes the name of `fallback` (a popover's trigger). An `aria-label` the
 * caller gave wins. Runs from a ref, again on each render.
 */
export function nameDialog(
  element: HTMLElement,
  id: string,
  fallback?: HTMLElement | null,
) {
  const title = element.querySelector(`[id="${id}-title"]`);
  const description = element.querySelector(`[id="${id}-description"]`);
  if (fallback && !title && !fallback.id) fallback.id = `${id}-trigger`;
  const label = title?.id ?? fallback?.id;
  if (element.hasAttribute('aria-label') || !label) {
    element.removeAttribute('aria-labelledby');
  } else {
    element.setAttribute('aria-labelledby', label);
  }
  if (description) element.setAttribute('aria-describedby', description.id);
  else element.removeAttribute('aria-describedby');
}

/** The elements Tab reaches inside `element`, in order. */
export function tabbables(element: HTMLElement) {
  return [
    ...element.querySelectorAll<HTMLElement>(
      'input, button, textarea, select, a[href], [tabindex], [contenteditable="true"]',
    ),
  ].filter(
    (each) =>
      each.tabIndex >= 0 &&
      !each.matches(':disabled, [type="hidden"]') &&
      each.getClientRects().length > 0,
  );
}

// The marker before a popup shows it, so it is in the top layer before its
// contents mount: an `autoFocus` inside can then take the focus. (React
// commits a parent's refs after its children's, and a sibling's before.)
function showNext(marker: HTMLElement | null) {
  const next = marker?.nextElementSibling;
  if (next instanceof HTMLElement && !next.matches(':popover-open')) {
    next.showPopover();
  }
}

const POSITIONER =
  'inset-auto m-0 overflow-visible border-0 bg-transparent p-0 text-inherit'; // design-ok: border-0 takes off the browser's own popover border, not an edge

export type FrameProps = {
  root: PopupRoot;
  placement: Placement;
  /** The box to sit beside; the trigger's by default. */
  anchor?: Box | null;
  /** 'menu' eats the click that closes it (Base UI's modal menu). */
  kind: 'menu' | 'popover' | 'tooltip';
  className?: string;
  /** Moves the focus in, once the popup is shown. */
  initialFocus?: (popup: HTMLElement) => void;
  finalFocus?: FinalFocus;
  /**
   * A context menu's trigger (its row) is outside for a press, which closes
   * the menu as Base UI's does; a right-click there opens it again.
   */
  contextTrigger?: boolean;
  /** Escape and an outside press: closes this popup. */
  onDismiss?: (reason: string, event: Event) => void;
  children: ReactNode;
};

/**
 * A popup's positioner: a `popover` in the top layer, portalled to the
 * body (or to the dialog the trigger is in, which would make it inert).
 */
export function PopupFrame({
  root,
  placement,
  anchor,
  kind,
  className,
  initialFocus,
  finalFocus,
  contextTrigger = false,
  onDismiss,
  children,
}: FrameProps) {
  const { status, trigger } = root;
  function dismiss(reason: string, event: Event) {
    if (onDismiss) onDismiss(reason, event);
    else root.setOpen(false, reason, event);
  }

  // Runs again on each render while mounted, so it must be idempotent.
  function frame(node: HTMLDivElement | null) {
    if (!node) return;
    const element = node;
    let alive = true;
    if (status === 'closing') {
      delete element.dataset.entered;
      // Focus in a submenu of this one, which closes with it: hold it here,
      // or it falls to the page when the submenu hides first.
      const active = document.activeElement?.closest<HTMLElement>('[popover]');
      if (active && active !== element && rank(active) > rank(element)) {
        (element.firstElementChild as HTMLElement | null)?.focus({
          preventScroll: true,
        });
      }
      void animationsDone(element).then(() => {
        if (!alive || !element.matches(':popover-open')) return;
        const active = document.activeElement;
        const hadFocus =
          !active || active === document.body || element.contains(active);
        element.hidePopover();
        if (hadFocus) {
          focusTarget(finalFocus, root.how, trigger)?.focus();
        }
        root.exited();
      });
      return () => {
        alive = false;
      };
    }

    if (!element.matches(':popover-open')) element.showPopover();
    function update() {
      const box = anchor ?? (trigger ? boxOf(trigger) : null);
      if (box) place(element, box, placement);
    }
    update();
    // The popup, the trigger and the page: a trigger that grows, or moves
    // because the page above it changed, takes the popup with it (no scroll
    // or window resize needed).
    const resize = new ResizeObserver(update);
    resize.observe(element);
    if (trigger) resize.observe(trigger);
    resize.observe(document.body);
    window.addEventListener('resize', update);
    document.addEventListener('scroll', update, {
      capture: true,
      passive: true,
    });

    function outside(event: PointerEvent) {
      const target = event.target as Node;
      // The frame itself is hit only through its ::backdrop (a popover's
      // scrim on a phone, popover.tsx): that press is outside.
      if (target !== element && insideLayer(element, target)) return;
      if (
        trigger?.contains(target) &&
        (!contextTrigger || event.button === 2)
      ) {
        return;
      }
      if (kind === 'menu') swallowClick();
      dismiss('outside-press', event);
    }
    const removeLayer = addLayer({
      element,
      passive: kind === 'tooltip',
      close: (event) => dismiss('escape-key', event),
      press: kind === 'tooltip' ? undefined : outside,
    });

    if (element.dataset.entered === undefined) {
      element.dataset.entered = '';
      if (initialFocus && !element.contains(document.activeElement)) {
        initialFocus(element);
      }
      void animationsDone(element).then(() => {
        if (alive) root.entered();
      });
    }

    return () => {
      alive = false;
      resize.disconnect();
      window.removeEventListener('resize', update);
      document.removeEventListener('scroll', update, true);
      removeLayer();
    };
  }

  if (status === 'closed') return null;
  return createPortal(
    <>
      <span hidden ref={showNext} />
      <div
        popover="manual"
        ref={frame}
        className={`${POSITIONER} ${className ?? ''}`}
      >
        {children}
      </div>
    </>,
    trigger?.closest('dialog') ?? document.body,
  );
}
