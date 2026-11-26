import { DatePicker } from 'omuk-ui/date-picker';
import { useState } from 'react';

export default function DatePickerDay() {
  const [due, setDue] = useState<string | null>('2026-12-04');
  return (
    <div className="flex w-full max-w-xs flex-col gap-1">
      <span aria-hidden className="text-sm font-medium text-foreground">
        Due date
      </span>
      <DatePicker aria-label="Due date" value={due} onChange={setDue} />
      <p className="font-mono text-xs text-muted">{due ?? 'No date'}</p>
    </div>
  );
}
