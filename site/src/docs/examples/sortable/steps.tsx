import { Sortable, SortableHandle, SortableItem } from '@omuk/ui/sortable';
import { useState } from 'react';

const STEPS = [
  { id: 'lint', name: 'Lint', detail: 'Biome, about 4 seconds' },
  { id: 'test', name: 'Test', detail: 'Unit and API tests' },
  { id: 'build', name: 'Build', detail: 'The web app and the server' },
  { id: 'deploy', name: 'Deploy', detail: 'To the preview first' },
];

export default function SortableSteps() {
  const [steps, setSteps] = useState(STEPS);

  function reorder(order: string[]) {
    setSteps(order.flatMap((id) => STEPS.filter((step) => step.id === id)));
  }

  return (
    <Sortable
      value={steps.map((step) => step.id)}
      onValueChange={reorder}
      aria-label="Pipeline steps"
      className="w-full max-w-sm gap-1"
    >
      {steps.map((step, index) => (
        <SortableItem
          key={step.id}
          value={step.id}
          label={step.name}
          className="rounded-md p-2 inset-ring inset-ring-border"
        >
          <SortableHandle hint="Drag to change when it runs" />
          <span className="w-4 text-xs text-muted tabular-nums">
            {index + 1}
          </span>
          <div className="flex min-w-0 flex-col">
            <span className="text-sm font-medium">{step.name}</span>
            <span className="truncate text-xs text-muted">{step.detail}</span>
          </div>
        </SortableItem>
      ))}
    </Sortable>
  );
}
