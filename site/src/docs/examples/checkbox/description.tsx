import { Checkbox } from 'omuk-ui/checkbox';
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldLabel,
} from 'omuk-ui/field';
import { useId } from 'react';

export default function CheckboxWithDescription() {
  const id = useId();
  return (
    <Field orientation="horizontal" className="max-w-sm">
      <Checkbox
        id={id}
        name="expires"
        defaultChecked
        aria-describedby={`${id}-hint`}
      />
      <FieldContent>
        <FieldLabel htmlFor={id}>Expire the token</FieldLabel>
        <FieldDescription id={`${id}-hint`}>
          The CLI stops working with it after 90 days. You can make a new one at
          any time.
        </FieldDescription>
      </FieldContent>
    </Field>
  );
}
