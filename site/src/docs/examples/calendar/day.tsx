import { Calendar, useToday } from 'omuk-ui/calendar';
import { useState } from 'react';

/** Saturdays and Sundays: the office is closed. */
function isWeekend(day: string) {
  const weekday = new Date(`${day}T12:00`).getDay();
  return weekday === 0 || weekday === 6;
}

export default function CalendarDay() {
  const [day, setDay] = useState<string | null>(null);
  // From today on. useToday is null in pre-rendered HTML, until it hydrates.
  const today = useToday();
  return (
    <div className="flex flex-col items-center gap-2">
      <Calendar
        aria-label="Delivery day"
        value={day}
        onChange={setDay}
        minValue={today ?? undefined}
        isDateUnavailable={isWeekend}
      />
      <p className="text-sm text-muted">
        {day ? `Delivery on ${day}.` : 'Choose a weekday for the delivery.'}
      </p>
    </div>
  );
}
