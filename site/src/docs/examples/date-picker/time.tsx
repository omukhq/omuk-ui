import { DatePicker } from '@omuk/ui/date-picker';
import { useState } from 'react';

export default function DatePickerTime() {
  const [opensAt, setOpensAt] = useState<string | null>('08:00');
  return (
    <div className="flex w-full max-w-xs flex-col gap-1">
      <span aria-hidden className="text-sm font-medium text-foreground">
        Opens at
      </span>
      <DatePicker
        mode="time"
        aria-label="Opens at"
        value={opensAt}
        onChange={setOpensAt}
        showClear
      />
      <p className="font-mono text-xs text-muted">{opensAt ?? 'Not set'}</p>
    </div>
  );
}
