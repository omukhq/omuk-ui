import {
  Combobox,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
} from '@omuk/ui/combobox';
import { Label } from '@omuk/ui/label';
import { useId, useState } from 'react';

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
  'Europe/Zurich',
  'Pacific/Auckland',
];

export default function ComboboxBasic() {
  const id = useId();
  const [zone, setZone] = useState<string | null>('Europe/Berlin');
  return (
    <div className="flex w-full max-w-xs flex-col gap-1">
      <Label htmlFor={id}>Time zone</Label>
      <Combobox items={TIME_ZONES} value={zone} onValueChange={setZone}>
        <ComboboxInput
          id={id}
          className="w-full"
          placeholder="Search time zones"
          showClear
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
