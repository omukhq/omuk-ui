import { CircleAlertIcon, CircleCheckIcon, XIcon } from 'lucide-react';
import {
  type MouseEvent,
  type ReactNode,
  useRef,
  useSyncExternalStore,
} from 'react';
import { TOAST } from './toast-recipe';
import { cn } from './utils';

// Our toasts, in place of the `sonner` package, with its calls: shared code
// imports `toast` from here and keeps `toast.success(…)`, and the app's
// <Toaster> (packages/web/src/layout/providers) its props. Only the parts the app uses: a title, a description, one
// action, a close button, an id to update a toast in place, and a timer that
// waits while the pointer or the keyboard is on the toasts, or the tab is
// hidden. DESIGN.md §9: plain toasts leave after the <Toaster>'s duration;
// an error stays until it is closed, so only it has a close button.
// Icons only for done and error (and working, which the app does not use).

type Kind = 'default' | 'success' | 'error' | 'info';

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

const ICONS: Partial<Record<Kind, ReactNode>> = {
  success: <CircleCheckIcon strokeWidth={1.5} />,
  error: <CircleAlertIcon strokeWidth={1.5} />,
};

/** How long a toast stays: until closed (Infinity) for an error. */
function lifetime(kind: Kind, duration: number | undefined) {
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
  const id = options.id ?? nextId++;
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
  toasts = toasts.map((toast) =>
    closing.has(toast.id) ? { ...toast, closing: true } : toast,
  );
  emit();
  setTimeout(() => {
    // Shown again under the same id meanwhile: that one stays.
    toasts = toasts.filter(
      (toast) => !(toast.closing && closing.has(toast.id)),
    );
    emit();
  }, EXIT_MS);
  return id;
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
    message: (title: ReactNode, options?: ExternalToast) =>
      show('default', title, options),
    dismiss,
  },
);

// ── The toaster ─────────────────────────────────────────────────────────

/**
 * The toasts, newest at the bottom, up to `visibleToasts` (3) stacked 8
 * apart: bottom right from 640 up, bottom centre on phones, 16 from the
 * edges (`offset`), at most 400 wide, the text cut after two lines. Their
 * look is DESIGN.md's toast (TOAST, toast-recipe.ts); the `classNames` go on top,
 * as sonner's do.
 */
export function Toaster({
  closeButton,
  offset,
  duration = DEFAULT_DURATION,
  visibleToasts = DEFAULT_VISIBLE,
  toastOptions,
}: ToasterProps) {
  const shown = useSyncExternalStore(subscribe, snapshot, snapshot);
  const classNames = toastOptions?.classNames ?? {};

  // Set up when the toaster mounts (a ref callback), taken down when it
  // goes: its settings, a hidden tab holding the timers, so a toast isn't
  // missed, and its place in the top layer.
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
    const toaster = node;
    function onTop() {
      if (toaster.matches(':popover-open')) toaster.hidePopover();
      toaster.showPopover();
    }
    onTop();
    document.addEventListener('visibilitychange', onVisibility);
    document.addEventListener('modalopen', onTop);
    cleanup.current = () => {
      document.removeEventListener('visibilitychange', onVisibility);
      document.removeEventListener('modalopen', onTop);
    };
  }

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
      // centred on phones and at the right from 640 up.
      className="pointer-events-none fixed inset-x-0 top-auto m-0 flex h-auto w-auto max-w-none justify-center overflow-visible border-none bg-transparent px-4 py-0 text-inherit sm:justify-end"
      style={{ bottom: offset?.bottom }}
    >
      {shown.length > 0 && (
        <ol
          className="flex w-full max-w-100 flex-col items-center gap-2 sm:items-end"
          onPointerEnter={() => hold('pointer', true)}
          onPointerLeave={() => hold('pointer', false)}
          onFocus={() => hold('focus', true)}
          onBlur={(event) => {
            if (!event.currentTarget.contains(event.relatedTarget))
              hold('focus', false);
          }}
        >
          {shown.map((each) => {
            // Only a toast that stays until closed has a close button: the
            // rest leave by themselves.
            const closable =
              closeButton &&
              !Number.isFinite(lifetime(each.kind, each.duration));
            return (
              <li
                key={each.id}
                data-type={each.kind}
                data-closing={each.closing ? '' : undefined}
                className={cn(
                  'pointer-events-auto duration-200 motion-reduce:animate-none',
                  TOAST.toast,
                  each.closing
                    ? 'animate-out fade-out-0 slide-out-to-bottom-2'
                    : 'animate-in fade-in-0 slide-in-from-bottom-2',
                  classNames.toast,
                  // After the Toaster's classes: they repeat TOAST.toast,
                  // whose `p-2` undid this end padding (8 at the end, 16 at
                  // the start).
                  !each.action && !closable && TOAST.plain,
                  classNames[each.kind],
                )}
              >
                {ICONS[each.kind] && (
                  <div data-icon="" className={cn(TOAST.icon, classNames.icon)}>
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
                      className={cn(TOAST.description, classNames.description)}
                    >
                      {each.description}
                    </div>
                  )}
                </div>
                {each.action && (
                  <button
                    type="button"
                    className={cn(TOAST.actionButton, classNames.actionButton)}
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
              </li>
            );
          })}
        </ol>
      )}
    </section>
  );
}
