import { cva, type VariantProps } from 'class-variance-authority';
import {
  type ComponentPropsWithRef,
  createContext,
  use,
  useState,
} from 'react';
import { moveAndPick } from './radio-group';
import { cn } from './utils';

// DESIGN.md, section 3, Segmented control: picks one of a few settings
// (Live/Split, theme, width, text size). A radio group to assistive tech:
// one tab stop, the arrow keys move and pick. The track is the control's
// height; the chosen segment is raised (`bg-raised shadow-sm`), where you are.

const segmentedVariants = cva(
  'inline-flex w-fit items-stretch gap-0.5 rounded-lg bg-hover p-1',
  {
    variants: {
      size: {
        lg: 'h-9',
        default: 'h-8',
      },
    },
    defaultVariants: { size: 'lg' },
  },
);

type SegmentedState = {
  value: string | null;
  pick: (value: string) => void;
};

const SegmentedContext = createContext<SegmentedState | null>(null);

type SegmentedProps = Omit<
  ComponentPropsWithRef<'div'>,
  'defaultValue' | 'onChange'
> &
  VariantProps<typeof segmentedVariants> & {
    value?: string | null;
    defaultValue?: string | null;
    onValueChange?: (value: string) => void;
  };

function Segmented({
  className,
  size,
  value: controlled,
  defaultValue = null,
  onValueChange,
  ...props
}: SegmentedProps) {
  const [own, setOwn] = useState(defaultValue);
  const value = controlled === undefined ? own : controlled;
  function pick(next: string) {
    if (next === value) return;
    onValueChange?.(next);
    setOwn(next);
  }
  return (
    <SegmentedContext value={{ value, pick }}>
      <div
        role="radiogroup"
        data-slot="segmented"
        className={cn(segmentedVariants({ size }), className)}
        onKeyDown={moveAndPick}
        {...props}
      />
    </SegmentedContext>
  );
}

function SegmentedItem({
  className,
  value,
  ...props
}: Omit<ComponentPropsWithRef<'button'>, 'value'> & { value: string }) {
  const segmented = use(SegmentedContext);
  if (!segmented) throw new Error('A segment must be inside <Segmented>.');
  const chosen = segmented.value === value;
  return (
    <button
      type="button"
      role="radio"
      aria-checked={chosen}
      tabIndex={chosen || segmented.value === null ? 0 : -1}
      data-slot="segmented-item"
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-md px-3 text-sm font-medium whitespace-nowrap text-foreground outline-none transition-colors hover:bg-hover focus-visible:focus-ring disabled:cursor-not-allowed disabled:text-muted aria-checked:bg-raised aria-checked:shadow-sm aria-checked:focus-visible:focus-ring [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
        className,
      )}
      onClick={() => segmented.pick(value)}
      {...props}
    />
  );
}

export { Segmented, SegmentedItem };
