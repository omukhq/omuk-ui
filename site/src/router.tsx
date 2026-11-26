import { type ComponentProps, useSyncExternalStore } from 'react';

// A small router for two kinds of page: the home page (/) and a
// component's page (/docs/<slug>). The path is the state: the History API
// writes it, useSyncExternalStore reads it. A link moves without a reload,
// and starts its page's code on pointer-over (onPreload).

const listeners = new Set<() => void>();

/** Runs on every path change: the page title, set by the app. */
let onChange: (path: string) => void = () => {};

export function onPathChange(handler: (path: string) => void) {
  onChange = handler;
  handler(location.pathname);
}

function notify() {
  onChange(location.pathname);
  for (const listener of listeners) listener();
}

function subscribe(listener: () => void) {
  if (listeners.size === 0) window.addEventListener('popstate', notify);
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
    if (listeners.size === 0) window.removeEventListener('popstate', notify);
  };
}

function currentPath() {
  return location.pathname;
}

/** The path the build renders (entry-server.tsx); the browser has its own. */
let renderedPath = '/';

export function setRenderedPath(path: string) {
  renderedPath = path;
}

/**
 * The path at render on the server, and while the browser hydrates that
 * HTML: the address bar's, which is the page the HTML was built for.
 */
function serverPath() {
  return typeof location === 'undefined' ? renderedPath : location.pathname;
}

/** The path now. Re-renders when it changes. */
export function usePath() {
  return useSyncExternalStore(subscribe, currentPath, serverPath);
}

/** Goes to a path on this site, without a reload, at the top of the page. */
export function navigate(to: string) {
  if (to === location.pathname) return;
  history.pushState(null, '', to);
  window.scrollTo({ top: 0 });
  notify();
}

/** A click that the browser should handle itself: a new tab, a download. */
function isOwnClick(event: React.MouseEvent<HTMLAnchorElement>) {
  return (
    event.button !== 0 ||
    event.metaKey ||
    event.ctrlKey ||
    event.shiftKey ||
    event.altKey ||
    event.defaultPrevented
  );
}

/**
 * A link to a page of this site. It moves without a reload; with a
 * modifier key it opens a new tab, as any link does.
 */
export function Link({
  to,
  onPreload,
  onClick,
  ...props
}: Omit<ComponentProps<'a'>, 'href'> & {
  to: string;
  /** Starts the page's code early: on pointer-over and on focus. */
  onPreload?: () => void;
}) {
  return (
    <a
      href={to}
      onPointerEnter={onPreload}
      onFocus={onPreload}
      onClick={(event) => {
        onClick?.(event);
        if (isOwnClick(event)) return;
        event.preventDefault();
        navigate(to);
      }}
      {...props}
    />
  );
}
