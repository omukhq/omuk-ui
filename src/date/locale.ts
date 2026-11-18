// What a language says about dates, from the browser's Intl (no package):
// the order of a field's parts and the text between them, the month and
// weekday names, the first day of the week, 12 or 24 hours, and the digits.

import type { CivilDate } from './civil';

export const SEGMENT_TYPES = [
  'day',
  'month',
  'year',
  'hour',
  'minute',
  'dayPeriod',
] as const;
export type SegmentType = (typeof SEGMENT_TYPES)[number];

/** One part of a field, or the text between two parts. */
export type FieldPart =
  | { type: SegmentType }
  | { type: 'literal'; text: string };

export type HourCycle = 12 | 24;

/** Which parts a field has: a date, a date and a time, or a time. */
export type FieldKind = 'date' | 'dateTime' | 'time';

/** 2026-01-23 14:05: every part has its own digits, so each is found. */
const SAMPLE = new Date(Date.UTC(2026, 0, 23, 14, 5));

/** The language's hours: 12 (with AM/PM) or 24. */
export function hourCycleOf(locale: string): HourCycle {
  const cycle = new Intl.DateTimeFormat(locale, {
    hour: 'numeric',
  }).resolvedOptions().hourCycle;
  return cycle === 'h11' || cycle === 'h12' ? 12 : 24;
}

/** The field's parts, in the language's order, with its separators. */
export function fieldParts(
  locale: string,
  kind: FieldKind,
  hourCycle: HourCycle = hourCycleOf(locale),
): FieldPart[] {
  const parts = new Intl.DateTimeFormat(locale, {
    timeZone: 'UTC',
    ...(kind !== 'time' && {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    }),
    ...(kind !== 'date' && {
      hour: '2-digit',
      minute: '2-digit',
      hourCycle: hourCycle === 12 ? 'h12' : 'h23',
    }),
  }).formatToParts(SAMPLE);
  const out: FieldPart[] = [];
  for (const part of parts) {
    if (isSegmentType(part.type)) out.push({ type: part.type });
    else if (part.type === 'literal') {
      // Some languages put a comma or a word between the date and the
      // time; the field keeps it. Direction marks are left out.
      const text = part.value.replace(/[‎‏؜]/g, '');
      if (text) out.push({ type: 'literal', text });
    }
  }
  return out;
}

function isSegmentType(type: string): type is SegmentType {
  return (SEGMENT_TYPES as readonly string[]).includes(type);
}

/** January … December, as the language writes them (`long` or `short`). */
export function monthNames(
  locale: string,
  width: 'long' | 'short' = 'long',
): string[] {
  const format = new Intl.DateTimeFormat(locale, {
    month: width,
    timeZone: 'UTC',
  });
  return Array.from({ length: 12 }, (_, at) =>
    format.format(new Date(Date.UTC(2026, at, 1))),
  );
}

/** Sunday … Saturday (index 0 is Sunday), as the language writes them. */
export function weekdayNames(
  locale: string,
  width: 'long' | 'short' | 'narrow' = 'short',
): string[] {
  const format = new Intl.DateTimeFormat(locale, {
    weekday: width,
    timeZone: 'UTC',
  });
  // 2026-01-04 is a Sunday.
  return Array.from({ length: 7 }, (_, at) =>
    format.format(new Date(Date.UTC(2026, 0, 4 + at))),
  );
}

/** "AM" and "PM", as the language writes them. */
export function dayPeriodNames(locale: string): [string, string] {
  const format = new Intl.DateTimeFormat(locale, {
    hour: 'numeric',
    hourCycle: 'h12',
    timeZone: 'UTC',
  });
  const periodAt = (hour: number) =>
    format
      .formatToParts(new Date(Date.UTC(2026, 0, 1, hour)))
      .find((part) => part.type === 'dayPeriod')?.value ?? '';
  return [periodAt(9) || 'AM', periodAt(21) || 'PM'];
}

// Regions whose week starts on Sunday (0) or Saturday (6), for browsers
// without Intl.Locale's week info (Firefox). Every other region: Monday.
const SUNDAY_REGIONS = new Set(
  'AG AS BD BR BS BT BW BZ CA CN CO DM DO ET GT GU HK HN ID IL IN JM JP KE KH KR LA MH MM MO MT MX MZ NI NP PA PE PH PK PR PT PY SA SG SV TH TT TW UM US VE VI WS YE ZA ZW'.split(
    ' ',
  ),
);
const SATURDAY_REGIONS = new Set(
  'AE AF BH DJ DZ EG IQ IR JO KW LY OM QA SD SY'.split(' '),
);

type WeekInfo = { firstDay: number };
type LocaleWithWeek = Intl.Locale & {
  getWeekInfo?: () => WeekInfo;
  weekInfo?: WeekInfo;
};

/** The language's first day of the week: 0 (Sunday) to 6 (Saturday). */
export function firstDayOfWeek(locale: string): number {
  const full: LocaleWithWeek = new Intl.Locale(locale).maximize();
  const info = full.getWeekInfo?.() ?? full.weekInfo;
  // Intl numbers the days 1 (Monday) to 7 (Sunday).
  if (info) return info.firstDay % 7;
  const region = full.region ?? '';
  if (SUNDAY_REGIONS.has(region)) return 0;
  if (SATURDAY_REGIONS.has(region)) return 6;
  return 1;
}

/** The language's digits, 0 to 9 ("٠" … "٩" in Arabic, for example). */
export function digitsOf(locale: string): string[] {
  const format = new Intl.NumberFormat(locale, { useGrouping: false });
  return Array.from({ length: 10 }, (_, digit) => format.format(digit));
}

/** A number in the language's digits, with leading zeros to `size`. */
export function formatNumber(locale: string, value: number, size = 1): string {
  return new Intl.NumberFormat(locale, {
    useGrouping: false,
    minimumIntegerDigits: size,
  }).format(value);
}

/** A typed key as a digit 0–9: ASCII, or the language's own digits. */
export function digitOf(key: string, locale: string): number | null {
  if (/^[0-9]$/.test(key)) return Number(key);
  const at = digitsOf(locale).indexOf(key);
  return at >= 0 ? at : null;
}

/** The date at midnight UTC: years before 100 too (Date.UTC moves those). */
function utc({ year, month, day }: CivilDate): Date {
  const at = new Date(0);
  at.setUTCFullYear(year, month - 1, day);
  return at;
}

/** "Wednesday, 18 November 2026": a day's full name, for screen readers. */
export function fullDate(locale: string, date: CivilDate): string {
  return new Intl.DateTimeFormat(locale, {
    dateStyle: 'full',
    timeZone: 'UTC',
  }).format(utc(date));
}

/** "November 2026": a calendar's heading. */
export function monthYear(locale: string, date: CivilDate): string {
  return new Intl.DateTimeFormat(locale, {
    month: 'long',
    year: 'numeric',
    timeZone: 'UTC',
  }).format(utc({ ...date, day: 1 }));
}

/** "18/11/2026": a day in the language's short form. */
export function shortDate(locale: string, date: CivilDate): string {
  return new Intl.DateTimeFormat(locale, {
    dateStyle: 'short',
    timeZone: 'UTC',
  }).format(utc(date));
}

/** The browser's language. */
export function browserLocale(): string {
  return new Intl.DateTimeFormat().resolvedOptions().locale;
}
