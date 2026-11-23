import { InputOTP, InputOTPGroup, InputOTPSlot } from '@omuk/ui/input-otp';
import { Label } from '@omuk/ui/label';
import { REGEXP_ONLY_DIGITS_AND_CHARS } from 'input-otp';
import { useId } from 'react';

export default function InputOTPGroups() {
  const id = useId();
  return (
    <div className="flex flex-col gap-1">
      <Label htmlFor={id}>Recovery code</Label>
      <InputOTP
        id={id}
        maxLength={8}
        pattern={REGEXP_ONLY_DIGITS_AND_CHARS}
        inputMode="text"
        containerClassName="gap-2 font-mono"
      >
        <InputOTPGroup>
          {[0, 1, 2, 3].map((index) => (
            <InputOTPSlot key={index} index={index} />
          ))}
        </InputOTPGroup>
        <span aria-hidden className="text-muted">
          –
        </span>
        <InputOTPGroup>
          {[4, 5, 6, 7].map((index) => (
            <InputOTPSlot key={index} index={index} />
          ))}
        </InputOTPGroup>
      </InputOTP>
    </div>
  );
}
