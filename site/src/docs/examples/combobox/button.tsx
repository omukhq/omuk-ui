import {
  Combobox,
  ComboboxButton,
  ComboboxCollection,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxGroup,
  ComboboxInput,
  ComboboxItem,
  ComboboxLabel,
  ComboboxList,
  ComboboxValue,
} from 'omuk-ui/combobox';
import { Label } from 'omuk-ui/label';
import { useId } from 'react';

type Region = { label: string; items: string[] };

const REGIONS: Region[] = [
  { label: 'Europe', items: ['Frankfurt', 'London', 'Paris', 'Stockholm'] },
  { label: 'Americas', items: ['Montreal', 'São Paulo', 'Virginia'] },
  { label: 'Asia Pacific', items: ['Mumbai', 'Singapore', 'Sydney', 'Tokyo'] },
];

export default function ComboboxAsButton() {
  const id = useId();
  return (
    <div className="flex w-full max-w-xs flex-col gap-1">
      <Label htmlFor={id}>Database region</Label>
      <Combobox<string> items={REGIONS} defaultValue="Frankfurt">
        <ComboboxButton id={id} className="w-full">
          <ComboboxValue placeholder="Choose a region" />
        </ComboboxButton>
        <ComboboxContent>
          <ComboboxInput aria-label="Search regions" placeholder="Search" />
          <ComboboxEmpty>No region matches.</ComboboxEmpty>
          <ComboboxList>
            {(group: Region) => (
              <ComboboxGroup key={group.label} items={group.items}>
                <ComboboxLabel>{group.label}</ComboboxLabel>
                <ComboboxCollection>
                  {(city: string) => (
                    <ComboboxItem key={city} value={city}>
                      {city}
                    </ComboboxItem>
                  )}
                </ComboboxCollection>
              </ComboboxGroup>
            )}
          </ComboboxList>
        </ComboboxContent>
      </Combobox>
    </div>
  );
}
