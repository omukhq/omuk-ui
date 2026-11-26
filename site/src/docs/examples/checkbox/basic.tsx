import { Checkbox } from 'omuk-ui/checkbox';
import { Label } from 'omuk-ui/label';
import { useId, useState } from 'react';

export default function CheckboxBasic() {
  const id = useId();
  const [masked, setMasked] = useState(true);
  return (
    <div className="flex items-center gap-2">
      <Checkbox id={id} checked={masked} onCheckedChange={setMasked} />
      <Label htmlFor={id} className="font-normal">
        Hide the values on screen
      </Label>
    </div>
  );
}
