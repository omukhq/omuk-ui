import { Input } from 'omuk-ui/input';
import { Label } from 'omuk-ui/label';
import { useId } from 'react';

export default function LabelWithHint() {
  const id = useId();
  return (
    <div className="flex w-full max-w-sm flex-col gap-1">
      <Label htmlFor={id}>
        Description
        <span className="font-normal text-muted">Optional</span>
      </Label>
      <Input id={id} placeholder="What this project is for" />
    </div>
  );
}
