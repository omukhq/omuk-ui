import { useSyncExternalStore } from 'react';

// The toaster loads with the first toast: `withToast` imports
// @omuk/ui/sonner, then <LazyToaster /> draws it. A toast sent before the
// toaster draws waits in sonner's store, so none is lost.

type Sonner = typeof import('@omuk/ui/sonner');

let sonner: Sonner | null = null;
let loading: Promise<Sonner> | null = null;
const listeners = new Set<() => void>();

function load(): Promise<Sonner> {
  loading ??= import('@omuk/ui/sonner').then((module) => {
    sonner = module;
    for (const listener of listeners) listener();
    return module;
  });
  return loading;
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

function snapshot() {
  return sonner;
}

/** Sends a toast: `send` gets sonner's `toast`. */
export async function withToast(send: (toast: Sonner['toast']) => void) {
  const module = await load();
  send(module.toast);
}

/** The toaster, once a toast has loaded it. One on the page. */
export function LazyToaster() {
  const loaded = useSyncExternalStore(subscribe, snapshot, snapshot);
  return loaded ? <loaded.Toaster /> : null;
}
