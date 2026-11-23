import { Label } from '@omuk/ui/label';
import { RadioGroup, RadioGroupItem } from '@omuk/ui/radio-group';
import { useId } from 'react';

const LENGTHS = ['16', '32', '64'];

export default function RadioGroupHorizontal() {
  const id = useId();
  return (
    <RadioGroup
      aria-label="Length of the new secret"
      defaultValue="32"
      className="flex flex-wrap gap-6"
    >
      {LENGTHS.map((length) => (
        <div key={length} className="flex items-center gap-2">
          <RadioGroupItem id={`${id}-${length}`} value={length} />
          <Label htmlFor={`${id}-${length}`} className="font-normal">
            {length} characters
          </Label>
        </div>
      ))}
    </RadioGroup>
  );
}
