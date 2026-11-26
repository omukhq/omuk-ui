'use client';

import { useId } from 'react';
import { cn } from './utils';

// DESIGN.md, section 8, Tables: the head is `text-xs font-semibold
// text-muted`, 36 tall; rows are 48, split by a 1-wide divider, with the
// hover fill under the pointer and the selected fill on a picked row
// (`data-selected`, or the older `data-state="selected"`). The lines are
// inset shadows on the cells (a `<tr>` does not draw one everywhere), so
// they never change a row's size.

/**
 * The scroll box, while the table is wider than it: in the Tab order (the
 * keys scroll it) and a region named by the table's caption. While the
 * table fits, a plain box: no empty Tab stop.
 */
function scrollBox(node: HTMLDivElement | null, captionId: string) {
  if (!node) return;
  const box = node;
  function update() {
    const caption = box.querySelector('caption');
    if (caption && !caption.id) caption.id = captionId;
    const scrolls = box.scrollWidth > box.clientWidth;
    if (scrolls) {
      box.tabIndex = 0;
      box.setAttribute('role', 'region');
      if (caption) box.setAttribute('aria-labelledby', caption.id);
    } else {
      box.removeAttribute('tabindex');
      box.removeAttribute('role');
      box.removeAttribute('aria-labelledby');
    }
  }
  update();
  const watch = new ResizeObserver(update);
  watch.observe(box);
  if (box.firstElementChild) watch.observe(box.firstElementChild);
  return () => watch.disconnect();
}

function Table({
  className,
  containerClassName,
  ...props
}: React.ComponentProps<'table'> & {
  /** On the scroll box around the table: a frame, a radius. */
  containerClassName?: string;
}) {
  const captionId = `${useId()}-caption`;
  return (
    <div
      ref={(node) => scrollBox(node, captionId)}
      data-slot="table-container"
      className={cn(
        'relative w-full overflow-x-auto rounded-sm outline-none focus-visible:focus-ring',
        containerClassName,
      )}
    >
      <table
        data-slot="table"
        className={cn(
          'w-full caption-bottom text-sm text-foreground',
          className,
        )}
        {...props}
      />
    </div>
  );
}

function TableHeader({ className, ...props }: React.ComponentProps<'thead'>) {
  return (
    <thead
      data-slot="table-header"
      className={cn('[&_tr]:hover:bg-transparent', className)}
      {...props}
    />
  );
}

function TableBody({ className, ...props }: React.ComponentProps<'tbody'>) {
  return <tbody data-slot="table-body" className={className} {...props} />;
}

function TableFooter({ className, ...props }: React.ComponentProps<'tfoot'>) {
  return (
    <tfoot
      data-slot="table-footer"
      className={cn(
        'bg-panel font-medium [&_tr]:hover:bg-transparent',
        className,
      )}
      {...props}
    />
  );
}

function TableRow({ className, ...props }: React.ComponentProps<'tr'>) {
  return (
    <tr
      data-slot="table-row"
      className={cn(
        'transition-colors hover:bg-hover has-aria-expanded:bg-hover data-selected:bg-selected data-[state=selected]:bg-selected [&>td]:border-b [&>th]:border-b',
        className,
      )}
      {...props}
    />
  );
}

function TableHead({ className, ...props }: React.ComponentProps<'th'>) {
  return (
    <th
      data-slot="table-head"
      className={cn(
        'h-9 px-3 text-left align-middle text-xs font-semibold whitespace-nowrap text-muted has-[[role=checkbox]]:pr-0',
        className,
      )}
      {...props}
    />
  );
}

function TableCell({ className, ...props }: React.ComponentProps<'td'>) {
  return (
    <td
      data-slot="table-cell"
      className={cn(
        'h-12 px-3 py-2 align-middle whitespace-nowrap has-[[role=checkbox]]:pr-0',
        className,
      )}
      {...props}
    />
  );
}

function TableCaption({
  className,
  ...props
}: React.ComponentProps<'caption'>) {
  return (
    <caption
      data-slot="table-caption"
      className={cn('mt-4 text-sm text-muted', className)}
      {...props}
    />
  );
}

export {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
};
