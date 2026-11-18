import {
  CircleAlertIcon,
  CircleCheckIcon,
  InfoIcon,
  TriangleAlertIcon,
  XIcon,
} from 'lucide-react';
import {
  type MouseEvent,
  type ReactNode,
  useRef,
  useState,
  useSyncExternalStore,
} from 'react';
import { Spinner } from './spinner';
import { TOAST } from './toast-recipe';
import { cn } from './utils';

// Our toasts, in place of the `sonner` package, with its calls: shared code
// imports `toast` from here and keeps `toast.success(…)`, and the app's
// <Toaster> (packages/web/src/layout/providers) its props. Only the parts the app uses: a title, a description, one
// action, a close button, an id to update a toast in place, and a timer that
// waits while the pointer or the keyboard is on the toasts, or the tab is
// hidden. DESIGN.md §9: plain toasts leave after the <Toaster>'s duration;
// an error stays until it is closed, so only it has a close button.
// Icons for every kind but the plain one.
//
// Owner, 18 Nov 2026 (dash-kit design/toasts.html): each kind in its own
// colour; `warning`, `loading` and `promise`; the same toast twice shows
// once; and the toasts stack as sonner's do, the newest in front and the
// older ones peeking out above it, opening into a list on hover or a tap.

type Kind = 'default' | 'success' | 'error' | 'info' | 'warning' | 'loading';

type Action = {
  label: ReactNode;
  /** The toast closes after this, unless it calls `event.preventDefault()`. */
  onClick: (event: MouseEvent<HTMLButtonElement>) => void;
};

export type ExternalToast = {
  id?: string | number;
  description?: ReactNode;
  action?: Action;
  /**
   * Milliseconds it stays; the <Toaster>'s `duration` when not given, and
   * until closed for an error.
   */
  duration?: number;
};

type Toast = {
  id: string | number;
  kind: Kind;
  title: ReactNode;
  description?: ReactNode;
  action?: Action;
  duration?: number;
  closing: boolean;
};

type ClassNames = Partial<
  Record<
    | 'toast'
    | 'content'
    | 'title'
    | 'description'
    | 'icon'
    | 'actionButton'
    | 'closeButton'
    | Kind,
    string
  >
>;

type ToasterProps = {
  closeButton?: boolean;
  /** From the window's bottom; the band's own padding keeps 16 at the side. */
  offset?: { bottom?: number | string; right?: number | string };
  mobileOffset?: { bottom?: number | string };
  duration?: number;
  visibleToasts?: number;
  toastOptions?: { classNames?: ClassNames };
  // sonner's other props (position, theme, …): the app passes them, they
  // don't change anything here.
  [prop: string]: unknown;
};

/** sonner's defaults. */
const DEFAULT_DURATION = 4000;
const DEFAULT_VISIBLE = 3;
/** How long the closing animation runs before the toast goes. */
const EXIT_MS = 200;

/** In a closed stack: how far each older toast peeks out, and shrinks. */
const PEEK = 12;
const SHRINK = 0.05;
/** Between toasts in an open stack. */
const GAP = 8;
/** A one-line toast, until the real height is measured. */
const FIRST_HEIGHT = 44;

const ICONS: Partial<Record<Kind, ReactNode>> = {
  success: <CircleCheckIcon strokeWidth={1.5} />,
  error: <CircleAlertIcon strokeWidth={1.5} />,
  info: <InfoIcon strokeWidth={1.5} />,
  warning: <TriangleAlertIcon strokeWidth={1.5} />,
  loading: <Spinner aria-hidden className="text-current" />,
};

/**
 * How long a toast stays: until closed (Infinity) for an error, until its
 * work ends for a loading toast.
 */
function lifetime(kind: Kind, duration: number | undefined) {
  if (kind === 'loading') return Number.POSITIVE_INFINITY;
  return (
    duration ??
    (kind === 'error' ? Number.POSITIVE_INFINITY : settings.duration)
  );
}

// ── The store ───────────────────────────────────────────────────────────

let toasts: Toast[] = [];
const listeners = new Set<() => void>();
const settings = { duration: DEFAULT_DURATION, visible: DEFAULT_VISIBLE };
let nextId = 1;

/**
 * Each toast's ref callback that measures it, kept from render to render (a
 * new one would unwatch and watch it again); dropped when the toast goes.
 */
const measurers = new Map<
  Toast['id'],
  (node: HTMLDivElement | null) => () => void
>();

/** Each open toast's timer: the time left, and the timeout while it runs. */
const timers = new Map<
  Toast['id'],
  { left: number; started: number; handle?: ReturnType<typeof setTimeout> }
>();
/** What holds the timers: the pointer, the keyboard, a hidden tab. */
const holds = { pointer: false, focus: false, hidden: false };
let paused = false;

function emit() {
  for (const listener of listeners) listener();
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

function snapshot() {
  return toasts;
}

function runTimer(id: Toast['id']) {
  const timer = timers.get(id);
  // A toast that stays until closed has no timeout.
  if (!timer || paused || !Number.isFinite(timer.left)) return;
  timer.started = Date.now();
  timer.handle = setTimeout(() => dismiss(id), timer.left);
}

function stopTimer(id: Toast['id']) {
  const timer = timers.get(id);
  if (!timer?.handle) return;
  clearTimeout(timer.handle);
  timer.handle = undefined;
  timer.left = Math.max(0, timer.left - (Date.now() - timer.started));
}

function hold(by: keyof typeof holds, on: boolean) {
  holds[by] = on;
  setPaused(holds.pointer || holds.focus || holds.hidden);
}

function setPaused(next: boolean) {
  if (paused === next) return;
  paused = next;
  for (const id of timers.keys()) {
    if (next) stopTimer(id);
    else runTimer(id);
  }
}

function show(kind: Kind, title: ReactNode, options: ExternalToast = {}) {
  // The same words of the same kind, still open: that toast again, not a
  // second one (two "could not be saved" stacked).
  const same =
    options.id === undefined && typeof title === 'string'
      ? toasts.find(
          (open) => !open.closing && open.kind === kind && open.title === title,
        )
      : undefined;
  const id = options.id ?? same?.id ?? nextId++;
  const toast: Toast = {
    id,
    kind,
    title,
    description: options.description,
    action: options.action,
    duration: options.duration,
    closing: false,
  };
  // The same id updates that toast in place, its timer from the start.
  const at = toasts.findIndex((open) => open.id === id);
  toasts =
    at === -1
      ? [...toasts, toast]
      : toasts.map((open, index) => (index === at ? toast : open));
  stopTimer(id);
  timers.set(id, { left: lifetime(kind, options.duration), started: 0 });
  runTimer(id);
  // More than the toaster shows: the oldest go.
  const open = toasts.filter((each) => !each.closing);
  for (const old of open.slice(0, Math.max(0, open.length - settings.visible)))
    dismiss(old.id);
  emit();
  return id;
}

/** Closes one toast, or every toast with no id. */
function dismiss(id?: Toast['id']) {
  const going = toasts.filter(
    (toast) => !toast.closing && (id === undefined || toast.id === id),
  );
  if (going.length === 0) return id;
  for (const toast of going) {
    stopTimer(toast.id);
    timers.delete(toast.id);
  }
  const closing = new Set(going.map((toast) => toast.id));
  // The last one goes: nothing is left to hold the timers open.
  if (toasts.every((toast) => toast.closing || closing.has(toast.id))) {
    holds.pointer = false;
    holds.focus = false;
    setPaused(holds.hidden);
  }
  toasts = toasts.map((toast) =>
    closing.has(toast.id) ? { ...toast, closing: true } : toast,
  );
  emit();
  setTimeout(() => {
    // Shown again under the same id meanwhile: that one stays.
    for (const toast of toasts)
      if (toast.closing && closing.has(toast.id)) measurers.delete(toast.id);
    toasts = toasts.filter(
      (toast) => !(toast.closing && closing.has(toast.id)),
    );
    emit();
  }, EXIT_MS);
  return id;
}

type PromiseMessages<T> = {
  loading: ReactNode;
  success: ReactNode | ((data: T) => ReactNode);
  error: ReactNode | ((error: unknown) => ReactNode);
};

/**
 * One toast for an action from start to end: a spinner while it runs, then
 * the success or the error toast in place. Gives back the work's promise.
 */
function promise<T>(
  work: Promise<T> | (() => Promise<T>),
  messages: PromiseMessages<T>,
  options: ExternalToast = {},
): Promise<T> {
  const id = show('loading', messages.loading, options);
  const running = typeof work === 'function' ? work() : work;
  running.then(
    (data) =>
      show(
        'success',
        typeof messages.success === 'function'
          ? messages.success(data)
          : messages.success,
        { ...options, id },
      ),
    (error: unknown) =>
      show(
        'error',
        typeof messages.error === 'function'
          ? messages.error(error)
          : messages.error,
        { ...options, id },
      ),
  );
  return running;
}

export const toast = Object.assign(
  (title: ReactNode, options?: ExternalToast) =>
    show('default', title, options),
  {
    success: (title: ReactNode, options?: ExternalToast) =>
      show('success', title, options),
    error: (title: ReactNode, options?: ExternalToast) =>
      show('error', title, options),
    info: (title: ReactNode, options?: ExternalToast) =>
      show('info', title, options),
    warning: (title: ReactNode, options?: ExternalToast) =>
      show('warning', title, options),
    /** Stays until updated by its id (a success, an error) or dismissed. */
    loading: (title: ReactNode, options?: ExternalToast) =>
      show('loading', title, options),
    promise,
    message: (title: ReactNode, options?: ExternalToast) =>
      show('default', title, options),
    dismiss,
  },
);

// ── The toaster ─────────────────────────────────────────────────────────

/**
 * The toasts at the bottom of the window: at the right from 640 up, centred
 * on phones, 16 from the edges (`offset`), up to 384 wide, the text cut
 * after two lines. Up to `visibleToasts` (3) in a stack: the newest in
 * front, the older ones peeking out 12 above it each, a little smaller.
 * Pointing at the stack, focusing in it, or tapping it on a phone opens it
 * into a list 8 apart, and holds the timers; leaving it, or a tap outside,
 * closes it. Their look is DESIGN.md's toast (TOAST, toast-recipe.ts); the
 * `classNames` go on top, as sonner's do.
 */
export function Toaster({
  closeButton = true,
  offset,
  duration = DEFAULT_DURATION,
  visibleToasts = DEFAULT_VISIBLE,
  toastOptions,
}: ToasterProps) {
  const shown = useSyncExternalStore(subscribe, snapshot, snapshot);
  const classNames = toastOptions?.classNames ?? {};
  const [open, setOpen] = useState(false);
  // Each toast's own height, measured: the stack places the toasts by them.
  const [heights, setHeights] = useState<ReadonlyMap<Toast['id'], number>>(
    () => new Map(),
  );
  const list = useRef<HTMLOListElement>(null);

  // Nothing left: the next toast starts in a closed stack.
  if (open && shown.length === 0) setOpen(false);

  function expand(on: boolean) {
    setOpen(on);
    hold('pointer', on);
  }

  /** Watches one toast's height while it is shown. */
  function measure(id: Toast['id']) {
    const kept = measurers.get(id);
    if (kept) return kept;
    const measurer = (node: HTMLDivElement | null) => {
      if (!node) return () => {};
      const observer = new ResizeObserver(([entry]) => {
        const height = Math.round(
          entry?.borderBoxSize[0]?.blockSize ?? node.offsetHeight,
        );
        setHeights((old) =>
          old.get(id) === height ? old : new Map(old).set(id, height),
        );
      });
      observer.observe(node);
      // Only stop watching. React (StrictMode) runs a ref twice: dropping
      // the kept callback or setting state here made a new ref each
      // render, and a loop.
      return () => observer.disconnect();
    };
    measurers.set(id, measurer);
    return measurer;
  }

  // Set up when the toaster mounts (a ref callback), taken down when it
  // goes: its settings, a hidden tab holding the timers, so a toast isn't
  // missed, a tap outside closing an open stack, and its place in the top
  // layer.
  //
  // A modal <dialog> (modal.tsx) sits in the browser's top layer, above
  // every z-index, its backdrop blurring the page. So the toaster is a
  // popover in the top layer too, shown again after each dialog opens
  // (`modalopen`) so it stays the last there, on top: toasts stay sharp
  // over a dialog. While the dialog is open the page around it is inert,
  // the toasts included: they show, but their buttons wait for it to close.
  const cleanup = useRef<() => void>(undefined);
  function attach(node: HTMLElement | null) {
    cleanup.current?.();
    cleanup.current = undefined;
    if (!node) return;
    settings.duration = duration;
    settings.visible = visibleToasts;
    function onVisibility() {
      hold('hidden', document.visibilityState === 'hidden');
    }
    function onOutside(event: PointerEvent) {
      const target = event.target;
      if (target instanceof Node && list.current?.contains(target)) return;
      setOpen(false);
      hold('pointer', false);
    }
    const toaster = node;
    function onTop() {
      // React can attach the ref while the node is out of the page (a
      // hidden subtree shown again): showPopover throws there.
      if (!toaster.isConnected) return;
      if (toaster.matches(':popover-open')) toaster.hidePopover();
      toaster.showPopover();
    }
    onTop();
    document.addEventListener('visibilitychange', onVisibility);
    document.addEventListener('modalopen', onTop);
    document.addEventListener('pointerdown', onOutside);
    cleanup.current = () => {
      document.removeEventListener('visibilitychange', onVisibility);
      document.removeEventListener('modalopen', onTop);
      document.removeEventListener('pointerdown', onOutside);
    };
  }

  // Newest first: the front of the stack.
  const front = [...shown].reverse();
  const heightOf = (each: Toast) => heights.get(each.id) ?? FIRST_HEIGHT;
  const frontHeight = front[0] ? heightOf(front[0]) : FIRST_HEIGHT;
  const listHeight = open
    ? front.reduce((sum, each) => sum + heightOf(each), 0) +
      GAP * Math.max(0, front.length - 1)
    : frontHeight + PEEK * Math.max(0, front.length - 1);

  return (
    <section
      ref={attach}
      aria-label="Notifications"
      aria-live="polite"
      aria-relevant="additions text"
      aria-atomic="false"
      popover="manual"
      // A popover's own box (the browser's: centred, bordered, Canvas
      // coloured) undone: a band along the bottom of the window, its toasts
      // centred on phones and at the right from 640 up. 16 up from the
      // bottom edge, as from the sides, unless `offset` moves it.
      className="pointer-events-none fixed inset-x-0 top-auto bottom-4 m-0 flex h-auto w-auto max-w-none justify-center overflow-visible border-none bg-transparent px-4 py-0 text-inherit sm:justify-end"
      style={{ bottom: offset?.bottom }}
    >
      {shown.length > 0 && (
        <ol
          ref={list}
          data-expanded={open ? '' : undefined}
          className="pointer-events-auto relative w-full max-w-96 transition-all duration-300 ease-out motion-reduce:transition-none"
          style={{ height: listHeight }}
          onPointerEnter={(event) => {
            if (event.pointerType !== 'touch') expand(true);
          }}
          onPointerLeave={(event) => {
            if (event.pointerType !== 'touch') expand(false);
          }}
          onPointerDown={(event) => {
            // A phone has no hover: a tap opens the stack.
            if (event.pointerType === 'touch' && !open) expand(true);
          }}
          onFocus={() => {
            setOpen(true);
            hold('focus', true);
          }}
          onBlur={(event) => {
            if (event.currentTarget.contains(event.relatedTarget)) return;
            setOpen(false);
            hold('focus', false);
          }}
        >
          {front.map((each, index) => {
            // Only a toast that stays until closed has a close button: the
            // rest leave by themselves, and a loading toast by its work.
            const closable =
              closeButton &&
              each.kind !== 'loading' &&
              !Number.isFinite(lifetime(each.kind, each.duration));
            const above = front
              .slice(0, index)
              .reduce((sum, other) => sum + heightOf(other) + GAP, 0);
            // Behind the front toast in a closed stack: cut to its height,
            // the words hidden, peeking out above it.
            const tucked = !open && index > 0;
            return (
              <li
                key={each.id}
                data-type={each.kind}
                data-closing={each.closing ? '' : undefined}
                // Hidden from the keyboard and screen readers while tucked:
                // only its edge shows.
                inert={tucked}
                aria-hidden={tucked || undefined}
                className={cn(
                  'absolute inset-x-0 bottom-0 origin-bottom rounded-lg transition-all duration-300 ease-out motion-reduce:transition-none',
                  tucked && 'overflow-hidden *:*:opacity-0',
                )}
                style={{
                  zIndex: front.length - index,
                  translate: `0 ${-(open ? above : PEEK * index)}px`,
                  scale: open ? 1 : 1 - SHRINK * index,
                  height: tucked ? frontHeight : undefined,
                }}
              >
                <div
                  ref={measure(each.id)}
                  className={cn(
                    'duration-200 motion-reduce:animate-none',
                    TOAST.toast,
                    TOAST.kind[each.kind],
                    each.closing
                      ? 'animate-out fade-out-0 slide-out-to-bottom-2'
                      : 'animate-in fade-in-0 slide-in-from-bottom-2',
                    classNames.toast,
                    // After the Toaster's classes: they repeat TOAST.toast,
                    // whose `px-2` undid this end padding (8 at the end, 16
                    // at the start).
                    !each.action && !closable && TOAST.plain,
                    classNames[each.kind],
                  )}
                >
                  {ICONS[each.kind] && (
                    <div
                      data-icon=""
                      className={cn(
                        TOAST.icon,
                        TOAST.kindIcon[each.kind],
                        classNames.icon,
                      )}
                    >
                      {ICONS[each.kind]}
                    </div>
                  )}
                  <div className={cn(TOAST.content, classNames.content)}>
                    <div
                      data-title=""
                      className={cn(TOAST.title, classNames.title)}
                    >
                      {each.title}
                    </div>
                    {each.description && (
                      <div
                        className={cn(
                          TOAST.description,
                          classNames.description,
                        )}
                      >
                        {each.description}
                      </div>
                    )}
                  </div>
                  {each.action && (
                    <button
                      type="button"
                      className={cn(
                        TOAST.actionButton,
                        classNames.actionButton,
                      )}
                      onClick={(event) => {
                        each.action?.onClick(event);
                        if (!event.defaultPrevented) dismiss(each.id);
                      }}
                    >
                      {each.action.label}
                    </button>
                  )}
                  {closable && (
                    <button
                      type="button"
                      aria-label="Close toast"
                      className={cn(TOAST.closeButton, classNames.closeButton)}
                      onClick={() => dismiss(each.id)}
                    >
                      <XIcon strokeWidth={1.5} />
                    </button>
                  )}
                </div>
              </li>
            );
          })}
        </ol>
      )}
    </section>
  );
}
