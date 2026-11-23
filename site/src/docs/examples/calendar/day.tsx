import { Calendar } from '@omuk/ui/calendar';
import { useState } from 'react';

/** A day as ISO text ("2026-11-23"), in the browser's time zone. */
function isoDay(date: Date) {
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${date.getFullYear()}-${month}-${day}`;
}

/** Saturdays and Sundays: the office is closed. */
function isWeekend(day: string) {
  const weekday = new Date(`${day}T12:00`).getDay();
  return weekday === 0 || weekday === 6;
}

export default function CalendarDay() {
  const [day, setDay] = useState<string | null>(null);
  return (
    <div className="flex flex-col items-center gap-2">
      <Calendar
        aria-label="Delivery day"
        value={day}
        onChange={setDay}
        minValue={isoDay(new Date())}
        isDateUnavailable={isWeekend}
      />
      <p className="text-sm text-muted">
        {day ? `Delivery on ${day}.` : 'Choose a weekday for the delivery.'}
      </p>
    </div>
  );
}
