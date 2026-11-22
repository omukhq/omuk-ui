import { Label } from '@omuk/ui/label';
import { Switch } from '@omuk/ui/switch';
import { useId } from 'react';

export default function SwitchStates() {
  const id = useId();
  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center gap-2">
        <Switch id={`${id}-small`} size="sm" defaultChecked />
        <Label htmlFor={`${id}-small`} className="font-normal">
          Small, for a dense row
        </Label>
      </div>
      <div className="flex items-center gap-2">
        <Switch id={`${id}-off`} disabled />
        <Label htmlFor={`${id}-off`} className="font-normal">
          Disabled
        </Label>
      </div>
      <div className="flex items-center gap-2">
        <Switch id={`${id}-on`} defaultChecked disabled />
        <Label htmlFor={`${id}-on`} className="font-normal">
          Disabled and on
        </Label>
      </div>
    </div>
  );
}
