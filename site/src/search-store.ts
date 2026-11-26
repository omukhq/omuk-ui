import { useSyncExternalStore } from 'react';

// The search's state, outside React: open or closed, and whether its code
// has loaded. ⌘K / Ctrl+K anywhere toggles it. The key listener is on the
// window while anything subscribes (useSyncExternalStore), so no effect.
// The same pattern as the Secrets app's command menu (shell/command-store.ts).

type State = { open: boolean; loaded: boolean };

let state: State = { open: false, loaded: false };
const listeners = new Set<() => void>();

function set(next: Partial<State>) {
  state = { ...state, ...next };
  for (const listener of listeners) listener();
}

export function openSearch() {
  set({ open: true, loaded: true });
}

export function setSearchOpen(open: boolean) {
  set({ open, loaded: state.loaded || open });
}

/** Starts the search's code before it opens: on hover of its button. */
export function preloadSearch() {
  import('./search').catch(() => {});
}

function onKeyDown(event: KeyboardEvent) {
  // Chrome sends some keydown events with no `key` (password autofill, for
  // one), although the DOM type says it is always a string.
  if (typeof event.key !== 'string') return;
  if (event.key.toLowerCase() === 'k' && (event.metaKey || event.ctrlKey)) {
    event.preventDefault();
    setSearchOpen(!state.open);
  }
}

function subscribe(listener: () => void) {
  if (listeners.size === 0) window.addEventListener('keydown', onKeyDown);
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
    if (listeners.size === 0) {
      window.removeEventListener('keydown', onKeyDown);
    }
  };
}

function snapshot(): State {
  return state;
}

/** The search's state, kept in step with ⌘K. */
export function useSearch(): State {
  return useSyncExternalStore(subscribe, snapshot, snapshot);
}

/** "⌘K" on a Mac, "Ctrl K" elsewhere. */
function searchKeys() {
  return /Mac|iPhone|iPad/.test(navigator.userAgent) ? '⌘K' : 'Ctrl K';
}

function never() {
  return () => {};
}

function buildKeys() {
  return 'Ctrl K';
}

/**
 * The keys, for the header. The built HTML cannot know the visitor's
 * system: it has "Ctrl K", and a Mac's page shows "⌘K" right after it
 * takes over, without a hydration mismatch.
 */
export function useSearchKeys() {
  return useSyncExternalStore(never, searchKeys, buildKeys);
}
