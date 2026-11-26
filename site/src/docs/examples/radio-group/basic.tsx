import { Label } from 'omuk-ui/label';
import { RadioGroup, RadioGroupItem } from 'omuk-ui/radio-group';
import { useId, useState } from 'react';

const FORMATS = [
  { value: 'dotenv', label: '.env file' },
  { value: 'json', label: 'JSON' },
  { value: 'yaml', label: 'YAML' },
];

export default function RadioGroupBasic() {
  const id = useId();
  const [format, setFormat] = useState('dotenv');
  return (
    <div className="flex flex-col gap-3">
      <p id={`${id}-label`} className="text-sm font-medium text-foreground">
        Export as
      </p>
      <RadioGroup
        aria-labelledby={`${id}-label`}
        value={format}
        onValueChange={setFormat}
      >
        {FORMATS.map((option) => (
          <div key={option.value} className="flex items-center gap-2">
            <RadioGroupItem id={`${id}-${option.value}`} value={option.value} />
            <Label htmlFor={`${id}-${option.value}`} className="font-normal">
              {option.label}
            </Label>
          </div>
        ))}
      </RadioGroup>
    </div>
  );
}
