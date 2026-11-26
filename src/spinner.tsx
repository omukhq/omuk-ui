import type { ComponentProps } from 'react';
import { cn } from './utils';

/**
 * The loading spinner: an arc that grows, travels round and shrinks while
 * the ring turns. CSS keyframes (theme.css: `animate-spinner`,
 * `animate-spinner-arc`), not SVG animation, so reduced motion reaches it:
 * the ring turns slowly and the arc stays still (Modern Web Guidance,
 * spinner). On its own it is muted (decisions 11: accent means picked or
 * link, and a spinner is neither); inside a button it takes the button's
 * text colour (`text-current`), so it shows on a filled button.
 *
 * An indeterminate progress bar named "Loading": a screen reader says so
 * when it reaches it. It does not announce itself when it appears: an app
 * that must say "Loading" at once puts it in a status region already on the
 * page. Inside a button, Button gives it `role="img"`, so its name names the
 * button.
 */
function Spinner({ className, ...props }: ComponentProps<'svg'>) {
  return (
    <svg
      role="progressbar"
      aria-label="Loading"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
      stroke="currentColor"
      data-slot="spinner"
      className={cn('size-4 animate-spinner text-muted', className)}
      {...props}
    >
      <circle
        cx="12"
        cy="12"
        r="9.5"
        fill="none"
        strokeWidth="3"
        strokeLinecap="round"
        className="animate-spinner-arc"
      />
    </svg>
  );
}

export { Spinner };
