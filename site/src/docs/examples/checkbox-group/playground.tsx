import { Checkbox } from 'omuk-ui/checkbox';
import { CheckboxGroup } from 'omuk-ui/checkbox-group';
import { Label } from 'omuk-ui/label';
import { useId } from 'react';
import { Playground } from '../../playground';

const EVENTS = ['comments', 'mentions', 'deploys'];

type Values = {
  /** Adds a `<Checkbox parent>` and the group's `allValues`. */
  parent: boolean;
  disabled: boolean;
};

const INITIAL: Values = { parent: true, disabled: false };

function Preview({ parent, disabled }: Values) {
  const id = useId();
  return (
    <CheckboxGroup
      aria-label="Email me about"
      defaultValue={['mentions']}
      allValues={parent ? EVENTS : undefined}
      disabled={disabled}
    >
      {parent && (
        <div className="flex items-center gap-2">
          <Checkbox id={`${id}-all`} parent />
          <Label htmlFor={`${id}-all`}>Everything</Label>
        </div>
      )}
      {EVENTS.map((event) => (
        <div
          key={event}
          className={
            parent ? 'flex items-center gap-2 pl-6' : 'flex items-center gap-2'
          }
        >
          <Checkbox id={`${id}-${event}`} value={event} />
          <Label htmlFor={`${id}-${event}`} className="font-normal capitalize">
            {event}
          </Label>
        </div>
      ))}
    </CheckboxGroup>
  );
}

function code({ parent, disabled }: Values) {
  const group = [
    '<CheckboxGroup',
    '  aria-label="Email me about"',
    "  defaultValue={['mentions']}",
    ...(parent ? ["  allValues={['comments', 'mentions', 'deploys']}"] : []),
    ...(disabled ? ['  disabled'] : []),
    '>',
  ];
  const all = parent
    ? [
        '  <Checkbox id="all" parent />',
        '  <Label htmlFor="all">Everything</Label>',
      ]
    : [];
  const boxes = EVENTS.flatMap((event) => [
    `  <Checkbox id="${event}" value="${event}" />`,
    `  <Label htmlFor="${event}">${event}</Label>`,
  ]);
  return [
    "import { Checkbox } from 'omuk-ui/checkbox';",
    "import { CheckboxGroup } from 'omuk-ui/checkbox-group';",
    "import { Label } from 'omuk-ui/label';",
    '',
    ...group,
    ...all,
    ...boxes,
    '</CheckboxGroup>',
  ].join('\n');
}

export default function CheckboxGroupPlayground() {
  return (
    <Playground
      initial={INITIAL}
      controls={[
        { name: 'parent', kind: 'boolean' },
        { name: 'disabled', kind: 'boolean' },
      ]}
      // A new group when parent changes, so the boxes start over.
      render={(values) => <Preview key={String(values.parent)} {...values} />}
      code={code}
    />
  );
}
