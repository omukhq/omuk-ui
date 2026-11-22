import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from '@omuk/ui/input-group';
import { Label } from '@omuk/ui/label';
import { EyeIcon, EyeOffIcon } from 'lucide-react';
import { useId, useState } from 'react';

export default function InputGroupPassword() {
  const id = useId();
  const [shown, setShown] = useState(false);
  return (
    <div className="flex w-full max-w-sm flex-col gap-1">
      <Label htmlFor={id}>Password</Label>
      <InputGroup>
        <InputGroupInput
          id={id}
          type={shown ? 'text' : 'password'}
          autoComplete="current-password"
        />
        <InputGroupAddon align="inline-end">
          <InputGroupButton
            size="icon"
            aria-label="Show the password"
            aria-pressed={shown}
            onClick={() => setShown(!shown)}
          >
            {shown ? (
              <EyeOffIcon strokeWidth={1.5} />
            ) : (
              <EyeIcon strokeWidth={1.5} />
            )}
          </InputGroupButton>
        </InputGroupAddon>
      </InputGroup>
    </div>
  );
}
