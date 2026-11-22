import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
  InputGroupText,
} from '@omuk/ui/input-group';
import { Label } from '@omuk/ui/label';
import { useId } from 'react';

export default function InputGroupPrefix() {
  const id = useId();
  return (
    <div className="flex w-full max-w-sm flex-col gap-1">
      <Label htmlFor={id}>Webhook address</Label>
      <InputGroup>
        <InputGroupAddon>
          <InputGroupText className="font-mono">https://</InputGroupText>
        </InputGroupAddon>
        <InputGroupInput
          id={id}
          className="font-mono"
          placeholder="hooks.example.com/deploy"
        />
      </InputGroup>
    </div>
  );
}
