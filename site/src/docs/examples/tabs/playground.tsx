import { Tabs, TabsContent, TabsList, TabsTrigger } from '@omuk/ui/tabs';
import { Playground } from '../../playground';

const VARIANTS = ['default', 'line'] as const;
const ORIENTATIONS = ['horizontal', 'vertical'] as const;

const PAGES = [
  {
    value: 'overview',
    name: 'Overview',
    text: 'The billing service runs in two regions.',
  },
  {
    value: 'deployments',
    name: 'Deployments',
    text: '38 deployments this month. None failed.',
  },
  { value: 'logs', name: 'Logs', text: 'The last error was three days ago.' },
  {
    value: 'settings',
    name: 'Settings',
    text: 'Change the name, the regions and who can deploy.',
  },
];

type Values = {
  variant: (typeof VARIANTS)[number];
  orientation: (typeof ORIENTATIONS)[number];
  tabs: number;
  disabled: boolean;
  activateOnFocus: boolean;
};

const INITIAL: Values = {
  variant: 'line',
  orientation: 'horizontal',
  tabs: 3,
  disabled: false,
  activateOnFocus: true,
};

function code({
  variant,
  orientation,
  tabs,
  disabled,
  activateOnFocus,
}: Values) {
  const shown = PAGES.slice(0, tabs);
  const last = shown.length - 1;
  const root = orientation === 'vertical' ? ' orientation="vertical"' : '';
  const list = [
    variant === 'line' && ' variant="line"',
    !activateOnFocus && ' activateOnFocus={false}',
  ];
  const triggers = shown.map(
    (page, index) =>
      `    <TabsTrigger value="${page.value}"${disabled && index === last ? ' disabled' : ''}>${page.name}</TabsTrigger>`,
  );
  const panels = shown.map(
    (page) =>
      `  <TabsContent value="${page.value}" className="py-4 text-muted">\n    ${page.text}\n  </TabsContent>`,
  );
  return `import { Tabs, TabsContent, TabsList, TabsTrigger } from '@omuk/ui/tabs';

<Tabs defaultValue="overview"${root} className="w-full">
  <TabsList${list.filter(Boolean).join('')} aria-label="Project">
${triggers.join('\n')}
  </TabsList>
${panels.join('\n')}
</Tabs>`;
}

export default function TabsPlayground() {
  return (
    <Playground
      align="start"
      initial={INITIAL}
      controls={[
        { name: 'variant', kind: 'choice', options: VARIANTS },
        { name: 'orientation', kind: 'choice', options: ORIENTATIONS },
        { name: 'tabs', kind: 'number', min: 2, max: PAGES.length },
        { name: 'disabled', kind: 'boolean' },
        { name: 'activateOnFocus', kind: 'boolean' },
      ]}
      render={({ variant, orientation, tabs, disabled, activateOnFocus }) => {
        const shown = PAGES.slice(0, tabs);
        return (
          // A new set of tabs starts again on the first one.
          <Tabs
            key={tabs}
            defaultValue="overview"
            orientation={orientation}
            className="w-full"
          >
            <TabsList
              variant={variant}
              activateOnFocus={activateOnFocus}
              aria-label="Project"
            >
              {shown.map((page, index) => (
                <TabsTrigger
                  key={page.value}
                  value={page.value}
                  disabled={disabled && index === shown.length - 1}
                >
                  {page.name}
                </TabsTrigger>
              ))}
            </TabsList>
            {shown.map((page) => (
              <TabsContent
                key={page.value}
                value={page.value}
                className="py-4 text-muted"
              >
                {page.text}
              </TabsContent>
            ))}
          </Tabs>
        );
      }}
      code={code}
    />
  );
}
