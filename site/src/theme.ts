import { useSyncExternalStore } from 'react';
import { DARK_QUERY, THEME_ATTRIBUTE, THEME_STORAGE_KEY } from './theme-script';

// Light or dark: the system's setting until the visitor picks one, then the
// pick, kept in localStorage. THEME_SCRIPT sets `data-theme` before the
// first paint; this keeps it in step: with the system's setting, and with a
// pick in another tab.

export type Theme = 'light' | 'dark';

function stored(): Theme | null {
  try {
    const value = localStorage.getItem(THEME_STORAGE_KEY);
    return value === 'light' || value === 'dark' ? value : null;
  } catch {
    return null;
  }
}

function current(): Theme {
  return stored() ?? (matchMedia(DARK_QUERY).matches ? 'dark' : 'light');
}

function apply(theme: Theme) {
  const root = document.documentElement;
  root.setAttribute(THEME_ATTRIBUTE, theme);
  root.style.colorScheme = theme;
}

const listeners = new Set<() => void>();

function notify() {
  apply(current());
  for (const listener of listeners) listener();
}

function onStorage(event: StorageEvent) {
  if (event.key === THEME_STORAGE_KEY) notify();
}

function subscribe(listener: () => void) {
  if (listeners.size === 0) {
    matchMedia(DARK_QUERY).addEventListener('change', notify);
    window.addEventListener('storage', onStorage);
  }
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
    if (listeners.size > 0) return;
    matchMedia(DARK_QUERY).removeEventListener('change', notify);
    window.removeEventListener('storage', onStorage);
  };
}

/** No colour transitions while the theme changes: it switches at once. */
function withoutTransitions(change: () => void) {
  const root = document.documentElement;
  root.setAttribute('data-switching', '');
  change();
  window.getComputedStyle(document.body);
  requestAnimationFrame(() => root.removeAttribute('data-switching'));
}

export function setTheme(theme: Theme) {
  try {
    localStorage.setItem(THEME_STORAGE_KEY, theme);
  } catch {
    // Not kept (a locked-down browser): the page still switches.
  }
  withoutTransitions(notify);
}

/** The theme on the page now. Re-renders when it changes. */
export function useTheme(): Theme {
  return useSyncExternalStore(subscribe, current, () => 'light');
}
