import { cn } from './utils';

/**
 * A bar standing in for content while it loads (DESIGN.md §9): `bg-hover`,
 * no shimmer, and only after 300 ms, so a fast load never flashes it. It
 * holds its place from the start: only its paint waits. It starts clear
 * (`starting:`, CSS @starting-style) and fades in after the delay. An
 * opacity fade, so it stays with reduced motion.
 */
function Skeleton({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="skeleton"
      className={cn(
        'rounded-sm bg-hover transition-opacity delay-300 starting:opacity-0',
        className,
      )}
      {...props}
    />
  );
}

export { Skeleton };
