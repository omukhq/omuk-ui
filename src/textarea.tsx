'use client';

import { useFieldControl } from './field-context';
import { FIELD, FIELD_OFF } from './recipes';
import { cn } from './utils';

// A field (DESIGN.md, section 3) that grows with its text: down, never
// sideways. field-sizing-content also sizes the width to the longest line,
// so a line with no space to break at (a key, a URL) pushed the field past
// its container. The field keeps its container's width (w-full, min-w-0),
// and such a line wraps anywhere.

function Textarea({ className, ...props }: React.ComponentProps<'textarea'>) {
  const field = useFieldControl(props);
  return (
    <textarea
      data-slot="textarea"
      className={cn(
        FIELD,
        props.disabled && FIELD_OFF,
        // Grows up to 320, then scrolls. A browser without field-sizing
        // keeps a fixed height: there the person drags it taller.
        'flex field-sizing-content w-full min-w-0 min-h-16 max-h-80 resize-none px-3 py-2 wrap-anywhere not-supports-[field-sizing:content]:resize-y',
        className,
      )}
      {...props}
      {...field}
    />
  );
}

export { Textarea };
