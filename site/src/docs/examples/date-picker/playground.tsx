import { DatePicker, type DateRange } from '@omuk/ui/date-picker';
import { type ReactNode, useState } from 'react';
import { Playground } from '../../playground';

const MODES = ['date', 'range', 'time'] as const;
const GRANULARITIES = ['day', 'minute'] as const;

type Values = {
  mode: (typeof MODES)[number];
  granularity: (typeof GRANULARITIES)[number];
  visibleMonths: number;
  showClear: boolean;
  isDisabled: boolean;
  isInvalid: boolean;
};

const INITIAL: Values = {
  mode: 'date',
  granularity: 'day',
  visibleMonths: 1,
  showClear: false,
  isDisabled: false,
  isInvalid: false,
};

/** What each kind of value is called, in the label and the code. */
function labelOf({ mode, granularity }: Values) {
  if (mode === 'range') return 'Activity between';
  if (mode === 'time') return 'Opens at';
  return granularity === 'minute' ? 'Send the report at' : 'Due date';
}

/** The props every mode takes, as the preview passes them. */
type Shared = Pick<Values, 'showClear' | 'isDisabled' | 'isInvalid'> & {
  'aria-label': string;
};

/** The field's name above it, and the value as text under it. */
function Field({
  label,
  value,
  children,
}: {
  label: string;
  value: string;
  children: ReactNode;
}) {
  return (
    <div className="flex w-full max-w-sm flex-col gap-1">
      <span aria-hidden className="text-sm font-medium text-foreground">
        {label}
      </span>
      {children}
      <p className="font-mono text-xs text-muted">{value}</p>
    </div>
  );
}

function DatePreview({
  granularity,
  visibleMonths,
  ...shared
}: Shared & Pick<Values, 'granularity' | 'visibleMonths'>) {
  const [value, setValue] = useState<string | null>(
    granularity === 'minute' ? '2026-12-04T09:30' : '2026-12-04',
  );
  return (
    <Field label={shared['aria-label']} value={value ?? 'No date'}>
      <DatePicker
        {...shared}
        granularity={granularity}
        visibleMonths={visibleMonths}
        value={value}
        onChange={setValue}
      />
    </Field>
  );
}

function RangePreview({
  visibleMonths,
  ...shared
}: Shared & Pick<Values, 'visibleMonths'>) {
  const [range, setRange] = useState<DateRange | null>({
    start: '2026-12-21',
    end: '2026-12-28',
  });
  return (
    <Field
      label={shared['aria-label']}
      value={range ? `${range.start} to ${range.end}` : 'No range'}
    >
      <DatePicker
        {...shared}
        mode="range"
        visibleMonths={visibleMonths}
        value={range}
        onChange={setRange}
      />
    </Field>
  );
}

function TimePreview(shared: Shared) {
  const [time, setTime] = useState<string | null>('08:00');
  return (
    <Field label={shared['aria-label']} value={time ?? 'Not set'}>
      <DatePicker {...shared} mode="time" value={time} onChange={setTime} />
    </Field>
  );
}

function Preview(values: Values) {
  const shared = {
    'aria-label': labelOf(values),
    showClear: values.showClear,
    isDisabled: values.isDisabled,
    isInvalid: values.isInvalid,
  };
  if (values.mode === 'time') return <TimePreview {...shared} />;
  if (values.mode === 'range') {
    return <RangePreview {...shared} visibleMonths={values.visibleMonths} />;
  }
  return (
    <DatePreview
      // A day and a day with a time are different values: start again.
      key={values.granularity}
      {...shared}
      granularity={values.granularity}
      visibleMonths={values.visibleMonths}
    />
  );
}

function code(values: Values) {
  const { mode } = values;
  const calendar = mode !== 'time';
  const lines = [
    mode !== 'date' && `mode="${mode}"`,
    `aria-label="${labelOf(values)}"`,
    mode === 'date' &&
      values.granularity === 'minute' &&
      'granularity="minute"',
    'value={value}',
    'onChange={setValue}',
    calendar &&
      values.visibleMonths !== 1 &&
      `visibleMonths={${values.visibleMonths}}`,
    values.showClear && 'showClear',
    values.isDisabled && 'isDisabled',
    values.isInvalid && 'isInvalid',
  ];
  return `import { DatePicker } from '@omuk/ui/date-picker';

<DatePicker
  ${lines.filter(Boolean).join('\n  ')}
/>`;
}

export default function DatePickerPlayground() {
  return (
    <Playground
      initial={INITIAL}
      controls={[
        { name: 'mode', kind: 'choice', options: MODES },
        { name: 'granularity', kind: 'choice', options: GRANULARITIES },
        { name: 'visibleMonths', kind: 'number', min: 1, max: 2 },
        { name: 'showClear', kind: 'boolean' },
        { name: 'isDisabled', kind: 'boolean' },
        { name: 'isInvalid', kind: 'boolean' },
      ]}
      render={(values) => <Preview key={values.mode} {...values} />}
      code={code}
    />
  );
}
