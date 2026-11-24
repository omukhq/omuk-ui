import {
  ChevronLeftIcon,
  ChevronRightIcon,
  MoreHorizontalIcon,
} from 'lucide-react';
import { Button } from './button';
import { cn } from './utils';

// DESIGN.md, section 8, and decisions R22: previous, the pages, next, all
// small (32). The current page is the outlined button (the 2-wide control
// edge) at 600 with `aria-current="page"`; the other pages are ghost
// buttons; the arrows are icon-only ghost buttons and go muted (`disabled`)
// at the ends. Never a fade.

function Pagination({ className, ...props }: React.ComponentProps<'nav'>) {
  return (
    <nav
      role="navigation"
      aria-label="pagination"
      data-slot="pagination"
      className={cn('mx-auto flex w-full justify-center', className)}
      {...props}
    />
  );
}

function PaginationContent({
  className,
  ...props
}: React.ComponentProps<'ul'>) {
  return (
    <ul
      data-slot="pagination-content"
      className={cn('flex items-center gap-1', className)}
      {...props}
    />
  );
}

function PaginationItem({ ...props }: React.ComponentProps<'li'>) {
  return <li data-slot="pagination-item" {...props} />;
}

type PaginationLinkProps = {
  isActive?: boolean;
  /** Muted and out of the tab order: an arrow at the end, a page while loading. */
  disabled?: boolean;
} & Pick<React.ComponentProps<typeof Button>, 'size'> &
  React.ComponentProps<'a'>;

function PaginationLink({
  className,
  isActive,
  disabled,
  size = 'icon',
  ...props
}: PaginationLinkProps) {
  return (
    <Button
      variant={isActive ? 'outline' : 'ghost'}
      size={size}
      disabled={disabled}
      className={cn('tabular-nums', isActive && 'font-semibold', className)}
      nativeButton={false}
      render={
        <a
          aria-current={isActive ? 'page' : undefined}
          data-slot="pagination-link"
          data-active={isActive}
          {...props}
        />
      }
    />
  );
}

function PaginationPrevious({
  className,
  text = 'Previous',
  ...props
}: React.ComponentProps<typeof PaginationLink> & { text?: string }) {
  return (
    <PaginationLink
      aria-label="Go to previous page"
      className={className}
      {...props}
    >
      <ChevronLeftIcon strokeWidth={1.5} className="size-4" />
      <span className="sr-only">{text}</span>
    </PaginationLink>
  );
}

function PaginationNext({
  className,
  text = 'Next',
  ...props
}: React.ComponentProps<typeof PaginationLink> & { text?: string }) {
  return (
    <PaginationLink
      aria-label="Go to next page"
      className={className}
      {...props}
    >
      <span className="sr-only">{text}</span>
      <ChevronRightIcon strokeWidth={1.5} className="size-4" />
    </PaginationLink>
  );
}

function PaginationEllipsis({
  className,
  ...props
}: React.ComponentProps<'span'>) {
  return (
    <span
      aria-hidden
      data-slot="pagination-ellipsis"
      className={cn(
        'flex size-8 items-center justify-center text-muted',
        className,
      )}
      {...props}
    >
      <MoreHorizontalIcon strokeWidth={1.5} className="size-4" />
      <span className="sr-only">More pages</span>
    </span>
  );
}

export {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
};
