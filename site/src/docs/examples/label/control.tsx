import { Checkbox } from '@omuk/ui/checkbox';
import { Label } from '@omuk/ui/label';
import { Switch } from '@omuk/ui/switch';
import { useId } from 'react';

export default function LabelWithControl() {
  const id = useId();
  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center gap-2">
        <Checkbox id={`${id}-remember`} defaultChecked />
        <Label htmlFor={`${id}-remember`} className="font-normal">
          Keep me signed in on this device
        </Label>
      </div>
      <div className="flex items-center gap-2">
        <Switch id={`${id}-sync`} disabled />
        <Label htmlFor={`${id}-sync`} className="font-normal">
          Sync to the cloud (not set up)
        </Label>
      </div>
    </div>
  );
}
