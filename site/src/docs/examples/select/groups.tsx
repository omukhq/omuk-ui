import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
} from '@omuk/ui/select';

const ZONES = [
  {
    label: 'Europe',
    items: [
      { value: 'Europe/London', label: 'London' },
      { value: 'Europe/Berlin', label: 'Berlin' },
    ],
  },
  {
    label: 'Asia',
    items: [
      { value: 'Asia/Dhaka', label: 'Dhaka' },
      { value: 'Asia/Singapore', label: 'Singapore' },
    ],
  },
];

export default function SelectGroups() {
  return (
    <Select items={ZONES} defaultValue="Asia/Dhaka">
      <SelectTrigger aria-label="Time zone" className="w-56">
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        {ZONES.map((zone, index) => (
          <SelectGroup key={zone.label}>
            {index > 0 && <SelectSeparator />}
            <SelectLabel>{zone.label}</SelectLabel>
            {zone.items.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectGroup>
        ))}
      </SelectContent>
    </Select>
  );
}
