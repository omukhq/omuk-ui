import { useSyncExternalStore } from 'react';
import {
  GOOGLE_FONT_KEY,
  GOOGLE_FONT_LINK,
  GOOGLE_FONT_VARIABLE,
  googleFontHref,
} from './theme-script';

// A Google font for the whole site, picked in the settings drawer. The list
// (public/google-fonts.json, scripts/google-fonts.ts) loads when the picker
// first opens. A pick adds Google's stylesheet and sets `--font-google` on
// <html>, which tokens.css turns into `--font-sans` while `data-font` is
// "google". THEME_SCRIPT does the same before the first paint on a reload.

/** [family, category, weights]: the list file's rows. */
export type GoogleFont = readonly [
  family: string,
  category: string,
  weights: string,
];

let list: Promise<GoogleFont[]> | null = null;

/** The families, most popular first. Fetched once, on the first call. */
export function loadGoogleFonts(): Promise<GoogleFont[]> {
  list ??= fetch('/google-fonts.json').then((response) => {
    if (!response.ok) throw new Error(`The font list: ${response.status}`);
    return response.json();
  });
  // A failed fetch may be tried again on the next open.
  list.catch(() => {
    list = null;
  });
  return list;
}

function isFont(value: unknown): value is GoogleFont {
  return (
    Array.isArray(value) &&
    value.length === 3 &&
    value.every((part) => typeof part === 'string')
  );
}

function read(): GoogleFont | null {
  try {
    const kept: unknown = JSON.parse(
      localStorage.getItem(GOOGLE_FONT_KEY) ?? 'null',
    );
    return isFont(kept) ? kept : null;
  } catch {
    return null;
  }
}

/** Puts the font's stylesheet and name on the page, or takes them off. */
function apply(font: GoogleFont | null) {
  const root = document.documentElement;
  document.getElementById(GOOGLE_FONT_LINK)?.remove();
  if (!font) {
    root.style.removeProperty(GOOGLE_FONT_VARIABLE);
    return;
  }
  const link = document.createElement('link');
  link.id = GOOGLE_FONT_LINK;
  link.rel = 'stylesheet';
  link.href = googleFontHref([[font[0], font[2]]]);
  document.head.append(link);
  root.style.setProperty(GOOGLE_FONT_VARIABLE, `"${font[0]}"`);
}

const listeners = new Set<() => void>();
let snapshot = read();

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

/** Keeps the font and shows it; null takes it away. */
export function setGoogleFont(font: GoogleFont | null) {
  try {
    if (font) localStorage.setItem(GOOGLE_FONT_KEY, JSON.stringify(font));
    else localStorage.removeItem(GOOGLE_FONT_KEY);
  } catch {
    // Not kept (a locked-down browser): the page still changes.
  }
  apply(font);
  snapshot = font;
  for (const listener of listeners) listener();
}

/** The kept Google font, or null. Re-renders when it changes. */
export function useGoogleFont(): GoogleFont | null {
  return useSyncExternalStore(
    subscribe,
    () => snapshot,
    () => null,
  );
}

// Previews: each row of the picker shows its name in its own face. Google
// sends only the letters of the name (`text=`), a few hundred bytes a row,
// and rows that show together go in one request.

const previewed = new Set<string>();
let waiting: GoogleFont[] = [];

/** At most this many families in one request, so its address stays short. */
const BATCH = 25;

function flush() {
  const fonts = waiting;
  waiting = [];
  for (let start = 0; start < fonts.length; start += BATCH) {
    const batch = fonts.slice(start, start + BATCH);
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    // One weight each: a family's first weight is one it has.
    link.href = googleFontHref(
      batch.map(([family, , weights]) => [
        family,
        weights.split(';')[0] ?? '400',
      ]),
      batch.map(([family]) => family).join(''),
    );
    document.head.append(link);
  }
}

/** Loads the letters of the family's name in its own face, once. */
export function previewGoogleFont(font: GoogleFont) {
  if (previewed.has(font[0])) return;
  previewed.add(font[0]);
  waiting.push(font);
  if (waiting.length === 1) queueMicrotask(flush);
}
