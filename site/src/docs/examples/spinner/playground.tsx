import { Spinner } from '@omuk/ui/spinner';
import { cn } from '@omuk/ui/utils';
import { jsx, Playground } from '../../playground';

// The values are whole class names, so Tailwind finds them in this file.
const SIZES = ['size-4', 'size-5', 'size-6', 'size-8'] as const;
const COLORS = ['text-muted', 'text-foreground', 'text-danger'] as const;

type Values = {
  'aria-label': string;
  size: (typeof SIZES)[number];
  color: (typeof COLORS)[number];
};

const INITIAL: Values = {
  'aria-label': 'Loading results',
  size: 'size-6',
  color: 'text-muted',
};

/** The classes that differ from the spinner's own `size-4 text-muted`. */
function classes({ size, color }: Values) {
  return cn(size !== 'size-4' && size, color !== 'text-muted' && color);
}

export default function SpinnerPlayground() {
  return (
    <Playground
      initial={INITIAL}
      controls={[
        { name: 'aria-label', kind: 'text' },
        { name: 'size', kind: 'choice', options: SIZES },
        { name: 'color', kind: 'choice', options: COLORS },
      ]}
      render={(values) => (
        <Spinner
          aria-label={values['aria-label']}
          className={classes(values)}
        />
      )}
      code={(values) => {
        const className = classes(values);
        return `import { Spinner } from '@omuk/ui/spinner';\n\n${jsx(
          'Spinner',
          {
            ...(className && { className }),
            'aria-label': values['aria-label'],
          },
          { 'aria-label': 'Loading' },
        )}`;
      }}
    />
  );
}
