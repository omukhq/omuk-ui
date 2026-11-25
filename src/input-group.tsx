import { cva, type VariantProps } from 'class-variance-authority';
import { Button } from './button';
import { useFieldControl } from './field-context';
import {
  FIELD_SIZE,
  FIELD_TEXT,
  FIELD_TEXT_OFF,
  FIELD_WRAPPER_EDGE,
} from './recipes';
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

// Sizes: the Button's heights (FIELD_SIZE: xs 24, sm 28, md 32, lg 36;
// owner 24 Nov 2026). Edge: as every field (FIELD_WRAPPER_EDGE); its width is the
// --edge-control token (theme.css), not a prop (owner, 24 Nov 2026).
const inputGroupVariants = cva('', {
  variants: {
    size: FIELD_SIZE,
  },
  defaultVariants: { size: 'md' },
});

function InputGroup({
  className,
  size,
  stacked = false,
  disabled = false,
  ...props
}: React.ComponentProps<'div'> &
  VariantProps<typeof inputGroupVariants> & {
    /**
     * A label above or below the input (an addon `block-start` or
     * `block-end`), or a textarea: the group grows in height. Off, a
     * one-line field carries none of these classes.
     */
    stacked?: boolean;
    /** The hover fill, the border edge and muted text. */
    disabled?: boolean;
  }) {
  return (
    <div
      data-slot="input-group"
      data-disabled={disabled ? '' : undefined}
      role="group"
      className={cn(
        'group/input-group relative flex w-full min-w-0 items-center rounded-md bg-page text-sm text-foreground transition-shadow outline-none',
        FIELD_WRAPPER_EDGE,
        inputGroupVariants({ size }),
        '[&:has(>[data-align=inline-end])>input]:pr-2 [&:has(>[data-align=inline-start])>input]:pl-2',
        // Only when so (the group knows): a field at rest carries none.
        stacked &&
          'h-auto flex-col [&:has(>[data-align=block-end])>input]:pt-3 [&:has(>[data-align=block-start])>input]:pb-3',
        disabled && 'bg-hover text-muted edge-control inset-ring-border',
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
      md: '',
      // Every icon button in a field is 24 (owner, 18 Nov 2026): the
      // combobox's chevron and clear, the date picker's, a search's. `icon`
      // stays as a name for callers.
      'icon-xs':
        'size-6 rounded-sm p-0 text-muted hover:text-foreground aria-pressed:bg-transparent aria-pressed:hover:bg-hover',
      icon: 'size-6 rounded-sm p-0 text-muted hover:text-foreground aria-pressed:bg-transparent aria-pressed:hover:bg-hover',
    },
  },
  // A text button in a field takes its own size; an icon button is 24.
  defaultVariants: {
    size: 'md',
  },
});

function InputGroupButton({
  className,
  type = 'button',
  variant = 'ghost',
  size = 'md',
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
  const field = useFieldControl(props);
  return (
    <input
      data-slot="input-group-control"
      className={cn(
        FIELD_TEXT,
        'h-full flex-1 rounded-none px-3',
        props.disabled && FIELD_TEXT_OFF,
        className,
      )}
      {...props}
      {...field}
    />
  );
}

function InputGroupTextarea({
  className,
  ...props
}: React.ComponentProps<'textarea'>) {
  const field = useFieldControl(props);
  return (
    <textarea
      data-slot="input-group-control"
      className={cn(
        FIELD_TEXT,
        'flex field-sizing-content min-h-16 flex-1 resize-none rounded-none px-3 py-2',
        props.disabled && FIELD_TEXT_OFF,
        className,
      )}
      {...props}
      {...field}
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
