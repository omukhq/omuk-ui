import { Button } from 'omuk-ui/button';
import { Chip } from 'omuk-ui/chip';
import { useState } from 'react';
import { Playground } from '../../playground';

type Values = {
  children: string;
  removable: boolean;
  removeLabel: string;
};

const INITIAL: Values = {
  children: 'ada@example.com',
  removable: true,
  removeLabel: 'Remove ada@example.com',
};

/** The chip, with its own state: pressing remove takes it away. */
function LiveChip({ children, removable, removeLabel }: Values) {
  const [removed, setRemoved] = useState(false);
  if (removed) {
    return (
      <Button variant="outline" size="sm" onClick={() => setRemoved(false)}>
        Bring it back
      </Button>
    );
  }
  return (
    <Chip
      onRemove={removable ? () => setRemoved(true) : undefined}
      removeLabel={removeLabel}
    >
      {children}
    </Chip>
  );
}

function code({ children, removable, removeLabel }: Values) {
  const props = removable
    ? ` onRemove={() => remove(email)}${removeLabel === 'Remove' ? '' : ` removeLabel="${removeLabel}"`}`
    : '';
  return `import { Chip } from 'omuk-ui/chip';\n\n<Chip${props}>${children}</Chip>`;
}

export default function ChipPlayground() {
  return (
    <Playground
      initial={INITIAL}
      controls={[
        { name: 'children', kind: 'text' },
        { name: 'removable', kind: 'boolean' },
        { name: 'removeLabel', kind: 'text' },
      ]}
      render={(values) => <LiveChip {...values} />}
      code={code}
    />
  );
}
