import { useSyncExternalStore } from 'react';

// The settings drawer's state, outside React: open or closed, and whether
// its code has loaded. The header's button and the phone's bottom bar both
// open it; the drawer is mounted once, in the app (SettingsHost). The same
// pattern as search-store.ts.

type State = { open: boolean; loaded: boolean };

let state: State = { open: false, loaded: false };
const listeners = new Set<() => void>();

function set(next: Partial<State>) {
  state = { ...state, ...next };
  for (const listener of listeners) listener();
}

export function openSettings() {
  set({ open: true, loaded: true });
}

export function setSettingsOpen(open: boolean) {
  set({ open, loaded: state.loaded || open });
}

/** Starts the drawer's code before it opens: on hover of its button. */
export function preloadSettings() {
  import('./settings-drawer').catch(() => {});
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

function snapshot() {
  return state;
}

export function useSettings() {
  return useSyncExternalStore(subscribe, snapshot, snapshot);
}
