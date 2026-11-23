import { InputOTP, InputOTPGroup, InputOTPSlot } from '@omuk/ui/input-otp';
import { Label } from '@omuk/ui/label';
import { REGEXP_ONLY_DIGITS } from 'input-otp';
import { useId, useState } from 'react';

export default function InputOTPBasic() {
  const id = useId();
  const [code, setCode] = useState('');
  return (
    <div className="flex flex-col gap-1">
      <Label htmlFor={id}>Code from your authenticator app</Label>
      <InputOTP
        id={id}
        maxLength={6}
        pattern={REGEXP_ONLY_DIGITS}
        value={code}
        onChange={setCode}
      >
        <InputOTPGroup>
          {[0, 1, 2, 3, 4, 5].map((index) => (
            <InputOTPSlot key={index} index={index} />
          ))}
        </InputOTPGroup>
      </InputOTP>
    </div>
  );
}
