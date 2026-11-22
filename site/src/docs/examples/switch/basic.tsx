import { Label } from '@omuk/ui/label';
import { Switch } from '@omuk/ui/switch';
import { useId, useState } from 'react';

export default function SwitchBasic() {
  const id = useId();
  const [locked, setLocked] = useState(false);
  return (
    <div className="flex items-center gap-2">
      <Switch id={id} checked={locked} onCheckedChange={setLocked} />
      <Label htmlFor={id} className="font-normal">
        Lock production
      </Label>
    </div>
  );
}
