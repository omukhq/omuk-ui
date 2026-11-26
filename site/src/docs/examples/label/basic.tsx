import { Input } from 'omuk-ui/input';
import { Label } from 'omuk-ui/label';
import { useId } from 'react';

export default function LabelBasic() {
  const id = useId();
  return (
    <div className="flex w-full max-w-sm flex-col gap-1">
      <Label htmlFor={id}>Environment name</Label>
      <Input id={id} placeholder="Staging" />
    </div>
  );
}
