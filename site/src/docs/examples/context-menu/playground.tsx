import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuLabel,
  ContextMenuSeparator,
  ContextMenuTrigger,
} from '@omuk/ui/context-menu';
import { jsx, Playground } from '../../playground';

const VARIANTS = ['default', 'destructive'] as const;

type Values = {
  label: string;
  variant: (typeof VARIANTS)[number];
  disabled: boolean;
  inset: boolean;
};

const INITIAL: Values = {
  label: '.env.production',
  variant: 'destructive',
  disabled: false,
  inset: false,
};

const TRIGGER_CLASS =
  'flex h-32 w-full max-w-sm items-center justify-center rounded-lg border border-dashed text-sm text-muted outline-none focus-visible:inset-ring-2 focus-visible:inset-ring-outline';

function code({ label, variant, disabled, inset }: Values) {
  return `import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuLabel,
  ContextMenuSeparator,
  ContextMenuTrigger,
} from '@omuk/ui/context-menu';

<ContextMenu>
  <ContextMenuTrigger
    tabIndex={0}
    className="${TRIGGER_CLASS}"
  >
    Right-click here
  </ContextMenuTrigger>
  <ContextMenuContent className="w-56">
    <ContextMenuLabel>${label}</ContextMenuLabel>
    ${jsx('ContextMenuItem', { inset }, INITIAL, 'Rename')}
    ${jsx('ContextMenuItem', { inset, disabled }, INITIAL, 'Duplicate')}
    <ContextMenuSeparator />
    ${jsx('ContextMenuItem', { inset, variant }, { ...INITIAL, variant: 'default' }, 'Delete')}
  </ContextMenuContent>
</ContextMenu>`;
}

export default function ContextMenuPlayground() {
  return (
    <Playground
      initial={INITIAL}
      controls={[
        { name: 'label', kind: 'text' },
        { name: 'variant', kind: 'choice', options: VARIANTS },
        { name: 'disabled', kind: 'boolean' },
        { name: 'inset', kind: 'boolean' },
      ]}
      render={({ label, variant, disabled, inset }) => (
        <ContextMenu>
          <ContextMenuTrigger tabIndex={0} className={TRIGGER_CLASS}>
            Right-click here
          </ContextMenuTrigger>
          <ContextMenuContent className="w-56">
            <ContextMenuLabel>{label}</ContextMenuLabel>
            <ContextMenuItem inset={inset}>Rename</ContextMenuItem>
            <ContextMenuItem inset={inset} disabled={disabled}>
              Duplicate
            </ContextMenuItem>
            <ContextMenuSeparator />
            <ContextMenuItem inset={inset} variant={variant}>
              Delete
            </ContextMenuItem>
          </ContextMenuContent>
        </ContextMenu>
      )}
      code={code}
    />
  );
}
