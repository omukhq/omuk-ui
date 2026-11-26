import { Label } from 'omuk-ui/label';
import { Textarea } from 'omuk-ui/textarea';
import { useId } from 'react';
import { jsx, Playground } from '../../playground';

type Values = {
  label: string;
  placeholder: string;
  disabled: boolean;
  readOnly: boolean;
  'aria-invalid': boolean;
};

const INITIAL: Values = {
  label: 'Notes',
  placeholder: 'What this secret is for',
  disabled: false,
  readOnly: false,
  'aria-invalid': false,
};

/** The textarea's own defaults: a prop at one of these is left out of the code. */
const DEFAULTS = { placeholder: '' };

function Preview({ label, ...props }: Values) {
  const id = useId();
  return (
    <div className="flex w-full max-w-sm flex-col gap-1">
      <Label htmlFor={id}>{label}</Label>
      <Textarea id={id} {...props} />
    </div>
  );
}

export default function TextareaPlayground() {
  return (
    <Playground
      initial={INITIAL}
      controls={[
        { name: 'label', kind: 'text' },
        { name: 'placeholder', kind: 'text' },
        { name: 'disabled', kind: 'boolean' },
        { name: 'readOnly', kind: 'boolean' },
        { name: 'aria-invalid', kind: 'boolean' },
      ]}
      render={(values) => <Preview {...values} />}
      code={({ label, ...props }) =>
        [
          "import { Label } from 'omuk-ui/label';",
          "import { Textarea } from 'omuk-ui/textarea';",
          '',
          '<div className="flex flex-col gap-1">',
          `  <Label htmlFor="notes">${label}</Label>`,
          `  ${jsx('Textarea', { id: 'notes', ...props }, DEFAULTS)}`,
          '</div>',
        ].join('\n')
      }
    />
  );
}
