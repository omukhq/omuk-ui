import {
  Field,
  FieldContent,
  FieldDescription,
  FieldLabel,
  FieldLegend,
  FieldSet,
} from '@omuk/ui/field';
import { RadioGroup, RadioGroupItem } from '@omuk/ui/radio-group';
import { useId } from 'react';

const RULES = [
  {
    value: 'ask',
    title: 'Ask each time',
    description: 'A push to production waits until you approve it.',
    disabled: false,
  },
  {
    value: 'allow',
    title: 'Allow',
    description: 'A push to production goes through at once.',
    disabled: false,
  },
  {
    value: 'team',
    title: 'Ask a teammate',
    description: 'A second person approves the push. Comes with the Team plan.',
    disabled: true,
  },
];

export default function RadioGroupWithDescription() {
  const id = useId();
  return (
    <FieldSet className="max-w-sm">
      <FieldLegend id={`${id}-legend`} variant="label">
        Pushes to production
      </FieldLegend>
      <RadioGroup
        aria-labelledby={`${id}-legend`}
        name="push-rule"
        defaultValue="ask"
      >
        {RULES.map((rule) => (
          <Field
            key={rule.value}
            orientation="horizontal"
            data-disabled={rule.disabled ? '' : undefined}
          >
            <RadioGroupItem
              id={`${id}-${rule.value}`}
              value={rule.value}
              disabled={rule.disabled}
              aria-describedby={`${id}-${rule.value}-hint`}
            />
            <FieldContent>
              <FieldLabel htmlFor={`${id}-${rule.value}`}>
                {rule.title}
              </FieldLabel>
              <FieldDescription id={`${id}-${rule.value}-hint`}>
                {rule.description}
              </FieldDescription>
            </FieldContent>
          </Field>
        ))}
      </RadioGroup>
    </FieldSet>
  );
}
