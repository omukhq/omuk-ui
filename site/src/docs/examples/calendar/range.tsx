import { Calendar, type DateRange } from 'omuk-ui/calendar';
import { useState } from 'react';

export default function CalendarRange() {
  const [trip, setTrip] = useState<DateRange | null>({
    start: '2026-12-21',
    end: '2026-12-28',
  });
  return (
    <div className="flex flex-col items-center gap-2">
      <Calendar
        mode="range"
        aria-label="Time off"
        value={trip}
        onChange={setTrip}
        visibleMonths={2}
        className="flex-wrap justify-center"
      />
      <p className="text-sm text-muted">
        {trip ? `Away from ${trip.start} to ${trip.end}.` : 'No days chosen.'}
      </p>
    </div>
  );
}
