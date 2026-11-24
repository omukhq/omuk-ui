import { Checkbox } from '@omuk/ui/checkbox';
import { CheckboxGroup } from '@omuk/ui/checkbox-group';
import { Label } from '@omuk/ui/label';
import { useId, useState } from 'react';

const EVENTS = [
  { value: 'comments', label: 'Comments' },
  { value: 'mentions', label: 'Mentions' },
  { value: 'deploys', label: 'Deploys' },
];

export default function CheckboxGroupBasic() {
  const id = useId();
  const [events, setEvents] = useState(['mentions']);
  return (
    <div className="flex flex-col gap-3">
      <p id={`${id}-label`} className="text-sm font-medium text-foreground">
        Email me about
      </p>
      <CheckboxGroup
        aria-labelledby={`${id}-label`}
        value={events}
        onValueChange={setEvents}
      >
        {EVENTS.map((event) => (
          <div key={event.value} className="flex items-center gap-2">
            <Checkbox id={`${id}-${event.value}`} value={event.value} />
            <Label htmlFor={`${id}-${event.value}`} className="font-normal">
              {event.label}
            </Label>
          </div>
        ))}
      </CheckboxGroup>
      <p className="text-sm text-muted">Value: {JSON.stringify(events)}</p>
    </div>
  );
}
