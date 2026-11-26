import { Avatar } from 'omuk-ui/avatar';
import { jsx, Playground } from '../../playground';

const KINDS = ['person', 'app', 'team'] as const;
const SIZES = ['sm', 'md', 'lg', 'xl', '2xl'] as const;

type Values = {
  children: string;
  kind: (typeof KINDS)[number];
  size: (typeof SIZES)[number];
  userId: string;
};

const INITIAL: Values = {
  children: 'AR',
  kind: 'person',
  size: 'xl',
  userId: 'user_42',
};

// The kit's own defaults: a prop at its default is left out of the code.
const DEFAULTS: Values = { ...INITIAL, size: 'md', userId: '' };

export default function AvatarPlayground() {
  return (
    <Playground
      initial={INITIAL}
      controls={[
        { name: 'children', kind: 'text' },
        { name: 'kind', kind: 'choice', options: KINDS },
        { name: 'size', kind: 'choice', options: SIZES },
        { name: 'userId', kind: 'text' },
      ]}
      render={({ children, userId, ...props }) => (
        <Avatar {...props} userId={userId || undefined}>
          {children}
        </Avatar>
      )}
      code={({ children, ...props }) =>
        `import { Avatar } from 'omuk-ui/avatar';\n\n${jsx('Avatar', props, DEFAULTS, children)}`
      }
    />
  );
}
