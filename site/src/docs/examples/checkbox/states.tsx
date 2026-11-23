import { Checkbox } from '@omuk/ui/checkbox';
import { Label } from '@omuk/ui/label';
import { useId } from 'react';

export default function CheckboxStates() {
  const id = useId();
  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center gap-2">
        <Checkbox id={`${id}-off`} disabled />
        <Label htmlFor={`${id}-off`} className="font-normal">
          Disabled
        </Label>
      </div>
      <div className="flex items-center gap-2">
        <Checkbox id={`${id}-on`} defaultChecked disabled />
        <Label htmlFor={`${id}-on`} className="font-normal">
          Disabled and on
        </Label>
      </div>
      <div className="flex items-center gap-2">
        <Checkbox id={`${id}-invalid`} aria-invalid />
        <Label htmlFor={`${id}-invalid`} className="font-normal">
          I have saved the recovery codes
        </Label>
      </div>
    </div>
  );
}
