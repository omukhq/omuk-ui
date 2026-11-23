import { Label } from '@omuk/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@omuk/ui/select';
import { useId, useState } from 'react';
import { jsx, Playground } from '../../playground';

const SIZES = ['default', 'lg'] as const;

const REGIONS = [
  { value: 'eu', label: 'Europe (Frankfurt)' },
  { value: 'us', label: 'United States (Virginia)' },
  { value: 'ap', label: 'Asia Pacific (Singapore)' },
];

type Values = {
  placeholder: string;
  size: (typeof SIZES)[number];
  disabled: boolean;
  readOnly: boolean;
};

const INITIAL: Values = {
  placeholder: 'Choose a region',
  size: 'lg',
  disabled: false,
  readOnly: false,
};

function Preview({ placeholder, size, disabled, readOnly }: Values) {
  const id = useId();
  const [region, setRegion] = useState<string | null>(null);
  return (
    <div className="flex w-full max-w-xs flex-col gap-1">
      <Label htmlFor={id}>Region</Label>
      <Select
        items={REGIONS}
        value={region}
        onValueChange={setRegion}
        disabled={disabled}
        readOnly={readOnly}
      >
        <SelectTrigger id={id} size={size} className="w-full">
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent>
          {REGIONS.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}

/** An element's opening tag with its changed props, still open. */
function opening(tag: string, props: Record<string, string | boolean>) {
  return jsx(tag, props, INITIAL).replace(/ \/>$/, '');
}

function code({ placeholder, size, disabled, readOnly }: Values) {
  const root = opening('Select', { disabled, readOnly });
  const trigger = opening('SelectTrigger id={id} className="w-full"', { size });
  const value = jsx('SelectValue', { placeholder }, { placeholder: '' });
  return `import { Label } from '@omuk/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@omuk/ui/select';

<Label htmlFor={id}>Region</Label>
${root} items={REGIONS} value={region} onValueChange={setRegion}>
  ${trigger}>
    ${value}
  </SelectTrigger>
  <SelectContent>
    {REGIONS.map((option) => (
      <SelectItem key={option.value} value={option.value}>
        {option.label}
      </SelectItem>
    ))}
  </SelectContent>
</Select>`;
}

export default function SelectPlayground() {
  return (
    <Playground
      initial={INITIAL}
      controls={[
        { name: 'placeholder', kind: 'text' },
        { name: 'size', kind: 'choice', options: SIZES },
        { name: 'disabled', kind: 'boolean' },
        { name: 'readOnly', kind: 'boolean' },
      ]}
      render={(values) => <Preview {...values} />}
      code={code}
    />
  );
}
