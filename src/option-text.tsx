import type { ComponentProps, ReactNode } from 'react';
import { cn } from './utils';

// DESIGN.md, section 3, the two-line row (the / menu, select options,
// versions): a title over a small muted description. Put it inside a
// SelectItem, a ComboboxItem or a menu item; the row grows to fit. The
// picked option's title is medium (the current item); the others regular.

type OptionTextProps = Omit<ComponentProps<'span'>, 'title'> & {
  title: ReactNode;
  description?: ReactNode;
};

function OptionText({
  title,
  description,
  className,
  ...props
}: OptionTextProps) {
  return (
    <span
      data-slot="option-text"
      className={cn('flex min-w-0 flex-1 flex-col', className)}
      {...props}
    >
      <span className="truncate in-aria-selected:font-medium in-aria-checked:font-medium">
        {title}
      </span>
      {description && (
        <span className="truncate text-xs text-muted">
          {/* A pause between the two lines for a screen reader: without
              it, the title and the description ran on as one phrase. */}
          <span className="sr-only">, </span>
          {description}
        </span>
      )}
    </span>
  );
}

export { OptionText };
