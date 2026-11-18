import { describe, expect, test } from 'bun:test';
import {
  addDays,
  addMonths,
  compareDays,
  dayOfWeek,
  daysInMonth,
  formatDay,
  monthWeeks,
  parseDateTime,
  parseDay,
  parseTime,
  startOfWeek,
  todayIn,
} from './civil';
import {
  dayPeriodNames,
  digitOf,
  fieldParts,
  firstDayOfWeek,
  formatNumber,
  hourCycleOf,
  monthNames,
  weekdayNames,
} from './locale';
import {
  constrain,
  fromValue,
  limitsOf,
  stepPart,
  toValue,
  typeDigit,
  typePeriod,
} from './segments';

const order = (locale: string, kind: 'date' | 'dateTime' | 'time' = 'date') =>
  fieldParts(locale, kind)
    .filter((part) => part.type !== 'literal')
    .map((part) => part.type)
    .join(' ');

describe('civil dates', () => {
  test('ISO text: only real days and times', () => {
    expect(parseDay('2026-11-18')).toEqual({ year: 2026, month: 11, day: 18 });
    expect(parseDay('2026-02-29')).toBeNull();
    expect(parseDay('2028-02-29')).not.toBeNull();
    expect(parseDay('2026-13-01')).toBeNull();
    expect(parseDay('18/11/2026')).toBeNull();
    expect(parseTime('23:59')).toEqual({ hour: 23, minute: 59 });
    expect(parseTime('24:00')).toBeNull();
    expect(parseDateTime('2026-11-18T14:30')).toEqual({
      year: 2026,
      month: 11,
      day: 18,
      hour: 14,
      minute: 30,
    });
    expect(formatDay({ year: 987, month: 3, day: 4 })).toBe('0987-03-04');
  });

  test('months: lengths, adding, the last day kept', () => {
    expect(daysInMonth(2024, 2)).toBe(29);
    expect(daysInMonth(1900, 2)).toBe(28);
    expect(daysInMonth(2000, 2)).toBe(29);
    expect(addMonths({ year: 2026, month: 1, day: 31 }, 1)).toEqual({
      year: 2026,
      month: 2,
      day: 28,
    });
    expect(addMonths({ year: 2026, month: 1, day: 15 }, -2)).toEqual({
      year: 2025,
      month: 11,
      day: 15,
    });
  });

  test('days: adding over months and years, comparing, weekdays', () => {
    expect(addDays({ year: 2026, month: 12, day: 31 }, 1)).toEqual({
      year: 2027,
      month: 1,
      day: 1,
    });
    expect(
      compareDays(
        { year: 2026, month: 1, day: 1 },
        { year: 2025, month: 12, day: 31 },
      ),
    ).toBe(1);
    expect(dayOfWeek({ year: 2026, month: 11, day: 18 })).toBe(3); // Wednesday
    expect(dayOfWeek({ year: 50, month: 1, day: 1 })).toBe(6); // proleptic
    expect(startOfWeek({ year: 2026, month: 11, day: 18 }, 1)).toEqual({
      year: 2026,
      month: 11,
      day: 16,
    });
  });

  test('a month in weeks: whole weeks from the first day of the week', () => {
    const weeks = monthWeeks({ year: 2026, month: 11, day: 1 }, 1);
    expect(weeks.every((week) => week.length === 7)).toBe(true);
    expect(dayOfWeek(weeks[0][0])).toBe(1);
    expect(weeks[0][0]).toEqual({ year: 2026, month: 10, day: 26 });
    expect(weeks.at(-1)?.at(-1)).toEqual({ year: 2026, month: 12, day: 6 });
  });

  test('today in a time zone', () => {
    // 2026-11-18 23:30 in UTC is already the 19th in Dhaka (UTC+6).
    const now = new Date(Date.UTC(2026, 10, 18, 23, 30));
    expect(todayIn('UTC', now).day).toBe(18);
    expect(todayIn('Asia/Dhaka', now).day).toBe(19);
    expect(todayIn('America/Los_Angeles', now).day).toBe(18);
  });
});

describe('languages', () => {
  test('the order of the parts', () => {
    expect(order('en-US')).toBe('month day year');
    expect(order('en-GB')).toBe('day month year');
    expect(order('de-DE')).toBe('day month year');
    expect(order('ja-JP')).toBe('year month day');
    expect(order('en-US', 'time')).toBe('hour minute dayPeriod');
    expect(order('en-GB', 'time')).toBe('hour minute');
  });

  test('the separators', () => {
    const literals = fieldParts('de-DE', 'date')
      .flatMap((part) => (part.type === 'literal' ? [part.text] : []))
      .join('|');
    expect(literals).toBe('.|.');
  });

  test('12 or 24 hours, AM and PM', () => {
    expect(hourCycleOf('en-US')).toBe(12);
    expect(hourCycleOf('en-GB')).toBe(24);
    expect(hourCycleOf('de-DE')).toBe(24);
    expect(dayPeriodNames('en-US')).toEqual(['AM', 'PM']);
  });

  test('the first day of the week', () => {
    expect(firstDayOfWeek('en-US')).toBe(0);
    expect(firstDayOfWeek('en-GB')).toBe(1);
    expect(firstDayOfWeek('de-DE')).toBe(1);
    expect(firstDayOfWeek('ar-EG')).toBe(6);
  });

  test('names and digits', () => {
    expect(monthNames('en-US')[10]).toBe('November');
    expect(weekdayNames('en-US')[0]).toBe('Sun');
    expect(digitOf('٣', 'ar-EG')).toBe(3);
    expect(digitOf('7', 'ar-EG')).toBe(7);
    expect(digitOf('x', 'en-US')).toBeNull();
    expect(formatNumber('en-US', 5, 2)).toBe('05');
  });
});

describe('the typed parts', () => {
  const month = { min: 1, max: 12 };
  const hour24 = { min: 0, max: 23 };

  test('typing waits while another digit fits, then moves on', () => {
    expect(typeDigit('', 1, month)).toEqual({
      value: 1,
      buffer: '1',
      advance: false,
    });
    expect(typeDigit('1', 2, month)).toEqual({
      value: 12,
      buffer: '',
      advance: true,
    });
    expect(typeDigit('', 3, month)).toEqual({
      value: 3,
      buffer: '',
      advance: true,
    });
    // 1 then 5 is past 12: the 5 starts the part again, and fills it.
    expect(typeDigit('1', 5, month)).toEqual({
      value: 5,
      buffer: '',
      advance: true,
    });
    // A 0 alone is not a month yet.
    expect(typeDigit('', 0, month)).toEqual({
      value: null,
      buffer: '0',
      advance: false,
    });
    expect(typeDigit('0', 4, month).value).toBe(4);
    expect(typeDigit('', 2, hour24).advance).toBe(false);
    expect(typeDigit('2', 3, hour24).value).toBe(23);
  });

  test('a year takes four digits', () => {
    const year = { min: 1, max: 9999 };
    let typed = typeDigit('', 2, year);
    for (const digit of [0, 2]) typed = typeDigit(typed.buffer, digit, year);
    expect(typed).toEqual({ value: 202, buffer: '202', advance: false });
    expect(typeDigit(typed.buffer, 6, year)).toEqual({
      value: 2026,
      buffer: '',
      advance: true,
    });
  });

  test('Up and Down step and wrap; an empty part starts at the placeholder', () => {
    expect(stepPart(12, 1, month, 1)).toBe(1);
    expect(stepPart(1, -1, month, 1)).toBe(12);
    expect(stepPart(10, 5, month, 1)).toBe(3);
    expect(stepPart(undefined, 1, month, 11)).toBe(11);
    expect(stepPart(0, -1, hour24, 0)).toBe(23);
  });

  test('the day follows the month and the year', () => {
    expect(limitsOf('day', { month: 2, year: 2026 }, 24).max).toBe(28);
    expect(limitsOf('day', { month: 2 }, 24).max).toBe(29);
    expect(limitsOf('day', {}, 24).max).toBe(31);
    expect(limitsOf('hour', {}, 12)).toEqual({ min: 1, max: 12 });
    expect(constrain({ day: 31, month: 4, year: 2026 }).day).toBe(30);
  });

  test('a or p sets AM or PM', () => {
    expect(typePeriod('a', ['AM', 'PM'])).toBe(0);
    expect(typePeriod('P', ['AM', 'PM'])).toBe(1);
    expect(typePeriod('x', ['AM', 'PM'])).toBeNull();
  });

  test('a value only when every part is filled', () => {
    expect(toValue({ day: 18, month: 11 }, 'date', 24)).toBeNull();
    expect(toValue({ day: 18, month: 11, year: 2026 }, 'date', 24)).toBe(
      '2026-11-18',
    );
    expect(toValue({ hour: 2, minute: 30, dayPeriod: 1 }, 'time', 12)).toBe(
      '14:30',
    );
    expect(toValue({ hour: 12, minute: 0, dayPeriod: 0 }, 'time', 12)).toBe(
      '00:00',
    );
    expect(
      toValue(
        { day: 31, month: 2, year: 2026, hour: 9, minute: 5 },
        'dateTime',
        24,
      ),
    ).toBe('2026-02-28T09:05');
  });

  test('a value back to its parts', () => {
    expect(fromValue('2026-11-18', 'date', 24)).toEqual({
      year: 2026,
      month: 11,
      day: 18,
    });
    expect(fromValue('00:15', 'time', 12)).toEqual({
      hour: 12,
      minute: 15,
      dayPeriod: 0,
    });
    expect(fromValue('2026-11-18T14:30', 'dateTime', 12)).toEqual({
      year: 2026,
      month: 11,
      day: 18,
      hour: 2,
      minute: 30,
      dayPeriod: 1,
    });
    expect(fromValue('not a date', 'date', 24)).toEqual({});
    expect(fromValue(null, 'time', 24)).toEqual({});
  });
});
