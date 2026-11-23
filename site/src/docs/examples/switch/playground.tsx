import { Label } from '@omuk/ui/label';
import { Switch } from '@omuk/ui/switch';
import { useId } from 'react';
import { jsx, Playground } from '../../playground';

const SIZES = ['default', 'sm'] as const;

type Values = {
  label: string;
  size: (typeof SIZES)[number];
  disabled: boolean;
  readOnly: boolean;
};

const INITIAL: Values = {
  label: 'Lock production',
  size: 'default',
  disabled: false,
  readOnly: false,
};

/** The switch's own defaults: a prop at one of these is left out of the code. */
const DEFAULTS = { size: 'default' };

function Preview({ label, ...props }: Values) {
  const id = useId();
  return (
    <div className="flex items-center gap-2">
      <Switch id={id} defaultChecked {...props} />
      <Label htmlFor={id} className="font-normal">
        {label}
      </Label>
    </div>
  );
}

export default function SwitchPlayground() {
  return (
    <Playground
      initial={INITIAL}
      controls={[
        { name: 'label', kind: 'text' },
        { name: 'size', kind: 'choice', options: SIZES },
        { name: 'disabled', kind: 'boolean' },
        { name: 'readOnly', kind: 'boolean' },
      ]}
      render={(values) => <Preview {...values} />}
      code={({ label, ...props }) =>
        [
          "import { Label } from '@omuk/ui/label';",
          "import { Switch } from '@omuk/ui/switch';",
          '',
          '<div className="flex items-center gap-2">',
          `  ${jsx('Switch', { id: 'lock', defaultChecked: true, ...props }, DEFAULTS)}`,
          `  <Label htmlFor="lock" className="font-normal">${label}</Label>`,
          '</div>',
        ].join('\n')
      }
    />
  );
}
