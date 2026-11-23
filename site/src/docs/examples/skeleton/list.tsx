import { Skeleton } from '@omuk/ui/skeleton';
import { cn } from '@omuk/ui/utils';

// One width for each row's name, so the list does not look like a grid.
const NAME_WIDTHS = ['w-40', 'w-28', 'w-36'];

export default function SkeletonList() {
  return (
    <ul
      aria-busy
      aria-label="Loading the secrets"
      className="flex w-full max-w-md flex-col divide-y"
    >
      {NAME_WIDTHS.map((width) => (
        <li
          key={width}
          className="flex h-12 items-center justify-between gap-4"
        >
          <Skeleton className={cn('h-5', width)} />
          <Skeleton className="h-4 w-16" />
        </li>
      ))}
    </ul>
  );
}
