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
      <span className="truncate [[aria-selected=true]_&]:font-medium [[aria-checked=true]_&]:font-medium">
        {title}
      </span>
      {description && (
        <span className="truncate text-xs text-muted">{description}</span>
      )}
    </span>
  );
}

export { OptionText };
