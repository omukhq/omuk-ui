import {
  Combobox,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
} from 'omuk-ui/combobox';
import { Label } from 'omuk-ui/label';
import { useId, useState } from 'react';
import { jsx, Playground } from '../../playground';

const SIZES = ['xs', 'sm', 'md', 'lg'] as const;

const TIME_ZONES = [
  'Africa/Lagos',
  'America/New_York',
  'America/Sao_Paulo',
  'Asia/Dhaka',
  'Asia/Singapore',
  'Asia/Tokyo',
  'Australia/Sydney',
  'Europe/Berlin',
  'Europe/London',
  'Pacific/Auckland',
];

type Values = {
  placeholder: string;
  size: (typeof SIZES)[number];
  showClear: boolean;
  showTrigger: boolean;
  autoHighlight: boolean;
  disabled: boolean;
};

const INITIAL: Values = {
  placeholder: 'Search time zones',
  size: 'md',
  showClear: true,
  showTrigger: true,
  autoHighlight: false,
  disabled: false,
};

function Preview({
  placeholder,
  size,
  showClear,
  showTrigger,
  autoHighlight,
  disabled,
}: Values) {
  const id = useId();
  const [zone, setZone] = useState<string | null>('Europe/Berlin');
  return (
    <div className="flex w-full max-w-xs flex-col gap-1">
      <Label htmlFor={id}>Time zone</Label>
      <Combobox
        items={TIME_ZONES}
        value={zone}
        onValueChange={setZone}
        autoHighlight={autoHighlight}
        disabled={disabled}
      >
        <ComboboxInput
          id={id}
          className="w-full"
          placeholder={placeholder}
          size={size}
          showClear={showClear}
          showTrigger={showTrigger}
        />
        <ComboboxContent>
          <ComboboxEmpty>No time zone matches.</ComboboxEmpty>
          <ComboboxList>
            {(item: string) => (
              <ComboboxItem key={item} value={item}>
                {item}
              </ComboboxItem>
            )}
          </ComboboxList>
        </ComboboxContent>
      </Combobox>
    </div>
  );
}

/** The kit's own defaults: a prop at its default is left out of the code. */
const DEFAULTS = { size: 'md', placeholder: '' };

/** An element's opening tag with its changed props, still open. */
function opening(tag: string, props: Record<string, string | boolean>) {
  return jsx(tag, props, DEFAULTS).replace(/ \/>$/, '');
}

function code(values: Values) {
  const root = opening('Combobox', {
    autoHighlight: values.autoHighlight,
    disabled: values.disabled,
  });
  const input = opening('ComboboxInput id={id} className="w-full"', {
    placeholder: values.placeholder,
    size: values.size,
    showClear: values.showClear,
  });
  // The chevron shows unless told not to: write the false, not the true.
  const showTrigger = values.showTrigger ? '' : ' showTrigger={false}';
  return `import {
  Combobox,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
} from 'omuk-ui/combobox';
import { Label } from 'omuk-ui/label';

<Label htmlFor={id}>Time zone</Label>
${root} items={TIME_ZONES} value={zone} onValueChange={setZone}>
  ${input}${showTrigger} />
  <ComboboxContent>
    <ComboboxEmpty>No time zone matches.</ComboboxEmpty>
    <ComboboxList>
      {(item) => (
        <ComboboxItem key={item} value={item}>
          {item}
        </ComboboxItem>
      )}
    </ComboboxList>
  </ComboboxContent>
</Combobox>`;
}

export default function ComboboxPlayground() {
  return (
    <Playground
      initial={INITIAL}
      controls={[
        { name: 'placeholder', kind: 'text' },
        { name: 'size', kind: 'choice', options: SIZES },
        { name: 'showClear', kind: 'boolean' },
        { name: 'showTrigger', kind: 'boolean' },
        { name: 'autoHighlight', kind: 'boolean' },
        { name: 'disabled', kind: 'boolean' },
      ]}
      render={(values) => <Preview {...values} />}
      code={code}
    />
  );
}
