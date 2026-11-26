import { Input } from 'omuk-ui/input';
import { Label } from 'omuk-ui/label';
import { useId } from 'react';

export default function InputInvalid() {
  const id = useId();
  const errorId = `${id}-error`;
  return (
    <div className="flex w-full max-w-sm flex-col gap-1">
      <Label htmlFor={id}>Email</Label>
      <Input
        id={id}
        type="email"
        defaultValue="ada@example"
        aria-invalid="true"
        aria-describedby={errorId}
      />
      <p id={errorId} className="text-xs text-danger">
        Enter an email address with a domain, like ada@example.com.
      </p>
    </div>
  );
}
