import { Label } from '@omuk/ui/label';
import { Textarea } from '@omuk/ui/textarea';
import { useId, useState } from 'react';

const LIMIT = 80;

export default function TextareaInvalid() {
  const id = useId();
  const [text, setText] = useState(
    'The production database moved to a new host, so every app that reads it needs the new address.',
  );
  const tooLong = text.length > LIMIT;
  return (
    <div className="flex w-full max-w-sm flex-col gap-1">
      <Label htmlFor={id}>Summary</Label>
      <Textarea
        id={id}
        value={text}
        onChange={(event) => setText(event.target.value)}
        aria-invalid={tooLong}
        aria-describedby={`${id}-hint`}
      />
      <p
        id={`${id}-hint`}
        className={tooLong ? 'text-xs text-danger' : 'text-xs text-muted'}
      >
        {text.length} of {LIMIT} characters.
        {tooLong && ' Make it shorter.'}
      </p>
    </div>
  );
}
