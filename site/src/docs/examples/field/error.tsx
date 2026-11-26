import { Field, FieldError, FieldLabel } from 'omuk-ui/field';
import { Input } from 'omuk-ui/input';
import { useId, useState } from 'react';

function errorsFor(name: string) {
  const errors: { message: string }[] = [];
  if (name.length < 3) errors.push({ message: 'Use at least 3 characters.' });
  if (/\s/.test(name)) errors.push({ message: 'Leave out the spaces.' });
  return errors;
}

export default function FieldErrorExample() {
  const id = useId();
  const [name, setName] = useState('my key');
  const errors = errorsFor(name);
  const invalid = errors.length > 0;
  return (
    <Field className="max-w-sm">
      <FieldLabel htmlFor={id}>Secret name</FieldLabel>
      <Input
        id={id}
        className="font-mono"
        value={name}
        onChange={(event) => setName(event.target.value)}
        aria-invalid={invalid}
        aria-describedby={invalid ? `${id}-error` : undefined}
      />
      <FieldError id={`${id}-error`} errors={errors} />
    </Field>
  );
}
