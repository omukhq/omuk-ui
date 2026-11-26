import { Input } from 'omuk-ui/input';
import { Label } from 'omuk-ui/label';
import { useId } from 'react';

export default function InputWithLabel() {
  const id = useId();
  return (
    <div className="flex w-full max-w-sm flex-col gap-1">
      <Label htmlFor={id}>Project name</Label>
      <Input id={id} placeholder="Billing service" />
    </div>
  );
}
