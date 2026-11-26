import { Segmented, SegmentedItem } from 'omuk-ui/segmented';
import { Playground } from '../../playground';

const PERIODS = ['Day', 'Week', 'Month', 'Quarter', 'Year'];
const SIZES = ['sm', 'md', 'lg'] as const;

type Values = {
  'aria-label': string;
  size: (typeof SIZES)[number];
  segments: number;
  lastDisabled: boolean;
};

const INITIAL: Values = {
  'aria-label': 'Period',
  size: 'md',
  segments: 3,
  lastDisabled: false,
};

/** The segments shown, from 2 to 5. */
function periods(count: number) {
  return PERIODS.slice(0, Math.min(Math.max(count, 2), PERIODS.length));
}

function code(values: Values) {
  const shown = periods(values.segments);
  const items = shown.map((period, at) => {
    const disabled = values.lastDisabled && at === shown.length - 1;
    return `  <SegmentedItem value="${period.toLowerCase()}"${disabled ? ' disabled' : ''}>${period}</SegmentedItem>`;
  });
  return [
    "import { Segmented, SegmentedItem } from 'omuk-ui/segmented';",
    '',
    `<Segmented aria-label="${values['aria-label']}"${values.size === 'md' ? '' : ` size="${values.size}"`} defaultValue="day">`,
    ...items,
    '</Segmented>',
  ].join('\n');
}

export default function SegmentedPlayground() {
  return (
    <Playground
      initial={INITIAL}
      controls={[
        { name: 'aria-label', kind: 'text' },
        { name: 'size', kind: 'choice', options: SIZES },
        { name: 'segments', kind: 'number', min: 2, max: 5 },
        { name: 'lastDisabled', kind: 'boolean' },
      ]}
      render={(values) => {
        const shown = periods(values.segments);
        return (
          <Segmented
            // A new set of segments starts again from the first.
            key={shown.length}
            aria-label={values['aria-label']}
            size={values.size}
            defaultValue="day"
          >
            {shown.map((period, at) => (
              <SegmentedItem
                key={period}
                value={period.toLowerCase()}
                disabled={values.lastDisabled && at === shown.length - 1}
              >
                {period}
              </SegmentedItem>
            ))}
          </Segmented>
        );
      }}
      code={code}
    />
  );
}
