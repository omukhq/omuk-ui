// The prompt store under the <PromptProvider> (prompt.tsx): a list of open
// alerts, modals and drawers, each with the promise its caller awaits. No
// React here: the provider reads it with useSyncExternalStore, as the
// toaster reads its toasts (sonner.tsx).
import type { ReactNode } from 'react';

export type DrawerDirection = 'left' | 'right' | 'top' | 'bottom';

/** A question with two answers: `open` gives `true` (the action) or `false`. */
export type AlertPromptOptions = {
  type: 'alert';
  title: ReactNode;
  description?: ReactNode;
  actionLabel: ReactNode;
  /** 'Cancel' when not given. */
  cancelLabel?: ReactNode;
  /** The filled danger button: the last step of a delete only. */
  destructive?: boolean;
  /**
   * Work to do before the alert closes. While it runs, the action button
   * shows its spinner (its size stays) and the alert cannot be closed.
   * It resolves: the alert closes and `open` gives `true`. It throws: the
   * alert stays open and shows the error's message, to try again or cancel.
   */
  onAction?: () => Promise<unknown>;
  /** What a screen reader hears while `onAction` runs. 'Working' when not given. */
  loadingLabel?: string;
};

type ContentPromptBase<TResult> = {
  title?: ReactNode;
  description?: ReactNode;
  /**
   * What the prompt shows. `close(result)` closes it and `open` gives the
   * result; `close()` and every other way out give `null`.
   */
  content: (close: (result?: TResult) => void) => ReactNode;
  className?: string;
};

/** A dialog with any content, for a form or a choice. */
export type ModalPromptOptions<TResult = unknown> =
  ContentPromptBase<TResult> & { type: 'modal' };

/** A panel from an edge of the window, with any content. */
export type DrawerPromptOptions<TResult = unknown> =
  ContentPromptBase<TResult> & {
    type: 'drawer';
    /** 'right' when not given. */
    direction?: DrawerDirection;
  };

export type PromptOptions<TResult = unknown> =
  | AlertPromptOptions
  | ModalPromptOptions<TResult>
  | DrawerPromptOptions<TResult>;

type EntryBase = {
  id: number;
  /** False while its closing animation plays; then the provider removes it. */
  open: boolean;
  /** Every way out but the action: Cancel, Escape, the backdrop, a swipe. */
  dismiss: () => void;
};

export type AlertEntry = EntryBase & {
  type: 'alert';
  options: Omit<AlertPromptOptions, 'type'>;
  /** The action is done: `open` gives `true`. */
  confirm: () => void;
};

export type ContentEntry = EntryBase & {
  type: 'modal' | 'drawer';
  title?: ReactNode;
  description?: ReactNode;
  className?: string;
  direction: DrawerDirection;
  body: ReactNode;
};

export type PromptEntry = AlertEntry | ContentEntry;

let entries: PromptEntry[] = [];
const listeners = new Set<() => void>();
let nextId = 1;

function emit() {
  for (const listener of listeners) listener();
}

export function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

export function snapshot() {
  return entries;
}

function push(entry: PromptEntry) {
  entries = [...entries, entry];
  emit();
}

function hide(id: number) {
  entries = entries.map((entry) =>
    entry.id === id && entry.open ? { ...entry, open: false } : entry,
  );
  emit();
}

/** Drops a prompt once its closing animation is done. */
export function removePrompt(id: number) {
  entries = entries.filter((entry) => entry.id !== id);
  emit();
}

/** Opens an alert, a modal or a drawer, and waits for its answer. */
export function openPrompt(options: AlertPromptOptions): Promise<boolean>;
export function openPrompt<TResult>(
  options: ModalPromptOptions<TResult> | DrawerPromptOptions<TResult>,
): Promise<TResult | null>;
export function openPrompt<TResult>(
  options: PromptOptions<TResult>,
): Promise<boolean | TResult | null> {
  const id = nextId++;
  return new Promise((resolve) => {
    let settled = false;
    // The first answer wins; the prompt then plays its closing animation.
    function finish(value: boolean | TResult | null) {
      if (settled) return;
      settled = true;
      resolve(value);
      hide(id);
    }
    if (options.type === 'alert') {
      const { type, ...view } = options;
      push({
        id,
        type,
        open: true,
        options: view,
        confirm: () => finish(true),
        dismiss: () => finish(false),
      });
      return;
    }
    push({
      id,
      type: options.type,
      open: true,
      title: options.title,
      description: options.description,
      className: options.className,
      direction:
        options.type === 'drawer' ? (options.direction ?? 'right') : 'right',
      body: options.content((result) => finish(result ?? null)),
      dismiss: () => finish(null),
    });
  });
}

/** Closes every open prompt: alerts give `false`, modals and drawers `null`. */
export function closeAllPrompts() {
  for (const entry of entries) if (entry.open) entry.dismiss();
}

const PROMPT = { open: openPrompt, closeAll: closeAllPrompts };

/**
 * `open(options)` shows an alert (gives `true` or `false`), a modal or a
 * drawer (gives what its content passes to `close`, or `null`).
 * `closeAll()` closes every open prompt. The same object outside React:
 * `prompt`. Apps import both from `omuk-ui/prompt`, which re-exports them.
 */
export function usePrompt() {
  return PROMPT;
}

/** `usePrompt()` for code outside a component. */
export const prompt = PROMPT;
