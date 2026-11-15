import { type ClassValue, clsx } from 'clsx';
import { extendTailwindMerge } from 'tailwind-merge';

// The kit's class joiner: clsx, then tailwind-merge told about the theme's
// one size below xs (`text-2xs`, avatar letters), so a size and a colour on
// one element keep both. The app's `cn` (src/lib/utils.ts) is the same.
const twMerge = extendTailwindMerge({
  extend: {
    theme: {
      text: ['2xs'],
    },
  },
});

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
