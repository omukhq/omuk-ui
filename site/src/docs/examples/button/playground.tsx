import { Button } from '@omuk/ui/button';
import { jsx, Playground } from '../../playground';

const VARIANTS = [
  'default',
  'outline',
  'ghost',
  'destructive',
  'danger-confirm',
  'link',
] as const;
const SIZES = ['xs', 'sm', 'md', 'lg'] as const;

type Values = {
  children: string;
  variant: (typeof VARIANTS)[number];
  size: (typeof SIZES)[number];
  isLoading: boolean;
  disabled: boolean;
};

const INITIAL: Values = {
  children: 'Save',
  variant: 'default',
  size: 'md',
  isLoading: false,
  disabled: false,
};

export default function ButtonPlayground() {
  return (
    <Playground
      initial={INITIAL}
      controls={[
        { name: 'children', kind: 'text' },
        { name: 'variant', kind: 'choice', options: VARIANTS },
        { name: 'size', kind: 'choice', options: SIZES },
        { name: 'isLoading', kind: 'boolean' },
        { name: 'disabled', kind: 'boolean' },
      ]}
      render={({ children, ...props }) => (
        <Button {...props} loadingLabel="Saving">
          {children}
        </Button>
      )}
      code={({ children, ...props }) =>
        `import { Button } from '@omuk/ui/button';\n\n${jsx('Button', props, INITIAL, children)}`
      }
    />
  );
}
