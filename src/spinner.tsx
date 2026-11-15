import type { ComponentProps } from 'react';
import { cn } from './utils';

/**
 * The loading spinner: an arc that grows, travels round and shrinks while
 * the ring turns. Drawn with SVG animation, so it needs no CSS keyframes.
 * On its own it is muted (decisions 11: accent means picked or link, and a
 * spinner is neither); inside a button it takes the button's text colour
 * (`text-current`), so it shows on a filled button.
 */
function Spinner({ className, ...props }: ComponentProps<'svg'>) {
  return (
    <svg
      role="status"
      aria-label="Loading"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
      stroke="currentColor"
      data-slot="spinner"
      className={cn('size-4 text-muted', className)}
      {...props}
    >
      <g>
        <circle
          cx="12"
          cy="12"
          r="9.5"
          fill="none"
          strokeWidth="3"
          strokeLinecap="round"
        >
          <animate
            attributeName="stroke-dasharray"
            dur="1.5s"
            calcMode="spline"
            values="0 150;42 150;42 150;42 150"
            keyTimes="0;0.475;0.95;1"
            keySplines="0.42,0,0.58,1;0.42,0,0.58,1;0.42,0,0.58,1"
            repeatCount="indefinite"
          />
          <animate
            attributeName="stroke-dashoffset"
            dur="1.5s"
            calcMode="spline"
            values="0;-16;-59;-59"
            keyTimes="0;0.475;0.95;1"
            keySplines="0.42,0,0.58,1;0.42,0,0.58,1;0.42,0,0.58,1"
            repeatCount="indefinite"
          />
        </circle>
        <animateTransform
          attributeName="transform"
          type="rotate"
          dur="2s"
          values="0 12 12;360 12 12"
          repeatCount="indefinite"
        />
      </g>
    </svg>
  );
}

export { Spinner };
