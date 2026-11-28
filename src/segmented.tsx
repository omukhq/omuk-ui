'use client';

import { cva, type VariantProps } from 'class-variance-authority';
import {
  type ComponentPropsWithRef,
  type CSSProperties,
  createContext,
  use,
  useId,
  useState,
} from 'react';
import { moveAndPick } from './radio-group';
import { cn } from './utils';

// DESIGN.md, section 3, Segmented control: picks one of a few settings
// (Live/Split, theme, width, text size). A radio group to assistive tech:
// one tab stop, the arrow keys move and pick. The segments have the height;
// the track only wraps them in its padding (owner, 28 Nov 2026). The chosen
// segment is raised (`bg-raised shadow-sm`), where you are.
//
// Segment + track padding = the Button's heights (owner, 24 Nov 2026):
// sm 20 + 8 = 28, md 24 + 8 = 32 (the default), lg 28 + 8 = 36. The padding is
// p-1 at every size: the chosen fill's shadow (--elevation-sm) reaches below
// it, and with p-0.5 no track showed under the fill in dark mode.

const segmentedVariants = cva(
  'inline-flex w-fit items-center gap-0.5 rounded-lg bg-hover p-1',
  {
    variants: {
      // The size is the segments' height (SegmentedItem reads data-size).
      size: { sm: '', md: '', lg: '' },
    },
    defaultVariants: { size: 'md' },
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
  style,
  ...props
}: SegmentedProps) {
  // The anchor the sliding fill follows (theme.css), one per track.
  const anchor = `--segmented-${useId().replace(/\W/g, '')}`;
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
        data-size={size ?? 'md'}
        className={cn(segmentedVariants({ size }), className)}
        style={{ '--segmented-anchor': anchor, ...style } as CSSProperties}
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
        "inline-flex h-6 items-center justify-center gap-2 rounded-md px-3 text-sm in-data-[size=sm]:h-5 in-data-[size=sm]:px-2 in-data-[size=sm]:text-xs in-data-[size=lg]:h-7 whitespace-nowrap text-foreground outline-none transition-colors focus-visible:focus-ring [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
        // Chosen and disabled only when so (the item knows).
        // The hover fill only on the others: it would cover the raised one.
        chosen ? 'bg-raised shadow-sm' : 'hover:bg-hover',
        props.disabled && 'cursor-not-allowed text-muted',
        className,
      )}
      onClick={() => segmented.pick(value)}
      {...props}
    />
  );
}

export { Segmented, SegmentedItem };
