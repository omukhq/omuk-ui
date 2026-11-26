'use client';

import { cva, type VariantProps } from 'class-variance-authority';
import { type RenderProps, useRender } from './render';
import { Separator } from './separator';
import { cn } from './utils';

// Joined controls. Their edges are inset shadows, so each one after the
// first moves back by the edge's width (--edge-control, theme.css) to share
// one seam. The control under the pointer or the focus comes to the front,
// so its darker edge is not hidden under its neighbour's.
const buttonGroupVariants = cva(
  "flex w-fit items-stretch *:hover:relative *:hover:z-10 *:focus-visible:relative *:focus-visible:z-20 [&:has(>[data-slot=button-group])]:gap-2 [&:has(select[aria-hidden=true]:last-child)>[data-slot=select-trigger]:last-of-type]:rounded-r-md [&>[data-slot=select-trigger]:not([class*='w-'])]:w-fit [&>input]:flex-1",
  {
    variants: {
      orientation: {
        // Beside a field or a text part, a button takes the row's height, so
        // every part of the row lines up. A row of buttons only keeps their
        // own height: with nothing taller, h-auto shrank them to their text.
        // A separator is not taller either.
        horizontal:
          'has-[>:not([data-slot=button],[data-slot=button-group-separator])]:*:data-[slot=button]:h-auto *:data-slot:rounded-r-none [&>[data-slot]:not(:has(~[data-slot]))]:rounded-r-md! [&>[data-slot]~[data-slot]]:rounded-l-none [&>[data-slot]~[data-slot]]:-ml-(--edge-control)',
        vertical:
          'flex-col *:data-slot:rounded-b-none [&>[data-slot]:not(:has(~[data-slot]))]:rounded-b-md! [&>[data-slot]~[data-slot]]:rounded-t-none [&>[data-slot]~[data-slot]]:-mt-(--edge-control)',
      },
    },
    defaultVariants: {
      orientation: 'horizontal',
    },
  },
);

function ButtonGroup({
  className,
  orientation,
  ...props
}: React.ComponentProps<'div'> & VariantProps<typeof buttonGroupVariants>) {
  return (
    <div
      role="group"
      data-slot="button-group"
      data-orientation={orientation}
      className={cn(buttonGroupVariants({ orientation }), className)}
      {...props}
    />
  );
}

function ButtonGroupText({ className, render, ...props }: RenderProps<'div'>) {
  return useRender(
    'div',
    {
      // Our useRender passes state to a render function only; Base UI also
      // writes it to the DOM, so the slot is set here as an attribute.
      'data-slot': 'button-group-text',
      className: cn(
        // The controls' edge, so it shares their seam (button-group above).
        "flex items-center gap-2 rounded-md bg-hover px-3 text-sm font-medium text-muted edge-control inset-ring-control [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4",
        className,
      ),
      ...props,
    },
    render,
    { slot: 'button-group-text' },
  );
}

function ButtonGroupSeparator({
  className,
  orientation = 'vertical',
  ...props
}: React.ComponentProps<typeof Separator>) {
  return (
    <Separator
      data-slot="button-group-separator"
      orientation={orientation}
      className={cn(
        'relative self-stretch bg-border data-horizontal:mx-px data-horizontal:w-auto data-vertical:my-px data-vertical:h-auto',
        className,
      )}
      {...props}
    />
  );
}

export {
  ButtonGroup,
  ButtonGroupSeparator,
  ButtonGroupText,
  buttonGroupVariants,
};
