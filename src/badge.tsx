'use client';

import { cva, type VariantProps } from 'class-variance-authority';
import { type RenderProps, useRender } from './render';
import { cn } from './utils';

// DESIGN.md, section 3, Badge: `px-2 rounded-full text-xs font-medium`.
// A plan label (PRO) is `plan`: the mark ground, accent text. Everything
// else is neutral: the hover fill, muted text. The root's variant names
// stay for shared code; `default` and `secondary` are both the neutral one.
const badgeVariants = cva(
  'group/badge inline-flex h-5 w-fit shrink-0 items-center justify-center gap-1 overflow-hidden rounded-full px-2 text-xs font-medium whitespace-nowrap transition-colors outline-none focus-visible:focus-ring [&>svg]:pointer-events-none [&>svg]:size-3',
  {
    variants: {
      variant: {
        default: 'bg-hover text-muted',
        secondary: 'bg-hover text-muted',
        plan: 'bg-mark text-accent',
        destructive: 'bg-hover text-danger',
        outline: 'text-muted inset-ring inset-ring-border',
        ghost: 'text-muted hover:bg-hover',
        link: 'text-accent underline-offset-4 hover:underline',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  },
);

function Badge({
  className,
  variant = 'default',
  render,
  ...props
}: RenderProps<'span'> & VariantProps<typeof badgeVariants>) {
  // Base UI writes its state as data attributes; ours does it by hand.
  return useRender(
    'span',
    {
      'data-slot': 'badge',
      'data-variant': variant ?? undefined,
      className: cn(badgeVariants({ variant }), className),
      ...props,
    },
    render,
    { slot: 'badge', variant },
  );
}

/**
 * The variants Badge actually implements, derived from the cva config rather
 * than restated — a hand-written union silently omits any variant added later,
 * and consumers then cannot use it.
 */
export type BadgeVariant = NonNullable<
  VariantProps<typeof badgeVariants>['variant']
>;

export { Badge, badgeVariants };
