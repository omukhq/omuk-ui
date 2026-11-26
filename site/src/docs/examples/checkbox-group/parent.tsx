import { Checkbox } from 'omuk-ui/checkbox';
import { CheckboxGroup } from 'omuk-ui/checkbox-group';
import { Label } from 'omuk-ui/label';
import { useId } from 'react';

const ENVIRONMENTS = [
  { value: 'development', label: 'Development' },
  { value: 'preview', label: 'Preview' },
  { value: 'production', label: 'Production' },
];

export default function CheckboxGroupParent() {
  const id = useId();
  return (
    <CheckboxGroup
      aria-labelledby={`${id}-all`}
      defaultValue={['preview']}
      allValues={ENVIRONMENTS.map((environment) => environment.value)}
    >
      <div className="flex items-center gap-2">
        <Checkbox id={`${id}-all`} parent />
        <Label htmlFor={`${id}-all`}>All environments</Label>
      </div>
      <div className="flex flex-col gap-3 pl-6">
        {ENVIRONMENTS.map((environment) => (
          <div key={environment.value} className="flex items-center gap-2">
            <Checkbox
              id={`${id}-${environment.value}`}
              value={environment.value}
            />
            <Label
              htmlFor={`${id}-${environment.value}`}
              className="font-normal"
            >
              {environment.label}
            </Label>
          </div>
        ))}
      </div>
    </CheckboxGroup>
  );
}
