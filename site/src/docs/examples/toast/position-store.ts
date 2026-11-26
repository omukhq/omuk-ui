import type { ToastPosition } from 'omuk-ui/sonner';
import { useSyncExternalStore } from 'react';

// The toast page's one Toaster takes its place from here: the playground
// and the Position example set it, the page reads it.

export const POSITIONS = [
  'top-left',
  'top-center',
  'top-right',
  'bottom-left',
  'bottom-center',
  'bottom-right',
] as const satisfies readonly ToastPosition[];

let position: ToastPosition = 'bottom-right';
const listeners = new Set<() => void>();

export function setToastPosition(next: ToastPosition) {
  if (next === position) return;
  position = next;
  for (const listener of listeners) listener();
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

function current() {
  return position;
}

/** Where the page's toasts sit now. */
export function useToastPosition() {
  return useSyncExternalStore(subscribe, current, current);
}
