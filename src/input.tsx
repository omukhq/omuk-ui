import { FIELD } from './recipes';
import { cn } from './utils';

// DESIGN.md, section 3, Field: 36 tall, the 2-wide control edge (the same
// on hover), the field's focus ring. Error: `aria-invalid` turns the edge to
// danger. Disabled: hover fill and the 2-wide border edge.

function Input({ className, type, ...props }: React.ComponentProps<'input'>) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        FIELD,
        'h-9 px-3 file:inline-flex file:h-6 file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground',
        className,
      )}
      {...props}
    />
  );
}

export { Input };
