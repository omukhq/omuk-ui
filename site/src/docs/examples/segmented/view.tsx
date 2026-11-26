import { CalendarIcon, KanbanIcon, ListIcon } from 'lucide-react';
import { Segmented, SegmentedItem } from 'omuk-ui/segmented';
import { useState } from 'react';

export default function SegmentedView() {
  const [view, setView] = useState('list');
  return (
    <div className="flex flex-col items-center gap-3">
      <Segmented aria-label="View" value={view} onValueChange={setView}>
        <SegmentedItem value="list">
          <ListIcon strokeWidth={1.5} aria-hidden />
          List
        </SegmentedItem>
        <SegmentedItem value="board">
          <KanbanIcon strokeWidth={1.5} aria-hidden />
          Board
        </SegmentedItem>
        <SegmentedItem value="calendar">
          <CalendarIcon strokeWidth={1.5} aria-hidden />
          Calendar
        </SegmentedItem>
      </Segmented>
      <p className="text-sm text-muted">Showing the tasks as a {view}.</p>
    </div>
  );
}
