import { cva, type VariantProps } from 'class-variance-authority';
import { type RenderProps, useRender } from './render';
import { Separator } from './separator';
import { cn } from './utils';

// Joined controls. Their edges are inset shadows, so each one after the
// first moves back by the edge's width to share the seam (`-ml-px`).
const buttonGroupVariants = cva(
  "flex w-fit items-stretch *:focus-visible:relative *:focus-visible:z-10 [&:has(>[data-slot=button-group])]:gap-2 [&:has(select[aria-hidden=true]:last-child)>[data-slot=select-trigger]:last-of-type]:rounded-r-md [&>[data-slot=select-trigger]:not([class*='w-'])]:w-fit [&>input]:flex-1",
  {
    variants: {
      orientation: {
        horizontal:
          '*:data-slot:rounded-r-none [&>[data-slot]:not(:has(~[data-slot]))]:rounded-r-md! [&>[data-slot]~[data-slot]]:rounded-l-none [&>[data-slot]~[data-slot]]:-ml-px',
        vertical:
          'flex-col *:data-slot:rounded-b-none [&>[data-slot]:not(:has(~[data-slot]))]:rounded-b-md! [&>[data-slot]~[data-slot]]:rounded-t-none [&>[data-slot]~[data-slot]]:-mt-px',
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
        "flex items-center gap-2 rounded-md bg-hover px-3 text-sm font-medium text-muted inset-ring inset-ring-border [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4",
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
