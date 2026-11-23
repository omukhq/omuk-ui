import {
  InputGroup,
  InputGroupAddon,
  InputGroupText,
  InputGroupTextarea,
} from '@omuk/ui/input-group';
import { Label } from '@omuk/ui/label';
import { useId, useState } from 'react';

const LIMIT = 200;

export default function InputGroupStacked() {
  const id = useId();
  const [note, setNote] = useState('');
  return (
    <div className="flex w-full max-w-sm flex-col gap-1">
      <Label htmlFor={id}>Note for the team</Label>
      <InputGroup stacked>
        <InputGroupTextarea
          id={id}
          maxLength={LIMIT}
          placeholder="Why this secret changed"
          value={note}
          onChange={(event) => setNote(event.target.value)}
        />
        <InputGroupAddon align="block-end">
          <InputGroupText className="ml-auto tabular-nums">
            {note.length} of {LIMIT}
          </InputGroupText>
        </InputGroupAddon>
      </InputGroup>
    </div>
  );
}
