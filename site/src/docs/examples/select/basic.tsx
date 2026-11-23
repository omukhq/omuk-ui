import { Label } from '@omuk/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@omuk/ui/select';
import { useId, useState } from 'react';

const REGIONS = [
  { value: 'eu', label: 'Europe (Frankfurt)' },
  { value: 'us', label: 'United States (Virginia)' },
  { value: 'ap', label: 'Asia Pacific (Singapore)' },
];

export default function SelectRegion() {
  const id = useId();
  const [region, setRegion] = useState<string | null>('eu');
  return (
    <div className="flex w-full max-w-xs flex-col gap-1">
      <Label htmlFor={id}>Region</Label>
      <Select items={REGIONS} value={region} onValueChange={setRegion}>
        <SelectTrigger id={id} className="w-full">
          <SelectValue placeholder="Choose a region" />
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
