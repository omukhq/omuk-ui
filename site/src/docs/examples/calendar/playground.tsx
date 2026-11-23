import { Calendar, type DateRange } from '@omuk/ui/calendar';
import { useState } from 'react';
import { Playground } from '../../playground';

const MODES = ['single', 'range'] as const;
const PAGE_BEHAVIORS = ['visible', 'single'] as const;

type Values = {
  mode: (typeof MODES)[number];
  visibleMonths: number;
  pageBehavior: (typeof PAGE_BEHAVIORS)[number];
  isDisabled: boolean;
  isReadOnly: boolean;
};

const INITIAL: Values = {
  mode: 'single',
  visibleMonths: 1,
  pageBehavior: 'visible',
  isDisabled: false,
  isReadOnly: false,
};

/** Months side by side wrap on a narrow screen. */
const WRAP = 'flex-wrap justify-center';

/** The props both modes share, as the preview passes them. */
type Shared = Omit<Values, 'mode'>;

function SingleCalendar(props: Shared) {
  const [day, setDay] = useState<string | null>('2026-12-04');
  return (
    <Calendar
      {...props}
      aria-label="Due date"
      value={day}
      onChange={setDay}
      className={props.visibleMonths > 1 ? WRAP : undefined}
    />
  );
}

function RangeCalendar(props: Shared) {
  const [range, setRange] = useState<DateRange | null>({
    start: '2026-12-21',
    end: '2026-12-28',
  });
  return (
    <Calendar
      {...props}
      mode="range"
      aria-label="Time off"
      value={range}
      onChange={setRange}
      className={props.visibleMonths > 1 ? WRAP : undefined}
    />
  );
}

function code(values: Values) {
  const range = values.mode === 'range';
  const lines = [
    range && 'mode="range"',
    range ? 'aria-label="Time off"' : 'aria-label="Due date"',
    range ? 'value={range}' : 'value={day}',
    range ? 'onChange={setRange}' : 'onChange={setDay}',
    values.visibleMonths !== 1 && `visibleMonths={${values.visibleMonths}}`,
    values.pageBehavior !== 'visible' && 'pageBehavior="single"',
    values.isDisabled && 'isDisabled',
    values.isReadOnly && 'isReadOnly',
    values.visibleMonths > 1 && `className="${WRAP}"`,
  ];
  return `import { Calendar } from '@omuk/ui/calendar';

<Calendar
  ${lines.filter(Boolean).join('\n  ')}
/>`;
}

export default function CalendarPlayground() {
  return (
    <Playground
      initial={INITIAL}
      controls={[
        { name: 'mode', kind: 'choice', options: MODES },
        { name: 'visibleMonths', kind: 'number', min: 1, max: 3 },
        { name: 'pageBehavior', kind: 'choice', options: PAGE_BEHAVIORS },
        { name: 'isDisabled', kind: 'boolean' },
        { name: 'isReadOnly', kind: 'boolean' },
      ]}
      render={({ mode, ...props }) =>
        mode === 'range' ? (
          <RangeCalendar key={mode} {...props} />
        ) : (
          <SingleCalendar key={mode} {...props} />
        )
      }
      code={code}
    />
  );
}
