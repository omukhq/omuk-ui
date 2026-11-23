import { Button } from '@omuk/ui/button';
import { toast } from '@omuk/ui/sonner';
import { Playground } from '../../playground';
import { POSITIONS, setToastPosition } from './position-store';

const TYPES = [
  'default',
  'success',
  'error',
  'info',
  'warning',
  'loading',
] as const;

type Values = {
  type: (typeof TYPES)[number];
  message: string;
  description: string;
  actionLabel: string;
  position: (typeof POSITIONS)[number];
};

const INITIAL: Values = {
  type: 'success',
  message: 'Invite sent',
  description: 'Ada can join until Friday.',
  actionLabel: '',
  position: 'bottom-right',
};

/** A string as JavaScript source, in single quotes. */
function quote(text: string) {
  return `'${text.replaceAll('\\', '\\\\').replaceAll("'", "\\'")}'`;
}

function show({ type, message, description, actionLabel, position }: Values) {
  // The page has one Toaster: move it, then show.
  setToastPosition(position);
  const call = type === 'default' ? toast : toast[type];
  call(message, {
    description: description || undefined,
    action: actionLabel
      ? { label: actionLabel, onClick: () => toast('Done') }
      : undefined,
  });
}

function code({ type, message, description, actionLabel, position }: Values) {
  const call = type === 'default' ? 'toast' : `toast.${type}`;
  const options: string[] = [];
  if (description) options.push(`description: ${quote(description)}`);
  if (actionLabel) {
    options.push(
      `action: { label: ${quote(actionLabel)}, onClick: () => toast('Done') }`,
    );
  }
  const args =
    options.length === 0
      ? quote(message)
      : `${quote(message)}, {\n${options.map((option) => `  ${option},`).join('\n')}\n}`;
  const toaster =
    position === 'bottom-right'
      ? ''
      : `// Once, near the root of the app:\n<Toaster position="${position}" />\n\n`;
  const names = position === 'bottom-right' ? 'toast' : 'toast, Toaster';
  return `import { ${names} } from '@omuk/ui/sonner';

${toaster}${call}(${args});`;
}

export default function ToastPlayground() {
  return (
    <Playground
      initial={INITIAL}
      controls={[
        { name: 'type', kind: 'choice', options: TYPES },
        { name: 'message', kind: 'text' },
        { name: 'description', kind: 'text' },
        { name: 'actionLabel', kind: 'text' },
        { name: 'position', kind: 'choice', options: POSITIONS },
      ]}
      render={(values) => (
        <Button variant="outline" onClick={() => show(values)}>
          Show the toast
        </Button>
      )}
      code={code}
    />
  );
}
