import { Checkbox } from 'omuk-ui/checkbox';
import { Input } from 'omuk-ui/input';
import { Label } from 'omuk-ui/label';
import { Switch } from 'omuk-ui/switch';
import { useId } from 'react';
import { jsx, Playground } from '../../playground';

/** What the label names. A field takes the label above; a control, after. */
const CONTROLS = ['Input', 'Checkbox', 'Switch'] as const;

type Values = {
  children: string;
  control: (typeof CONTROLS)[number];
  disabled: boolean;
};

const INITIAL: Values = {
  children: 'Environment name',
  control: 'Input',
  disabled: false,
};

function Preview({ children, control, disabled }: Values) {
  const id = useId();
  if (control === 'Input') {
    return (
      <div className="flex w-full max-w-sm flex-col gap-1">
        <Label htmlFor={id}>{children}</Label>
        <Input id={id} disabled={disabled} />
      </div>
    );
  }
  return (
    <div className="flex items-center gap-2">
      {control === 'Checkbox' ? (
        <Checkbox id={id} disabled={disabled} />
      ) : (
        <Switch id={id} disabled={disabled} />
      )}
      <Label htmlFor={id} className="font-normal">
        {children}
      </Label>
    </div>
  );
}

function code({ children, control, disabled }: Values) {
  const field = jsx(control, { id: 'name', disabled }, {});
  const imports = [
    `import { ${control} } from 'omuk-ui/${control.toLowerCase()}';`,
    "import { Label } from 'omuk-ui/label';",
  ].sort();
  const body =
    control === 'Input'
      ? [
          '<div className="flex flex-col gap-1">',
          `  <Label htmlFor="name">${children}</Label>`,
          `  ${field}`,
          '</div>',
        ]
      : [
          '<div className="flex items-center gap-2">',
          `  ${field}`,
          `  <Label htmlFor="name" className="font-normal">${children}</Label>`,
          '</div>',
        ];
  return [...imports, '', ...body].join('\n');
}

export default function LabelPlayground() {
  return (
    <Playground
      initial={INITIAL}
      controls={[
        { name: 'children', kind: 'text' },
        { name: 'control', kind: 'choice', options: CONTROLS },
        { name: 'disabled', kind: 'boolean' },
      ]}
      render={(values) => <Preview {...values} />}
      code={code}
    />
  );
}
