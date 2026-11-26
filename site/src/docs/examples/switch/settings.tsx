import {
  Field,
  FieldContent,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from 'omuk-ui/field';
import { Switch } from 'omuk-ui/switch';
import { useId } from 'react';

const SETTINGS = [
  {
    key: 'mask',
    title: 'Hide values',
    description: 'Show dots in place of each value until you reveal it.',
    on: true,
  },
  {
    key: 'audit',
    title: 'Log every read',
    description: 'Add an entry to the audit log each time the CLI reads.',
    on: false,
  },
];

export default function SwitchSettings() {
  const id = useId();
  return (
    <FieldGroup className="max-w-md">
      {SETTINGS.map((setting) => (
        <Field key={setting.key} orientation="horizontal">
          <FieldContent>
            <FieldLabel htmlFor={`${id}-${setting.key}`}>
              {setting.title}
            </FieldLabel>
            <FieldDescription id={`${id}-${setting.key}-hint`}>
              {setting.description}
            </FieldDescription>
          </FieldContent>
          <Switch
            id={`${id}-${setting.key}`}
            defaultChecked={setting.on}
            aria-describedby={`${id}-${setting.key}-hint`}
          />
        </Field>
      ))}
    </FieldGroup>
  );
}
