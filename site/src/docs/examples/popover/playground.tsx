import { Button } from 'omuk-ui/button';
import {
  Popover,
  PopoverContent,
  PopoverDescription,
  PopoverHeader,
  PopoverTitle,
  PopoverTrigger,
} from 'omuk-ui/popover';
import { jsx, Playground } from '../../playground';

const SIDES = [
  'top',
  'bottom',
  'left',
  'right',
  'inline-start',
  'inline-end',
] as const;
const ALIGNS = ['start', 'center', 'end'] as const;

type Values = {
  side: (typeof SIDES)[number];
  align: (typeof ALIGNS)[number];
  sideOffset: number;
  title: string;
  description: string;
};

const INITIAL: Values = {
  side: 'bottom',
  align: 'center',
  sideOffset: 4,
  title: 'Access tokens',
  description: 'A token lets the CLI read one environment.',
};

function code({ title, description, ...placement }: Values) {
  const body = `
    <div className="flex flex-col gap-3 p-3">
      <PopoverHeader>
        <PopoverTitle>${title}</PopoverTitle>
        <PopoverDescription>${description}</PopoverDescription>
      </PopoverHeader>
    </div>
  `;
  return `import { Button } from 'omuk-ui/button';
import {
  Popover,
  PopoverContent,
  PopoverDescription,
  PopoverHeader,
  PopoverTitle,
  PopoverTrigger,
} from 'omuk-ui/popover';

<Popover>
  <PopoverTrigger render={<Button variant="outline" />}>
    Open the popover
  </PopoverTrigger>
  ${jsx('PopoverContent', placement, INITIAL, body)}
</Popover>`;
}

export default function PopoverPlayground() {
  return (
    <Playground
      initial={INITIAL}
      controls={[
        { name: 'side', kind: 'choice', options: SIDES },
        { name: 'align', kind: 'choice', options: ALIGNS },
        { name: 'sideOffset', kind: 'number', min: 0, max: 32 },
        { name: 'title', kind: 'text' },
        { name: 'description', kind: 'text' },
      ]}
      render={({ title, description, ...placement }) => (
        <Popover>
          <PopoverTrigger render={<Button variant="outline" />}>
            Open the popover
          </PopoverTrigger>
          <PopoverContent {...placement}>
            <div className="flex flex-col gap-3 p-3">
              <PopoverHeader>
                <PopoverTitle>{title}</PopoverTitle>
                <PopoverDescription>{description}</PopoverDescription>
              </PopoverHeader>
            </div>
          </PopoverContent>
        </Popover>
      )}
      code={code}
    />
  );
}
