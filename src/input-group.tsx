import { cva, type VariantProps } from 'class-variance-authority';
import { Button } from './button';
import { FIELD_TEXT, FIELD_WRAPPER_EDGE } from './recipes';
import { cn } from './utils';

// DESIGN.md, section 3, Field: the group is the field's box, and the input
// inside it has none. Search: an icon at the start; a prefix
// (`markpad.md/t/`): muted text at the start, in the caller's mono face.
//
// Field with a trailing action (show password, clear, copy): an
// InputGroupButton of size `icon` in an `inline-end` addon. The addon's
// end padding (4) puts the 32 button 4 from the 36 field's end and 2 from
// its top and bottom. The button is ghost with no fill or edge at rest, its icon muted;
// hover fills it and darkens the icon. A click keeps the focus and the
// caret in the text. Only the focused part rings: the field while its text
// has focus, the button when the keyboard reaches it.

// Sizes (R48, the Button's names): lg 36 (`h-9`, the default for a
// field), default 32 (`h-8`, a sidebar's search). Edges: the
// control edge (`inset-ring-2`), or `thin` (`inset-ring`), the sidebar's
// (owner, 15 Nov 2026).
const inputGroupVariants = cva('', {
  variants: {
    size: { default: 'h-8', lg: 'h-9' },
    edge: { default: '', thin: 'inset-ring' },
  },
  defaultVariants: { size: 'lg', edge: 'default' },
});

function InputGroup({
  className,
  size,
  edge,
  ...props
}: React.ComponentProps<'div'> & VariantProps<typeof inputGroupVariants>) {
  return (
    <div
      data-slot="input-group"
      role="group"
      className={cn(
        'group/input-group relative flex w-full min-w-0 items-center rounded-md bg-page text-sm text-foreground transition-shadow outline-none data-disabled:bg-hover data-disabled:text-muted data-disabled:inset-ring data-disabled:inset-ring-border',
        FIELD_WRAPPER_EDGE,
        inputGroupVariants({ size, edge }),
        // The search field at the top of a combobox list: the list is the
        // focus, so the field keeps its hover edge and takes no ring.
        'in-data-[slot=combobox-content]:has-[input:focus-visible]:inset-ring-2 in-data-[slot=combobox-content]:has-[input:focus-visible]:inset-ring-outline in-data-[slot=combobox-content]:has-[input:focus-visible]:ring-0', // design-ok: selectors, not values
        '[&:has(>[data-align=block-end])]:h-auto [&:has(>[data-align=block-end])]:flex-col [&:has(>[data-align=block-start])]:h-auto [&:has(>[data-align=block-start])]:flex-col [&:has(>textarea)]:h-auto',
        '[&:has(>[data-align=block-end])>input]:pt-3 [&:has(>[data-align=block-start])>input]:pb-3 [&:has(>[data-align=inline-end])>input]:pr-2 [&:has(>[data-align=inline-start])>input]:pl-2',
        className,
      )}
      {...props}
    />
  );
}

const inputGroupAddonVariants = cva(
  "flex h-auto cursor-text items-center justify-center gap-2 text-sm text-muted select-none [&>kbd]:rounded-sm [&>svg]:pointer-events-none [&>svg:not([class*='size-'])]:size-4",
  {
    variants: {
      align: {
        'inline-start': 'order-first pl-3 [&:has(>button)]:pl-1',
        'inline-end': 'order-last pr-3 [&:has(>button)]:pr-1',
        'block-start': 'order-first w-full justify-start px-3 pt-2',
        'block-end': 'order-last w-full justify-start px-3 pb-2',
      },
    },
    defaultVariants: {
      align: 'inline-start',
    },
  },
);

function InputGroupAddon({
  className,
  align = 'inline-start',
  ...props
}: React.ComponentProps<'div'> & VariantProps<typeof inputGroupAddonVariants>) {
  return (
    <div
      role="group"
      data-slot="input-group-addon"
      data-align={align}
      className={cn(inputGroupAddonVariants({ align }), className)}
      onClick={(e) => {
        if ((e.target as HTMLElement).closest('button')) {
          return;
        }
        e.currentTarget.parentElement?.querySelector('input')?.focus();
      }}
      {...props}
    />
  );
}

const inputGroupButtonVariants = cva('flex items-center gap-2 text-sm', {
  variants: {
    size: {
      xs: 'h-6 gap-1 rounded-sm px-2',
      default: '',
      // The trailing action in a 32 field (a table's search): 24, still 4
      // from the edge, the same muted icon.
      'icon-xs':
        'size-6 rounded-sm p-0 text-muted hover:text-foreground aria-pressed:bg-transparent aria-pressed:hover:bg-hover',
      // The trailing action: 32 square, radius 4 (the field's 8 less the 4
      // around it), the icon muted until hovered, no fill when pressed.
      icon: 'size-8 rounded-sm p-0 text-muted hover:text-foreground aria-pressed:bg-transparent aria-pressed:hover:bg-hover',
    },
  },
  // A button in a field is 32 (default): xs (24) is only for dense lists
  // and tables (DESIGN.md rule 3).
  defaultVariants: {
    size: 'default',
  },
});

function InputGroupButton({
  className,
  type = 'button',
  variant = 'ghost',
  size = 'default',
  onMouseDown,
  ...props
}: Omit<React.ComponentProps<typeof Button>, 'size' | 'type'> &
  VariantProps<typeof inputGroupButtonVariants> & {
    type?: 'button' | 'submit' | 'reset';
  }) {
  return (
    <Button
      type={type}
      data-size={size}
      variant={variant}
      // The Button's own size of the same name, so the Button draws the
      // same square as the addon's recipe.
      size={size}
      className={cn(inputGroupButtonVariants({ size }), className)}
      // A pointer press leaves the focus, and the caret, in the field's text.
      onMouseDown={(event) => {
        onMouseDown?.(event);
        if (!event.defaultPrevented) event.preventDefault();
      }}
      {...props}
    />
  );
}

function InputGroupText({ className, ...props }: React.ComponentProps<'span'>) {
  return (
    <span
      className={cn(
        "flex items-center gap-2 text-sm text-muted [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4",
        className,
      )}
      {...props}
    />
  );
}

function InputGroupInput({
  className,
  ...props
}: React.ComponentProps<'input'>) {
  return (
    <input
      data-slot="input-group-control"
      className={cn(FIELD_TEXT, 'h-full flex-1 rounded-none px-3', className)}
      {...props}
    />
  );
}

function InputGroupTextarea({
  className,
  ...props
}: React.ComponentProps<'textarea'>) {
  return (
    <textarea
      data-slot="input-group-control"
      className={cn(
        FIELD_TEXT,
        'flex field-sizing-content min-h-16 flex-1 resize-none rounded-none px-3 py-2',
        className,
      )}
      {...props}
    />
  );
}

export {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
  InputGroupText,
  InputGroupTextarea,
};
