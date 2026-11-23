import { Checkbox } from '@omuk/ui/checkbox';
import { Label } from '@omuk/ui/label';
import { useId } from 'react';
import { jsx, Playground } from '../../playground';

type Values = {
  label: string;
  indeterminate: boolean;
  disabled: boolean;
  'aria-invalid': boolean;
};

const INITIAL: Values = {
  label: 'Keep me signed in',
  indeterminate: false,
  disabled: false,
  'aria-invalid': false,
};

function Preview({ label, ...props }: Values) {
  const id = useId();
  return (
    <div className="flex items-center gap-2">
      <Checkbox id={id} defaultChecked {...props} />
      <Label htmlFor={id} className="font-normal">
        {label}
      </Label>
    </div>
  );
}

export default function CheckboxPlayground() {
  return (
    <Playground
      initial={INITIAL}
      controls={[
        { name: 'label', kind: 'text' },
        { name: 'indeterminate', kind: 'boolean' },
        { name: 'disabled', kind: 'boolean' },
        { name: 'aria-invalid', kind: 'boolean' },
      ]}
      render={(values) => <Preview {...values} />}
      code={({ label, ...props }) =>
        [
          "import { Checkbox } from '@omuk/ui/checkbox';",
          "import { Label } from '@omuk/ui/label';",
          '',
          '<div className="flex items-center gap-2">',
          `  ${jsx('Checkbox', { id: 'remember', defaultChecked: true, ...props }, {})}`,
          `  <Label htmlFor="remember" className="font-normal">${label}</Label>`,
          '</div>',
        ].join('\n')
      }
    />
  );
}
