import { DatePicker } from 'omuk-ui/date-picker';
import { useState } from 'react';

export default function DatePickerDayAndTime() {
  const [sendAt, setSendAt] = useState<string | null>('2026-12-01T09:30');
  return (
    <div className="flex w-full max-w-xs flex-col gap-1">
      <span aria-hidden className="text-sm font-medium text-foreground">
        Send the report at
      </span>
      <DatePicker
        aria-label="Send the report at"
        granularity="minute"
        value={sendAt}
        onChange={setSendAt}
      />
      <p className="font-mono text-xs text-muted">{sendAt ?? 'Not set'}</p>
    </div>
  );
}
