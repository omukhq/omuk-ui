import { Badge } from 'omuk-ui/badge';
import { jsx, Playground } from '../../playground';

const VARIANTS = [
  'default',
  'secondary',
  'plan',
  'destructive',
  'outline',
  'ghost',
  'link',
] as const;

type Values = {
  children: string;
  variant: (typeof VARIANTS)[number];
};

const INITIAL: Values = {
  children: 'Beta',
  variant: 'default',
};

export default function BadgePlayground() {
  return (
    <Playground
      initial={INITIAL}
      controls={[
        { name: 'children', kind: 'text' },
        { name: 'variant', kind: 'choice', options: VARIANTS },
      ]}
      render={({ children, ...props }) => <Badge {...props}>{children}</Badge>}
      code={({ children, ...props }) =>
        `import { Badge } from 'omuk-ui/badge';\n\n${jsx('Badge', props, INITIAL, children)}`
      }
    />
  );
}
