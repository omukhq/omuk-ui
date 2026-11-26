import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from 'omuk-ui/field';
import { Input } from 'omuk-ui/input';
import { useId } from 'react';
import { Playground } from '../../playground';

const ORIENTATIONS = ['vertical', 'horizontal', 'responsive'] as const;

type Values = {
  label: string;
  description: string;
  error: string;
  orientation: (typeof ORIENTATIONS)[number];
  disabled: boolean;
};

const INITIAL: Values = {
  label: 'Project name',
  description: 'Shown in the sidebar and in the CLI.',
  error: '',
  orientation: 'vertical',
  disabled: false,
};

function Preview({ label, description, error, orientation, disabled }: Values) {
  const id = useId();
  return (
    <FieldGroup className="max-w-md">
      <Field orientation={orientation} data-disabled={disabled || undefined}>
        <FieldLabel htmlFor={id}>{label}</FieldLabel>
        <Input
          id={id}
          placeholder="Billing service"
          disabled={disabled}
          aria-invalid={error ? true : undefined}
          aria-describedby={description ? `${id}-hint` : undefined}
        />
        {description && (
          <FieldDescription id={`${id}-hint`}>{description}</FieldDescription>
        )}
        <FieldError>{error}</FieldError>
      </Field>
    </FieldGroup>
  );
}

function code({ label, description, error, orientation, disabled }: Values) {
  const field = [
    'Field',
    orientation === 'vertical' ? '' : `orientation="${orientation}"`,
    disabled ? 'data-disabled' : '',
  ]
    .filter(Boolean)
    .join(' ');
  const input = [
    'Input id="name" placeholder="Billing service"',
    disabled ? 'disabled' : '',
    error ? 'aria-invalid' : '',
    description ? 'aria-describedby="name-hint"' : '',
  ]
    .filter(Boolean)
    .join(' ');
  const parts = [
    'Field',
    description ? 'FieldDescription' : '',
    error ? 'FieldError' : '',
    'FieldGroup',
    'FieldLabel',
  ].filter(Boolean);
  return [
    `import { ${parts.join(', ')} } from 'omuk-ui/field';`,
    "import { Input } from 'omuk-ui/input';",
    '',
    '<FieldGroup>',
    `  <${field}>`,
    `    <FieldLabel htmlFor="name">${label}</FieldLabel>`,
    `    <${input} />`,
    ...(description
      ? [
          `    <FieldDescription id="name-hint">${description}</FieldDescription>`,
        ]
      : []),
    ...(error ? [`    <FieldError>${error}</FieldError>`] : []),
    '  </Field>',
    '</FieldGroup>',
  ].join('\n');
}

export default function FieldPlayground() {
  return (
    <Playground
      initial={INITIAL}
      controls={[
        { name: 'label', kind: 'text' },
        { name: 'description', kind: 'text' },
        { name: 'error', kind: 'text' },
        { name: 'orientation', kind: 'choice', options: ORIENTATIONS },
        { name: 'disabled', kind: 'boolean' },
      ]}
      render={(values) => <Preview {...values} />}
      code={code}
    />
  );
}
