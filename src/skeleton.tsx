import { cn } from './utils';

/**
 * A bar standing in for content while it loads (DESIGN.md §9): `bg-hover`,
 * no shimmer, and only after 300 ms, so a fast load never flashes it. It
 * holds its place from the start: only its paint waits.
 */
function Skeleton({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="skeleton"
      className={cn(
        'rounded-sm bg-hover animate-in fade-in fill-mode-backwards delay-300',
        className,
      )}
      {...props}
    />
  );
}

export { Skeleton };
