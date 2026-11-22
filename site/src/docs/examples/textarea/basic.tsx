import { Label } from '@omuk/ui/label';
import { Textarea } from '@omuk/ui/textarea';
import { useId } from 'react';

export default function TextareaBasic() {
  const id = useId();
  return (
    <div className="flex w-full max-w-sm flex-col gap-1">
      <Label htmlFor={id}>Release notes</Label>
      <Textarea
        id={id}
        placeholder="What changed in this release"
        defaultValue={
          'Rotated the Stripe key.\nMoved the mail settings to staging.'
        }
      />
    </div>
  );
}
