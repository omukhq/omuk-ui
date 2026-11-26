// The typed parts of a date field, without React (React Aria's DateField
// behaviour): typing digits fills a part and moves on, Up and Down step it
// and wrap, Page Up and Page Down take bigger steps, Home and End go to its
// ends. A field's value is ISO text once every part is filled.

import {
  type CivilDateTime,
  daysInMonth,
  formatDateTime,
  formatDay,
  formatTime,
  parseDateTime,
  parseDay,
  parseTime,
} from './civil';
import type { FieldKind, HourCycle, SegmentType } from './locale';

/**
 * The parts typed so far. `hour` is as shown (1–12 with a 12-hour clock,
 * 0–23 with 24); `dayPeriod` is 0 (AM) or 1 (PM).
 */
export type Segments = Partial<Record<SegmentType, number>>;

export type Limits = { min: number; max: number };

/** The bigger step of Page Up and Page Down, for each part. */
export const PAGE_STEP: Record<SegmentType, number> = {
  day: 7,
  month: 2,
  year: 5,
  hour: 2,
  minute: 15,
  dayPeriod: 1,
};

/** The parts a field of this kind has. */
export function partsOf(kind: FieldKind, hourCycle: HourCycle): SegmentType[] {
  const date: SegmentType[] = ['day', 'month', 'year'];
  const time: SegmentType[] =
    hourCycle === 12 ? ['hour', 'minute', 'dayPeriod'] : ['hour', 'minute'];
  if (kind === 'date') return date;
  if (kind === 'time') return time;
  return [...date, ...time];
}

/** A part's smallest and largest value, given the others. */
export function limitsOf(
  type: SegmentType,
  segments: Segments,
  hourCycle: HourCycle,
): Limits {
  switch (type) {
    case 'day':
      // A month without a year allows 29 February.
      return {
        min: 1,
        max: segments.month
          ? daysInMonth(segments.year ?? 2000, segments.month)
          : 31,
      };
    case 'month':
      return { min: 1, max: 12 };
    case 'year':
      return { min: 1, max: 9999 };
    case 'hour':
      return hourCycle === 12 ? { min: 1, max: 12 } : { min: 0, max: 23 };
    case 'minute':
      return { min: 0, max: 59 };
    case 'dayPeriod':
      return { min: 0, max: 1 };
  }
}

/** Up or Down (or a page): by `delta`, wrapping round the part's limits. */
export function stepPart(
  value: number | undefined,
  delta: number,
  { min, max }: Limits,
  start: number,
): number {
  if (value === undefined) return Math.min(max, Math.max(min, start));
  const range = max - min + 1;
  return min + ((((value - min + delta) % range) + range) % range);
}

export type Typed = {
  /** The part's value now; null while only a 0 is typed (month "0…"). */
  value: number | null;
  /** The digits typed into this part so far, kept for the next key. */
  buffer: string;
  /** The part is full: the focus moves to the next one. */
  advance: boolean;
};

/**
 * One digit typed into a part. "1" in a month waits (10, 11 or 12 may
 * follow); "3" fills it and moves on; a digit that would go past the
 * largest value starts the part again.
 */
export function typeDigit(
  buffer: string,
  digit: number,
  { min, max }: Limits,
): Typed {
  let text = buffer + String(digit);
  let number = Number(text);
  if (number > max) {
    text = String(digit);
    number = digit;
  }
  const value = number < min ? null : number;
  const full = text.length >= String(max).length || number * 10 > max;
  return {
    value,
    buffer: full && value !== null ? '' : text,
    advance: full && value !== null,
  };
}

/** "a" or "p" (or the first letter of the language's names): AM or PM. */
export function typePeriod(key: string, names: [string, string]): 0 | 1 | null {
  const letter = key.toLocaleLowerCase();
  if (letter === 'a' || letter === names[0].charAt(0).toLocaleLowerCase()) {
    return 0;
  }
  if (letter === 'p' || letter === names[1].charAt(0).toLocaleLowerCase()) {
    return 1;
  }
  return null;
}

/** The value a part starts from on Up or Down: the placeholder date's. */
export function startOf(
  type: SegmentType,
  placeholder: CivilDateTime,
  hourCycle: HourCycle,
): number {
  if (type === 'dayPeriod') return placeholder.hour >= 12 ? 1 : 0;
  if (type === 'hour' && hourCycle === 12) return placeholder.hour % 12 || 12;
  return placeholder[type];
}

/** A 31st (or 30th) in a shorter month goes to the month's last day. */
export function constrain(segments: Segments): Segments {
  const { day, month, year } = segments;
  if (day === undefined || month === undefined) return segments;
  const last = daysInMonth(year ?? 2000, month);
  return day > last ? { ...segments, day: last } : segments;
}

function to24(hour: number, period: number | undefined, cycle: HourCycle) {
  if (cycle === 24) return hour;
  return (hour % 12) + (period === 1 ? 12 : 0);
}

/** The ISO text, once every part is filled; null before. */
export function toValue(
  segments: Segments,
  kind: FieldKind,
  hourCycle: HourCycle,
): string | null {
  if (!partsOf(kind, hourCycle).every((type) => segments[type] !== undefined)) {
    return null;
  }
  const done = constrain(segments);
  const date = {
    year: done.year ?? 0,
    month: done.month ?? 0,
    day: done.day ?? 0,
  };
  const time = {
    hour: to24(done.hour ?? 0, done.dayPeriod, hourCycle),
    minute: done.minute ?? 0,
  };
  if (kind === 'date') return formatDay(date);
  if (kind === 'time') return formatTime(time);
  return formatDateTime({ ...date, ...time });
}

/** The parts of an ISO value; empty when the value is empty or not valid. */
export function fromValue(
  value: string | null | undefined,
  kind: FieldKind,
  hourCycle: HourCycle,
): Segments {
  const date = kind === 'time' ? null : parseDay(value?.slice(0, 10));
  const time =
    kind === 'date'
      ? null
      : parseTime(
          kind === 'time' ? value : parseDateTime(value) && value?.slice(11),
        );
  if (kind !== 'time' && !date) return {};
  if (kind !== 'date' && !time) return {};
  const out: Segments = { ...date };
  if (time) {
    out.minute = time.minute;
    if (hourCycle === 12) {
      out.hour = time.hour % 12 || 12;
      out.dayPeriod = time.hour >= 12 ? 1 : 0;
    } else out.hour = time.hour;
  }
  return out;
}

/**
 * Pasted text as parts, or null when it does not fit the field. ISO text
 * ("2026-12-04", "14:30", "2026-12-04T14:30"), or the numbers in the
 * field's own order, with any marks between ("4/12/2026", "2:30 PM" with
 * the day period's name). Every number must be in its part's range.
 */
export function fromPaste(
  text: string,
  order: readonly SegmentType[],
  kind: FieldKind,
  hourCycle: HourCycle,
  periods: readonly [string, string],
): Segments | null {
  const trimmed = text.trim();
  const iso = fromValue(trimmed, kind, hourCycle);
  if (Object.keys(iso).length > 0) return iso;
  const numeric = order.filter((type) => type !== 'dayPeriod');
  const numbers = trimmed.match(/\d+/g) ?? [];
  if (numbers.length !== numeric.length) return null;
  const out: Segments = {};
  numeric.forEach((type, at) => {
    out[type] = Number(numbers[at]);
  });
  if (order.includes('dayPeriod')) {
    const lower = trimmed.toLocaleLowerCase();
    const period = periods.findIndex(
      (name) => name !== '' && lower.includes(name.toLocaleLowerCase()),
    );
    if (period < 0) return null;
    out.dayPeriod = period;
  }
  const fits = numeric.every((type) => {
    const value = out[type] ?? Number.NaN;
    const { min, max } = limitsOf(type, out, hourCycle);
    return value >= min && value <= max;
  });
  return fits ? out : null;
}
