import { useSyncExternalStore } from 'react';
import { formatDay, todayIn } from './civil';
import { browserLocale } from './locale';

// What a date part shows that only the browser knows: its language and
// today. A page rendered on a server (pre-rendered HTML) cannot know them;
// the browser's first render, which takes that HTML over, must draw the
// same, or React throws the HTML away. So both use a fixed value until the
// page has hydrated, then the browser's. An app that draws in the browser
// only (createRoot) has the browser's values from the first render.

function never() {
  return () => {};
}

function inBrowser() {
  return true;
}

function onServer() {
  return false;
}

/** False on a server render and while its HTML hydrates; true after. */
export function useHydrated() {
  return useSyncExternalStore(never, inBrowser, onServer);
}

/** The language a server render uses, and the page while it hydrates. */
const SERVER_LOCALE = 'en-US';

/** The given language; else the browser's, once hydrated. */
export function useDateLocale(given: string | undefined) {
  const hydrated = useHydrated();
  return given ?? (hydrated ? browserLocale() : SERVER_LOCALE);
}

function noDay() {
  return null;
}

/**
 * Today as ISO text ("2026-11-26"), in `timeZone` (the browser's by
 * default): for a `minValue`, a `maxValue` or a range up to today. Null
 * in a server's HTML and while it hydrates, as the server's today is not
 * the visitor's; today right after.
 */
export function useToday(timeZone?: string): string | null {
  return useSyncExternalStore(never, () => formatDay(todayIn(timeZone)), noDay);
}
