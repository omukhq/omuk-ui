import { type ClassValue, clsx } from 'clsx';
import { extendTailwindMerge } from 'tailwind-merge';

// The kit's class joiner: clsx, then tailwind-merge told about the theme's
// one size below xs (`text-2xs`, avatar letters), so a size and a colour on
// one element keep both, and about `squircle` (theme.css), a radius: a later
// one replaces an earlier `rounded-*`, and about `edge-control` (theme.css),
// a ring width. The app's `cn` (packages/shared/src/utils.ts) is the same.
const twMerge = extendTailwindMerge({
  extend: {
    theme: {
      text: ['2xs'],
    },
    classGroups: {
      rounded: ['squircle'],
      // It and `inset-ring-2` replace each other; `inset-ring-control` (a
      // colour) stays beside it.
      'inset-ring-w': ['edge-control'],
    },
  },
});

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Whether a key press belongs to an input method (Japanese, Chinese,
 * Korean) still composing text, so Enter or an arrow is the IME's, not
 * ours. Safari ends the composition before the confirming Enter's keydown
 * (`isComposing` false), but gives it keyCode 229 (Modern Web Guidance,
 * ime-safe-enter-submit).
 */
export function isComposing(event: KeyboardEvent) {
  return event.isComposing || event.keyCode === 229;
}
