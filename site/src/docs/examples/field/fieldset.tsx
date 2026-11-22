import { Checkbox } from '@omuk/ui/checkbox';
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSet,
} from '@omuk/ui/field';
import { useId } from 'react';

const ENVIRONMENTS = ['Development', 'Staging', 'Production'];

export default function FieldFieldset() {
  const id = useId();
  return (
    <FieldSet className="max-w-sm">
      <FieldLegend>Environments</FieldLegend>
      <FieldDescription>
        The token can read the secrets of these environments.
      </FieldDescription>
      <FieldGroup data-slot="checkbox-group">
        {ENVIRONMENTS.map((name, index) => (
          <Field key={name} orientation="horizontal">
            <Checkbox id={`${id}-${index}`} defaultChecked={index === 0} />
            <FieldLabel htmlFor={`${id}-${index}`} className="font-normal">
              {name}
            </FieldLabel>
          </Field>
        ))}
        <Field orientation="horizontal" data-disabled="">
          <Checkbox id={`${id}-preview`} disabled />
          <FieldLabel htmlFor={`${id}-preview`} className="font-normal">
            Preview (archived)
          </FieldLabel>
        </Field>
      </FieldGroup>
    </FieldSet>
  );
}
