import { cva, type VariantProps } from 'class-variance-authority';
import type { ComponentProps } from 'react';
import { cn } from './utils';

// DESIGN.md, section 3, Badge · status dot: a small dot and its text in the
// same colour. Live, done, connected: success; check this: warning; failed:
// danger.

const statusVariants = cva(
  'inline-flex items-center gap-1 text-xs font-medium whitespace-nowrap',
  {
    variants: {
      tone: {
        success: 'text-success',
        warning: 'text-warning',
        danger: 'text-danger',
        muted: 'text-muted',
      },
    },
    defaultVariants: { tone: 'muted' },
  },
);

function Status({
  className,
  tone,
  children,
  ...props
}: ComponentProps<'span'> & VariantProps<typeof statusVariants>) {
  return (
    <span
      data-slot="status"
      className={cn(statusVariants({ tone }), className)}
      {...props}
    >
      <span aria-hidden className="size-2 shrink-0 rounded-full bg-current" />
      {children}
    </span>
  );
}

export { Status };
