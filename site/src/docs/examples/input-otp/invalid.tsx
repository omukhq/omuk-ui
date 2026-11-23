import { InputOTP, InputOTPGroup, InputOTPSlot } from '@omuk/ui/input-otp';
import { Label } from '@omuk/ui/label';
import { REGEXP_ONLY_DIGITS } from 'input-otp';
import { useId, useState } from 'react';

// The code that the server would accept, for this example only.
const RIGHT_CODE = '246810';

export default function InputOTPInvalid() {
  const id = useId();
  const [code, setCode] = useState('135790');
  const wrong = code.length === 6 && code !== RIGHT_CODE;
  return (
    <div className="flex flex-col gap-1">
      <Label htmlFor={id}>Code from your authenticator app</Label>
      <InputOTP
        id={id}
        maxLength={6}
        pattern={REGEXP_ONLY_DIGITS}
        value={code}
        onChange={setCode}
        aria-invalid={wrong}
        aria-describedby={`${id}-error`}
      >
        <InputOTPGroup>
          {[0, 1, 2, 3, 4, 5].map((index) => (
            <InputOTPSlot key={index} index={index} aria-invalid={wrong} />
          ))}
        </InputOTPGroup>
      </InputOTP>
      <p id={`${id}-error`} className="text-xs text-danger">
        {wrong ? 'That code is not right. Codes change every 30 seconds.' : ''}
      </p>
    </div>
  );
}
