import { Sortable, SortableHandle, SortableItem } from '@omuk/ui/sortable';
import { useState } from 'react';
import { Playground } from '../../playground';

const STEPS = ['Lint', 'Test', 'Build', 'Migrate', 'Deploy', 'Notify'];

/** The default hint of the handle's tooltip. */
const DEFAULT_HINT = 'Drag, or press Up or Down';

/** An item's frame, as the preview and the code draw it. */
const ITEM = 'rounded-md p-2 inset-ring inset-ring-border';

type Values = {
  items: number;
  'aria-label': string;
  hint: string;
  disabled: boolean;
};

const INITIAL: Values = {
  items: 4,
  'aria-label': 'Pipeline steps',
  hint: DEFAULT_HINT,
  disabled: false,
};

function Preview({ items, hint, disabled, ...props }: Values) {
  const [steps, setSteps] = useState(() => STEPS.slice(0, items));
  return (
    <Sortable
      value={steps}
      onValueChange={setSteps}
      aria-label={props['aria-label']}
      className="w-full max-w-sm gap-1"
    >
      {steps.map((step) => (
        <SortableItem key={step} value={step} label={step} className={ITEM}>
          <SortableHandle hint={hint} disabled={disabled} />
          <span className="text-sm font-medium">{step}</span>
        </SortableItem>
      ))}
    </Sortable>
  );
}

function code({ items, hint, disabled, ...props }: Values) {
  const handle = [
    '<SortableHandle',
    hint !== DEFAULT_HINT && ` hint="${hint}"`,
    disabled && ' disabled',
    ' />',
  ];
  const names = STEPS.slice(0, items).map((step) => `'${step}'`);
  return `import { Sortable, SortableHandle, SortableItem } from '@omuk/ui/sortable';

const [steps, setSteps] = useState([${names.join(', ')}]);

<Sortable
  value={steps}
  onValueChange={setSteps}
  aria-label="${props['aria-label']}"
  className="w-full max-w-sm gap-1"
>
  {steps.map((step) => (
    <SortableItem
      key={step}
      value={step}
      label={step}
      className="${ITEM}"
    >
      ${handle.filter(Boolean).join('')}
      <span className="text-sm font-medium">{step}</span>
    </SortableItem>
  ))}
</Sortable>`;
}

export default function SortablePlayground() {
  return (
    <Playground
      initial={INITIAL}
      controls={[
        { name: 'items', kind: 'number', min: 2, max: STEPS.length },
        { name: 'aria-label', kind: 'text' },
        { name: 'hint', kind: 'text' },
        { name: 'disabled', kind: 'boolean' },
      ]}
      render={(values) => (
        // A new number of items starts again from the first order.
        <Preview key={values.items} {...values} />
      )}
      code={code}
    />
  );
}
