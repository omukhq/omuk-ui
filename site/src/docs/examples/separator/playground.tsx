import { Separator } from 'omuk-ui/separator';
import { cn } from 'omuk-ui/utils';
import { Playground } from '../../playground';

const ORIENTATIONS = ['horizontal', 'vertical'] as const;

type Values = {
  orientation: (typeof ORIENTATIONS)[number];
};

const INITIAL: Values = { orientation: 'horizontal' };

function code({ orientation }: Values) {
  const across = orientation === 'horizontal';
  return [
    "import { Separator } from 'omuk-ui/separator';",
    '',
    `<div className="${across ? 'flex w-64 flex-col gap-3' : 'flex h-5 items-center gap-3'} text-sm">`,
    '  <span>Profile</span>',
    across ? '  <Separator />' : '  <Separator orientation="vertical" />',
    '  <span>Security</span>',
    '</div>',
  ].join('\n');
}

export default function SeparatorPlayground() {
  return (
    <Playground
      initial={INITIAL}
      controls={[
        { name: 'orientation', kind: 'choice', options: ORIENTATIONS },
      ]}
      render={({ orientation }) => (
        <div
          className={cn(
            orientation === 'horizontal'
              ? 'flex w-64 flex-col gap-3'
              : 'flex h-5 items-center gap-3',
            'text-sm',
          )}
        >
          <span>Profile</span>
          <Separator orientation={orientation} />
          <span>Security</span>
        </div>
      )}
      code={code}
    />
  );
}
