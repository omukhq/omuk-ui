import {
  DatePicker,
  type DatePreset,
  type DateRange,
  useToday,
} from '@omuk/ui/date-picker';
import { useState } from 'react';

/** A day as ISO text ("2026-11-18"), in the browser's time zone. */
function isoDay(date: Date) {
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${date.getFullYear()}-${month}-${day}`;
}

/** The range from `count` days before `today` up to it. */
function lastDays(count: number, today = isoDay(new Date())): DateRange {
  const start = new Date(`${today}T12:00`);
  start.setDate(start.getDate() - (count - 1));
  return { start: isoDay(start), end: today };
}

const PRESETS: DatePreset[] = [
  { label: 'Today', range: lastDays(1) },
  { label: 'Last 7 days', range: lastDays(7) },
  { label: 'Last 30 days', range: lastDays(30) },
  { label: 'Last 90 days', range: lastDays(90) },
];

export default function DatePickerRange() {
  // useToday is null in pre-rendered HTML, until it hydrates.
  const today = useToday();
  const [picked, setPicked] = useState<DateRange | null>();
  // Until a pick: the last 7 days.
  const range =
    picked !== undefined ? picked : today ? lastDays(7, today) : null;
  return (
    <div className="flex w-full max-w-sm flex-col gap-1">
      <span aria-hidden className="text-sm font-medium text-foreground">
        Activity between
      </span>
      <DatePicker
        mode="range"
        aria-label="Activity between"
        value={range}
        onChange={setPicked}
        presets={PRESETS}
        visibleMonths={2}
        maxValue={today ?? undefined}
      />
      <p className="font-mono text-xs text-muted">
        {range ? `${range.start} to ${range.end}` : 'No range'}
      </p>
    </div>
  );
}
