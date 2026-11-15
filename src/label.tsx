import { cn } from './utils';

// A field's label: medium weight above the field (DESIGN.md, section 3);
// muted, not faded, when its field or control is disabled.

function Label({ className, ...props }: React.ComponentProps<'label'>) {
  return (
    <label
      data-slot="label"
      className={cn(
        'flex items-center gap-2 text-sm font-medium text-foreground select-none group-data-disabled:pointer-events-none group-data-disabled:text-muted peer-disabled:cursor-not-allowed peer-disabled:text-muted',
        className,
      )}
      {...props}
    />
  );
}

export { Label };
