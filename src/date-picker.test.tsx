// The props follow the mode (the date pickers plan): a wrong value for a
// mode does not compile. `bun run typecheck` checks the @ts-expect-error
// lines; the test only makes sure the file is in the suite.
import { expect, test } from 'bun:test';
import { DatePicker, type DatePickerProps } from './date-picker';

const ok: DatePickerProps[] = [
  { value: '2026-11-18', onChange: (day: string | null) => day },
  { mode: 'date', granularity: 'minute', value: '2026-11-18T14:30' },
  {
    mode: 'range',
    value: { start: '2026-11-01', end: '2026-11-18' },
    onChange: (range) => range?.start,
    presets: [
      { label: 'Today', range: { start: '2026-11-18', end: '2026-11-18' } },
    ],
  },
  { mode: 'time', value: '14:30' },
];

const wrong: DatePickerProps[] = [
  // @ts-expect-error A range's value is { start, end }, not one day.
  { mode: 'range', value: '2026-11-18' },
  // @ts-expect-error One day is not a range.
  { mode: 'date', value: { start: '2026-11-01', end: '2026-11-18' } },
  // @ts-expect-error Presets are for a range only.
  { mode: 'date', presets: [] },
  // @ts-expect-error A time has no calendar.
  { mode: 'time', visibleMonths: 2 },
];

test('each mode takes its own value', () => {
  expect(ok).toHaveLength(4);
  expect(wrong).toHaveLength(4);
  expect(typeof DatePicker).toBe('function');
});
