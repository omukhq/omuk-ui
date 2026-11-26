import { Label } from 'omuk-ui/label';
import { RadioGroup, RadioGroupItem } from 'omuk-ui/radio-group';
import { useId } from 'react';
import { Playground } from '../../playground';

const FORMATS = [
  { value: 'dotenv', label: '.env file' },
  { value: 'json', label: 'JSON' },
  { value: 'yaml', label: 'YAML' },
] as const;
const VALUES = ['dotenv', 'json', 'yaml'] as const;

type Values = {
  label: string;
  defaultValue: (typeof VALUES)[number];
  disabled: boolean;
};

const INITIAL: Values = {
  label: 'Export as',
  defaultValue: 'dotenv',
  disabled: false,
};

function Preview({ label, defaultValue, disabled }: Values) {
  const id = useId();
  return (
    <div className="flex flex-col gap-3">
      <p id={`${id}-label`} className="text-sm font-medium text-foreground">
        {label}
      </p>
      <RadioGroup
        // A new default only shows on a new group.
        key={defaultValue}
        aria-labelledby={`${id}-label`}
        defaultValue={defaultValue}
        disabled={disabled}
      >
        {FORMATS.map((option) => (
          <div key={option.value} className="flex items-center gap-2">
            <RadioGroupItem id={`${id}-${option.value}`} value={option.value} />
            <Label htmlFor={`${id}-${option.value}`} className="font-normal">
              {option.label}
            </Label>
          </div>
        ))}
      </RadioGroup>
    </div>
  );
}

function code({ label, defaultValue, disabled }: Values) {
  return [
    "import { Label } from 'omuk-ui/label';",
    "import { RadioGroup, RadioGroupItem } from 'omuk-ui/radio-group';",
    '',
    '<div className="flex flex-col gap-3">',
    `  <p id="format" className="text-sm font-medium">${label}</p>`,
    `  <RadioGroup aria-labelledby="format" defaultValue="${defaultValue}"${disabled ? ' disabled' : ''}>`,
    ...FORMATS.flatMap((option) => [
      '    <div className="flex items-center gap-2">',
      `      <RadioGroupItem id="${option.value}" value="${option.value}" />`,
      `      <Label htmlFor="${option.value}" className="font-normal">${option.label}</Label>`,
      '    </div>',
    ]),
    '  </RadioGroup>',
    '</div>',
  ].join('\n');
}

export default function RadioGroupPlayground() {
  return (
    <Playground
      initial={INITIAL}
      controls={[
        { name: 'label', kind: 'text' },
        { name: 'defaultValue', kind: 'choice', options: VALUES },
        { name: 'disabled', kind: 'boolean' },
      ]}
      render={(values) => <Preview {...values} />}
      code={code}
    />
  );
}
