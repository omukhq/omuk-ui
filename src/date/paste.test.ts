// A paste into a date field (fromPaste, segments.ts): ISO text, or the
// numbers in the field's order; anything that does not fit is refused.
import { describe, expect, test } from 'bun:test';
import { fromPaste } from './segments';

const PERIODS = ['AM', 'PM'] as const;
const US_DATE = ['month', 'day', 'year'] as const;
const UK_DATE = ['day', 'month', 'year'] as const;

describe('fromPaste', () => {
  test('ISO date', () => {
    expect(fromPaste('2026-12-04', US_DATE, 'date', 12, PERIODS)).toEqual({
      year: 2026,
      month: 12,
      day: 4,
    });
  });

  test("the field's own order", () => {
    expect(fromPaste('12/4/2026', US_DATE, 'date', 12, PERIODS)).toEqual({
      month: 12,
      day: 4,
      year: 2026,
    });
    expect(fromPaste(' 4.12.2026 ', UK_DATE, 'date', 24, PERIODS)).toEqual({
      day: 4,
      month: 12,
      year: 2026,
    });
  });

  test('a time with its day period', () => {
    expect(
      fromPaste(
        '2:30 pm',
        ['hour', 'minute', 'dayPeriod'],
        'time',
        12,
        PERIODS,
      ),
    ).toEqual({ hour: 2, minute: 30, dayPeriod: 1 });
  });

  test('ISO time in a 24-hour field', () => {
    expect(fromPaste('14:30', ['hour', 'minute'], 'time', 24, PERIODS)).toEqual(
      { hour: 14, minute: 30 },
    );
  });

  test.each([
    ['13/40/2026', 'a month and day out of range'],
    ['31/2/2026', 'no 31 February'],
    ['12/2026', 'a part missing'],
    ['hello', 'no numbers'],
  ])('%s is refused (%s)', (text) => {
    expect(fromPaste(text, UK_DATE, 'date', 24, PERIODS)).toBeNull();
  });

  test('a 12-hour time without its day period is refused', () => {
    expect(
      fromPaste('2:30', ['hour', 'minute', 'dayPeriod'], 'time', 12, PERIODS),
    ).toBeNull();
  });
});
