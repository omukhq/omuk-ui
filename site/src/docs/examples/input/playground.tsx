import { Input } from '@omuk/ui/input';
import { Label } from '@omuk/ui/label';
import { useId } from 'react';
import { jsx, Playground } from '../../playground';

const TYPES = ['text', 'email', 'password', 'url'] as const;

type Values = {
  label: string;
  placeholder: string;
  type: (typeof TYPES)[number];
  disabled: boolean;
  'aria-invalid': boolean;
};

const INITIAL: Values = {
  label: 'Project name',
  placeholder: 'Billing service',
  type: 'text',
  disabled: false,
  'aria-invalid': false,
};

/** The input's own defaults: a prop at one of these is left out of the code. */
const DEFAULTS = { placeholder: '', type: 'text' };

function Preview({ label, ...props }: Values) {
  const id = useId();
  return (
    <div className="flex w-full max-w-sm flex-col gap-1">
      <Label htmlFor={id}>{label}</Label>
      <Input id={id} {...props} />
    </div>
  );
}

export default function InputPlayground() {
  return (
    <Playground
      initial={INITIAL}
      controls={[
        { name: 'label', kind: 'text' },
        { name: 'placeholder', kind: 'text' },
        { name: 'type', kind: 'choice', options: TYPES },
        { name: 'disabled', kind: 'boolean' },
        { name: 'aria-invalid', kind: 'boolean' },
      ]}
      render={(values) => <Preview {...values} />}
      code={({ label, ...props }) =>
        [
          "import { Input } from '@omuk/ui/input';",
          "import { Label } from '@omuk/ui/label';",
          '',
          '<div className="flex flex-col gap-1">',
          `  <Label htmlFor="name">${label}</Label>`,
          `  ${jsx('Input', { id: 'name', ...props }, DEFAULTS)}`,
          '</div>',
        ].join('\n')
      }
    />
  );
}
