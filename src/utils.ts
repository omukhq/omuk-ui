import { type ClassValue, clsx } from 'clsx';
import { extendTailwindMerge } from 'tailwind-merge';

// The kit's class joiner: clsx, then tailwind-merge told about the theme's
// one size below xs (`text-2xs`, avatar letters), so a size and a colour on
// one element keep both, and about `squircle` (theme.css), a radius: a later
// one replaces an earlier `rounded-*`. The app's `cn` (packages/shared/src/utils.ts) is
// the same.
const twMerge = extendTailwindMerge({
  extend: {
    theme: {
      text: ['2xs'],
    },
    classGroups: {
      rounded: ['squircle'],
    },
  },
});

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
