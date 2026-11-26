import {
  REGEXP_ONLY_CHARS,
  REGEXP_ONLY_DIGITS,
  REGEXP_ONLY_DIGITS_AND_CHARS,
} from 'input-otp';
import { InputOTP, InputOTPGroup, InputOTPSlot } from 'omuk-ui/input-otp';
import { Label } from 'omuk-ui/label';
import { useId } from 'react';
import { Playground } from '../../playground';

/** The pattern by the name the code imports it with. */
const PATTERNS = {
  REGEXP_ONLY_DIGITS,
  REGEXP_ONLY_DIGITS_AND_CHARS,
  REGEXP_ONLY_CHARS,
};
const PATTERN_NAMES = [
  'REGEXP_ONLY_DIGITS',
  'REGEXP_ONLY_DIGITS_AND_CHARS',
  'REGEXP_ONLY_CHARS',
] as const;

type Values = {
  label: string;
  maxLength: number;
  pattern: (typeof PATTERN_NAMES)[number];
  disabled: boolean;
  'aria-invalid': boolean;
};

const INITIAL: Values = {
  label: 'Code from your authenticator app',
  maxLength: 6,
  pattern: 'REGEXP_ONLY_DIGITS',
  disabled: false,
  'aria-invalid': false,
};

/** One slot for each character, between 1 and 10. */
function slots(maxLength: number) {
  return Array.from(
    { length: Math.min(Math.max(maxLength, 1), 10) },
    (_, index) => index,
  );
}

function Preview({
  label,
  maxLength,
  pattern,
  disabled,
  'aria-invalid': invalid,
}: Values) {
  const id = useId();
  const indexes = slots(maxLength);
  return (
    <div className="flex flex-col gap-1">
      <Label htmlFor={id}>{label}</Label>
      <InputOTP
        // A new length or pattern starts with an empty code.
        key={`${indexes.length}-${pattern}`}
        id={id}
        maxLength={indexes.length}
        pattern={PATTERNS[pattern]}
        inputMode={pattern === 'REGEXP_ONLY_DIGITS' ? undefined : 'text'}
        disabled={disabled}
        aria-invalid={invalid}
      >
        <InputOTPGroup>
          {indexes.map((index) => (
            <InputOTPSlot key={index} index={index} aria-invalid={invalid} />
          ))}
        </InputOTPGroup>
      </InputOTP>
    </div>
  );
}

function code({
  label,
  maxLength,
  pattern,
  disabled,
  'aria-invalid': ariaInvalid,
}: Values) {
  const invalid = ariaInvalid ? ' aria-invalid' : '';
  const length = slots(maxLength).length;
  const props = [
    'id="code"',
    `maxLength={${length}}`,
    `pattern={${pattern}}`,
    pattern === 'REGEXP_ONLY_DIGITS' ? '' : 'inputMode="text"',
    disabled ? 'disabled' : '',
  ]
    .filter(Boolean)
    .join(' ');
  return [
    "import { InputOTP, InputOTPGroup, InputOTPSlot } from 'omuk-ui/input-otp';",
    "import { Label } from 'omuk-ui/label';",
    `import { ${pattern} } from 'input-otp';`,
    '',
    '<div className="flex flex-col gap-1">',
    `  <Label htmlFor="code">${label}</Label>`,
    `  <InputOTP ${props}${invalid}>`,
    '    <InputOTPGroup>',
    ...slots(maxLength).map(
      (index) => `      <InputOTPSlot index={${index}}${invalid} />`,
    ),
    '    </InputOTPGroup>',
    '  </InputOTP>',
    '</div>',
  ].join('\n');
}

export default function InputOTPPlayground() {
  return (
    <Playground
      initial={INITIAL}
      controls={[
        { name: 'label', kind: 'text' },
        { name: 'maxLength', kind: 'number', min: 1, max: 10 },
        { name: 'pattern', kind: 'choice', options: PATTERN_NAMES },
        { name: 'disabled', kind: 'boolean' },
        { name: 'aria-invalid', kind: 'boolean' },
      ]}
      render={(values) => <Preview {...values} />}
      code={code}
    />
  );
}
