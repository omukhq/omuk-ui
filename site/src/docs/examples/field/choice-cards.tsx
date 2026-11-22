import {
  Field,
  FieldContent,
  FieldDescription,
  FieldLabel,
  FieldTitle,
} from '@omuk/ui/field';
import { RadioGroup, RadioGroupItem } from '@omuk/ui/radio-group';
import { useId } from 'react';

const PLANS = [
  {
    value: 'hobby',
    title: 'Hobby',
    description: 'One project and three environments.',
  },
  {
    value: 'team',
    title: 'Team',
    description: 'Every project, with an audit log for a year.',
  },
];

export default function FieldChoiceCards() {
  const id = useId();
  return (
    <RadioGroup
      defaultValue="hobby"
      aria-label="Plan"
      className="w-full max-w-sm"
    >
      {PLANS.map((plan) => (
        <FieldLabel key={plan.value} htmlFor={`${id}-${plan.value}`}>
          <Field orientation="horizontal">
            <FieldContent>
              <FieldTitle>{plan.title}</FieldTitle>
              <FieldDescription>{plan.description}</FieldDescription>
            </FieldContent>
            <RadioGroupItem id={`${id}-${plan.value}`} value={plan.value} />
          </Field>
        </FieldLabel>
      ))}
    </RadioGroup>
  );
}
