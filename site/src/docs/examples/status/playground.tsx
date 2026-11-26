import { Status } from 'omuk-ui/status';
import { jsx, Playground } from '../../playground';

const TONES = ['success', 'warning', 'danger', 'muted'] as const;

type Values = {
  children: string;
  tone: (typeof TONES)[number];
};

const INITIAL: Values = {
  children: 'Live',
  tone: 'success',
};

// The kit's own default: a tone of muted is left out of the code.
const DEFAULTS: Values = { ...INITIAL, tone: 'muted' };

export default function StatusPlayground() {
  return (
    <Playground
      initial={INITIAL}
      controls={[
        { name: 'children', kind: 'text' },
        { name: 'tone', kind: 'choice', options: TONES },
      ]}
      render={({ children, ...props }) => (
        <Status {...props}>{children}</Status>
      )}
      code={({ children, ...props }) =>
        `import { Status } from 'omuk-ui/status';\n\n${jsx('Status', props, DEFAULTS, children)}`
      }
    />
  );
}
