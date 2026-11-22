import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from '@omuk/ui/field';
import { Input } from '@omuk/ui/input';
import { useId } from 'react';

export default function FieldBasic() {
  const id = useId();
  return (
    <FieldGroup className="max-w-sm">
      <Field>
        <FieldLabel htmlFor={`${id}-name`}>Project name</FieldLabel>
        <Input
          id={`${id}-name`}
          placeholder="Billing service"
          aria-describedby={`${id}-name-hint`}
        />
        <FieldDescription id={`${id}-name-hint`}>
          Shown in the sidebar and in the CLI.
        </FieldDescription>
      </Field>
      <Field>
        <FieldLabel htmlFor={`${id}-url`}>Repository</FieldLabel>
        <Input
          id={`${id}-url`}
          type="url"
          placeholder="https://github.com/acme/billing"
        />
      </Field>
    </FieldGroup>
  );
}
