import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
  InputGroupText,
} from '@omuk/ui/input-group';
import { Label } from '@omuk/ui/label';
import { useId } from 'react';
import { Playground } from '../../playground';

const SIZES = ['xs', 'sm', 'md', 'lg'] as const;

type Values = {
  label: string;
  prefix: string;
  placeholder: string;
  size: (typeof SIZES)[number];
  disabled: boolean;
};

const INITIAL: Values = {
  label: 'Webhook address',
  prefix: 'https://',
  placeholder: 'hooks.example.com/deploy',
  size: 'md',
  disabled: false,
};

function Preview({ label, prefix, placeholder, size, disabled }: Values) {
  const id = useId();
  return (
    <div className="flex w-full max-w-sm flex-col gap-1">
      <Label htmlFor={id}>{label}</Label>
      <InputGroup size={size} disabled={disabled}>
        {prefix && (
          <InputGroupAddon>
            <InputGroupText>{prefix}</InputGroupText>
          </InputGroupAddon>
        )}
        <InputGroupInput
          id={id}
          placeholder={placeholder || undefined}
          disabled={disabled}
        />
      </InputGroup>
    </div>
  );
}

function code({ label, prefix, placeholder, size, disabled }: Values) {
  const off = disabled ? ' disabled' : '';
  const sized = size === 'md' ? '' : ` size="${size}"`;
  const group = `<InputGroup${sized}${off}>`;
  const input = `<InputGroupInput id="url"${placeholder ? ` placeholder="${placeholder}"` : ''}${off} />`;
  const parts = prefix
    ? ['InputGroup', 'InputGroupAddon', 'InputGroupInput', 'InputGroupText']
    : ['InputGroup', 'InputGroupInput'];
  return [
    `import { ${parts.join(', ')} } from '@omuk/ui/input-group';`,
    "import { Label } from '@omuk/ui/label';",
    '',
    '<div className="flex flex-col gap-1">',
    `  <Label htmlFor="url">${label}</Label>`,
    `  ${group}`,
    ...(prefix
      ? [
          '    <InputGroupAddon>',
          `      <InputGroupText>${prefix}</InputGroupText>`,
          '    </InputGroupAddon>',
        ]
      : []),
    `    ${input}`,
    '  </InputGroup>',
    '</div>',
  ].join('\n');
}

export default function InputGroupPlayground() {
  return (
    <Playground
      initial={INITIAL}
      controls={[
        { name: 'label', kind: 'text' },
        { name: 'prefix', kind: 'text' },
        { name: 'placeholder', kind: 'text' },
        { name: 'size', kind: 'choice', options: SIZES },
        { name: 'disabled', kind: 'boolean' },
      ]}
      render={(values) => <Preview {...values} />}
      code={code}
    />
  );
}
