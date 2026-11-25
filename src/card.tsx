import { cva } from 'class-variance-authority';
import { cn } from './utils';

// DESIGN.md, section 3, Card: `p-4` (`p-3` small), `rounded-lg bg-raised
// shadow-sm`. Raised works on the page and on the panel (dashboards), in
// light and dark: in dark mode it is lighter than both (decisions 13). Comments, history changes and settings groups are cards; the
// title is semibold. The card pads itself, so its parts do not; a header or
// a footer with a line (`border-b`, `border-t`, or the old border classes)
// keeps a gap to it.

const cardVariants = cva(
  'group/card flex flex-col overflow-hidden rounded-lg bg-raised text-sm text-foreground shadow-sm forced-edge',
  {
    variants: {
      size: {
        sm: 'gap-3 p-3',
        md: 'gap-4 p-4',
      },
    },
    defaultVariants: { size: 'md' },
  },
);

function Card({
  className,
  size = 'md',
  ...props
}: React.ComponentProps<'div'> & { size?: 'sm' | 'md' }) {
  return (
    <div
      data-slot="card"
      data-size={size}
      className={cn(cardVariants({ size }), className)}
      {...props}
    />
  );
}

function CardHeader({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="card-header"
      className={cn(
        // One column; an action (col-start-2) adds an auto one beside it.
        'group/card-header @container/card-header grid auto-rows-min grid-cols-1 items-start gap-1 [&.border-b]:pb-4 [&.border-b]:pb-4',
        className,
      )}
      {...props}
    />
  );
}

function CardTitle({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="card-title"
      className={cn('text-sm font-semibold', className)}
      {...props}
    />
  );
}

function CardDescription({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="card-description"
      className={cn('text-sm text-muted', className)}
      {...props}
    />
  );
}

function CardAction({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="card-action"
      className={cn(
        'col-start-2 row-span-2 row-start-1 self-start justify-self-end text-xs text-muted',
        className,
      )}
      {...props}
    />
  );
}

function CardContent({ className, ...props }: React.ComponentProps<'div'>) {
  return <div data-slot="card-content" className={cn(className)} {...props} />;
}

function CardFooter({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="card-footer"
      className={cn(
        'flex items-center [&.border-t]:pt-4 [&.border-t]:pt-4',
        className,
      )}
      {...props}
    />
  );
}

export {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
};
