import { DatePicker, type DateRange } from '@omuk/ui/date-picker';
import { Label } from '@omuk/ui/label';
import { useId, useState } from 'react';

// The date pickers: a day, and a range with presets. This file is its own
// chunk (gallery.tsx loads it with lazy()), so the page's first screen never
// downloads the calendar.

/** Today as ISO text, in the visitor's time zone. */
function today() {
  const now = new Date();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  return `${now.getFullYear()}-${month}-${day}`;
}

/** The day `days` after `iso` (before it, when negative). */
function shift(iso: string, days: number) {
  const [year, month, day] = iso.split('-').map(Number);
  const date = new Date(Date.UTC(year ?? 1970, (month ?? 1) - 1, day ?? 1));
  date.setUTCDate(date.getUTCDate() + days);
  return date.toISOString().slice(0, 10);
}

export default function DateDemo() {
  const [day, setDay] = useState<string | null>(today);
  const [range, setRange] = useState<DateRange | null>(null);
  const dayId = useId();
  const rangeId = useId();
  const end = today();
  const presets = [
    { label: 'Last 7 days', range: { start: shift(end, -6), end } },
    { label: 'Last 30 days', range: { start: shift(end, -29), end } },
  ];

  return (
    <div className="grid gap-4 sm:grid-cols-2">
      <div className="flex flex-col gap-1">
        <Label htmlFor={dayId}>Due date</Label>
        <DatePicker id={dayId} value={day} onChange={setDay} />
      </div>
      <div className="flex flex-col gap-1">
        <Label htmlFor={rangeId}>Period</Label>
        <DatePicker
          id={rangeId}
          mode="range"
          value={range}
          onChange={setRange}
          presets={presets}
          showClear
          align="end"
        />
      </div>
    </div>
  );
}
