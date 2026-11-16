import type { ComponentProps } from 'react';
import { type RenderProps, useRender } from './render';
import { cn } from './utils';

// DESIGN.md, section 3, List row: the sidebar's docs, the outline's
// headings, history versions, the folder picker. 32 tall; the pointer's row
// takes the hover fill; the current row takes the selected tint, flat (no
// shadow, no bar), at 500, and says so with `aria-current` (decisions, R31).
// Hovered, the current row darkens a little more: the hover tint drawn over
// the selected one. Icons are muted, the current row's in the text colour.
// The row sits on a page-coloured sidebar, where 4% and 8% read apart.
// A child row's content steps in
// by `4` per level (an empty `before:` box; its `-mr-2` cancels the gap),
// and its fill stays the row's full width. A <button> unless `render`
// draws a link.

/** The current row: the selected tint, and the hover tint over it on hover. */
const CURRENT_ROW =
  'aria-[current]:bg-selected aria-[current]:font-medium aria-[current]:hover:bg-selected aria-[current]:hover:bg-linear-to-r aria-[current]:hover:from-hover aria-[current]:hover:to-hover [&[aria-current]_svg]:text-foreground';

/** The step in for each level of the tree, from the top level down. */
const LEVELS = [
  '',
  'before:w-4',
  'before:w-8',
  'before:w-12',
  'before:w-16',
].map((width) => width && `${width} before:-mr-2 before:shrink-0`);

type ListRowProps = RenderProps<'button'> & {
  /** Where you are: the open doc, the current heading. */
  current?: boolean;
  /** How deep in the tree the row is (0 at the top). */
  level?: number;
};

function ListRow({
  className,
  current = false,
  level = 0,
  render,
  ...props
}: ListRowProps) {
  return useRender(
    'button',
    {
      type: render ? undefined : 'button',
      'aria-current': current ? 'page' : undefined,
      'data-slot': 'list-row',
      className: cn(
        "flex h-8 w-full min-w-0 items-center gap-2 rounded-md px-3 text-left text-sm text-foreground outline-none transition-colors select-none hover:bg-hover focus-visible:focus-ring disabled:text-muted [&_svg]:shrink-0 [&_svg]:text-muted [&_svg:not([class*='size-'])]:size-4",
        CURRENT_ROW,
        LEVELS[Math.min(level, LEVELS.length - 1)],
        className,
      ),
      ...props,
    },
    render,
  );
}

/** Small muted text at the end of a row: a time, a count. */
function ListRowMeta({ className, ...props }: ComponentProps<'span'>) {
  return (
    <span
      data-slot="list-row-meta"
      className={cn('ml-auto shrink-0 text-xs text-muted', className)}
      {...props}
    />
  );
}

export { ListRow, ListRowMeta };
