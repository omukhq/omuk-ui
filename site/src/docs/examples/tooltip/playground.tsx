import { Button } from 'omuk-ui/button';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from 'omuk-ui/tooltip';
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
  content: string;
  side: (typeof SIDES)[number];
  align: (typeof ALIGNS)[number];
  sideOffset: number;
  delay: number;
};

const INITIAL: Values = {
  content: 'Copy the value',
  side: 'top',
  align: 'center',
  sideOffset: 4,
  delay: 0,
};

function code({ content, delay, ...placement }: Values) {
  return `import { Button } from 'omuk-ui/button';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from 'omuk-ui/tooltip';

${jsx(
  'TooltipProvider',
  { delay },
  INITIAL,
  `
  <Tooltip>
    <TooltipTrigger render={<Button variant="outline" />}>
      Point at me
    </TooltipTrigger>
    ${jsx('TooltipContent', placement, INITIAL, content)}
  </Tooltip>
`,
)}`;
}

export default function TooltipPlayground() {
  return (
    <Playground
      initial={INITIAL}
      controls={[
        { name: 'content', kind: 'text' },
        { name: 'side', kind: 'choice', options: SIDES },
        { name: 'align', kind: 'choice', options: ALIGNS },
        { name: 'sideOffset', kind: 'number', min: 0, max: 32 },
        { name: 'delay', kind: 'number', min: 0, max: 2000 },
      ]}
      render={({ content, delay, ...placement }) => (
        <TooltipProvider delay={delay}>
          <Tooltip>
            <TooltipTrigger render={<Button variant="outline" />}>
              Point at me
            </TooltipTrigger>
            <TooltipContent {...placement}>{content}</TooltipContent>
          </Tooltip>
        </TooltipProvider>
      )}
      code={code}
    />
  );
}
