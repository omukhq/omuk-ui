import { Button } from 'omuk-ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from 'omuk-ui/dropdown-menu';
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
const VARIANTS = ['default', 'destructive'] as const;

type Values = {
  side: (typeof SIDES)[number];
  align: (typeof ALIGNS)[number];
  sideOffset: number;
  variant: (typeof VARIANTS)[number];
  disabled: boolean;
};

const INITIAL: Values = {
  side: 'bottom',
  align: 'start',
  sideOffset: 4,
  variant: 'destructive',
  disabled: false,
};

function code({ variant, disabled, ...placement }: Values) {
  const items = `
    <DropdownMenuItem>Rename</DropdownMenuItem>
    ${jsx('DropdownMenuItem', { disabled }, INITIAL, 'Duplicate')}
    <DropdownMenuSeparator />
    ${jsx('DropdownMenuItem', { variant }, { variant: 'default' }, 'Delete')}
  `;
  return `import { Button } from 'omuk-ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from 'omuk-ui/dropdown-menu';

<DropdownMenu>
  <DropdownMenuTrigger render={<Button variant="outline" />}>
    Options
  </DropdownMenuTrigger>
  ${jsx('DropdownMenuContent', { ...placement, className: 'w-56' }, INITIAL, items)}
</DropdownMenu>`;
}

export default function DropdownMenuPlayground() {
  return (
    <Playground
      initial={INITIAL}
      controls={[
        { name: 'side', kind: 'choice', options: SIDES },
        { name: 'align', kind: 'choice', options: ALIGNS },
        { name: 'sideOffset', kind: 'number', min: 0, max: 32 },
        { name: 'variant', kind: 'choice', options: VARIANTS },
        { name: 'disabled', kind: 'boolean' },
      ]}
      render={({ variant, disabled, ...placement }) => (
        <DropdownMenu>
          <DropdownMenuTrigger render={<Button variant="outline" />}>
            Options
          </DropdownMenuTrigger>
          <DropdownMenuContent {...placement} className="w-56">
            <DropdownMenuItem>Rename</DropdownMenuItem>
            <DropdownMenuItem disabled={disabled}>Duplicate</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem variant={variant}>Delete</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )}
      code={code}
    />
  );
}
