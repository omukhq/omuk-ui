import { useFieldControl } from './field-context';
import { FIELD, FIELD_OFF, FIELD_SIZE, type FieldSize } from './recipes';
import { cn } from './utils';

// DESIGN.md, section 3, Field: the Button's heights (xs 24, sm 28, md 32,
// lg 36), the 2-wide control edge (the same on hover), the field's focus
// ring. Error: `aria-invalid` turns the edge to danger. Disabled: hover fill
// and the 2-wide border edge.

type InputProps = Omit<React.ComponentProps<'input'>, 'size'> & {
  /** The height, as Button's: xs 24, sm 28, md 32 (default), lg 36. */
  size?: FieldSize;
};

function Input({ className, type, size = 'md', ...props }: InputProps) {
  const field = useFieldControl(props);
  return (
    <input
      type={type}
      data-slot="input"
      data-size={size}
      className={cn(
        FIELD,
        props.disabled && FIELD_OFF,
        FIELD_SIZE[size],
        size === 'xs' ? 'px-2' : 'px-3',
        'file:inline-flex file:h-6 file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground',
        className,
      )}
      {...props}
      {...field}
    />
  );
}

export type { InputProps };
export { Input };
