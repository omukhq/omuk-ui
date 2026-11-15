import { XIcon } from 'lucide-react';
import type { ComponentProps } from 'react';
import { CHIP } from './recipes';
import { cn } from './utils';

// DESIGN.md, section 3, Field: a chip in a field (the invite emails). The
// combobox's chips (ComboboxChip) draw the same recipe.

type ChipProps = ComponentProps<'span'> & {
  /** Draws the remove button; it is called when pressed. */
  onRemove?: () => void;
  /** What a screen reader hears for the remove button. */
  removeLabel?: string;
};

function Chip({
  className,
  children,
  onRemove,
  removeLabel = 'Remove',
  ...props
}: ChipProps) {
  return (
    <span
      data-slot="chip"
      className={cn(CHIP, onRemove && 'pr-0.5', className)}
      {...props}
    >
      {children}
      {onRemove && (
        <button
          type="button"
          aria-label={removeLabel}
          className="inline-flex size-5 items-center justify-center rounded-sm text-muted outline-none hover:text-foreground focus-visible:focus-ring"
          onClick={onRemove}
        >
          <XIcon strokeWidth={1.5} className="size-4" />
        </button>
      )}
    </span>
  );
}

export { Chip };
