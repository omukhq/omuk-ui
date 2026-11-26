import { Sortable, SortableHandle, SortableItem } from 'omuk-ui/sortable';
import { useState } from 'react';

const COLUMNS: Record<string, string> = {
  name: 'Name',
  email: 'Email',
  plan: 'Plan',
  joined: 'Joined',
  lastSeen: 'Last seen',
};

export default function SortableColumns() {
  const [order, setOrder] = useState(Object.keys(COLUMNS));
  return (
    <div className="flex w-full max-w-xs flex-col gap-2">
      <p className="text-sm font-medium text-foreground">Column order</p>
      <Sortable value={order} onValueChange={setOrder} aria-label="Columns">
        {order.map((key) => (
          <SortableItem
            key={key}
            value={key}
            label={COLUMNS[key] ?? key}
            className="h-9 pr-3"
          >
            <SortableHandle />
            <span className="text-sm">{COLUMNS[key]}</span>
          </SortableItem>
        ))}
      </Sortable>
    </div>
  );
}
