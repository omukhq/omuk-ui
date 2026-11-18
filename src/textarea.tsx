import { FIELD, FIELD_OFF } from './recipes';
import { cn } from './utils';

// A field (DESIGN.md, section 3) that grows with its text.

function Textarea({ className, ...props }: React.ComponentProps<'textarea'>) {
  return (
    <textarea
      data-slot="textarea"
      className={cn(
        FIELD,
        props.disabled && FIELD_OFF,
        'flex field-sizing-content min-h-16 px-3 py-2',
        className,
      )}
      {...props}
    />
  );
}

export { Textarea };
