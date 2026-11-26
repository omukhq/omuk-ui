import {
  Combobox,
  ComboboxChip,
  ComboboxChips,
  ComboboxChipsInput,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxItem,
  ComboboxList,
  ComboboxValue,
  useComboboxAnchor,
} from 'omuk-ui/combobox';
import { Label } from 'omuk-ui/label';
import { useId, useState } from 'react';

const ENVIRONMENTS = [
  'Development',
  'Preview',
  'Staging',
  'Production',
  'Load test',
];

export default function ComboboxMultiple() {
  const id = useId();
  const anchor = useComboboxAnchor();
  const [chosen, setChosen] = useState<string[]>(['Staging', 'Production']);
  return (
    <div className="flex w-full max-w-sm flex-col gap-1">
      <Label htmlFor={id}>Copy to</Label>
      <Combobox
        items={ENVIRONMENTS}
        multiple
        value={chosen}
        onValueChange={setChosen}
      >
        <ComboboxChips ref={anchor}>
          <ComboboxValue>
            {(values: string[]) =>
              values.map((value) => (
                <ComboboxChip key={value}>{value}</ComboboxChip>
              ))
            }
          </ComboboxValue>
          <ComboboxChipsInput
            id={id}
            placeholder={chosen.length ? '' : 'Add an environment'}
          />
        </ComboboxChips>
        <ComboboxContent anchor={anchor}>
          <ComboboxEmpty>No environment matches.</ComboboxEmpty>
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
