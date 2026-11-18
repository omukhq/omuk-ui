// Civil dates and times (docs: the date pickers plan): a day and a time of
// day with no time zone, so a day never moves. The picker's values are ISO
// text: "2026-11-18", "2026-11-18T14:30", "14:30". The Gregorian calendar
// only. Months are 1 to 12; weekdays are 0 (Sunday) to 6.

export type CivilDate = { year: number; month: number; day: number };
export type CivilTime = { hour: number; minute: number };
export type CivilDateTime = CivilDate & CivilTime;

const DAY_TEXT = /^(\d{4})-(\d{2})-(\d{2})$/;
const TIME_TEXT = /^(\d{2}):(\d{2})$/;
const DATE_TIME_TEXT = /^(\d{4}-\d{2}-\d{2})T(\d{2}:\d{2})$/;

const pad = (value: number, size = 2) => String(value).padStart(size, '0');

export function isLeapYear(year: number): boolean {
  return (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
}

export function daysInMonth(year: number, month: number): number {
  if (month === 2) return isLeapYear(year) ? 29 : 28;
  return [4, 6, 9, 11].includes(month) ? 30 : 31;
}

export function isValidDate({ year, month, day }: CivilDate): boolean {
  return (
    Number.isInteger(year) &&
    year >= 1 &&
    year <= 9999 &&
    Number.isInteger(month) &&
    month >= 1 &&
    month <= 12 &&
    Number.isInteger(day) &&
    day >= 1 &&
    day <= daysInMonth(year, month)
  );
}

export function isValidTime({ hour, minute }: CivilTime): boolean {
  return (
    Number.isInteger(hour) &&
    hour >= 0 &&
    hour <= 23 &&
    Number.isInteger(minute) &&
    minute >= 0 &&
    minute <= 59
  );
}

/** "2026-11-18" → the date; null when it is not a real day. */
export function parseDay(text: string | null | undefined): CivilDate | null {
  const match = text ? DAY_TEXT.exec(text) : null;
  if (!match) return null;
  const date = {
    year: Number(match[1]),
    month: Number(match[2]),
    day: Number(match[3]),
  };
  return isValidDate(date) ? date : null;
}

export function formatDay({ year, month, day }: CivilDate): string {
  return `${pad(year, 4)}-${pad(month)}-${pad(day)}`;
}

/** "14:30" → the time; null when it is not a real time. */
export function parseTime(text: string | null | undefined): CivilTime | null {
  const match = text ? TIME_TEXT.exec(text) : null;
  if (!match) return null;
  const time = { hour: Number(match[1]), minute: Number(match[2]) };
  return isValidTime(time) ? time : null;
}

export function formatTime({ hour, minute }: CivilTime): string {
  return `${pad(hour)}:${pad(minute)}`;
}

/** "2026-11-18T14:30" → the date and time; null when either is not real. */
export function parseDateTime(
  text: string | null | undefined,
): CivilDateTime | null {
  const match = text ? DATE_TIME_TEXT.exec(text) : null;
  if (!match) return null;
  const date = parseDay(match[1]);
  const time = parseTime(match[2]);
  return date && time ? { ...date, ...time } : null;
}

export function formatDateTime(value: CivilDateTime): string {
  return `${formatDay(value)}T${formatTime(value)}`;
}

/** Days since 1970-01-01: the date math works on this number. */
function toEpochDay({ year, month, day }: CivilDate): number {
  const at = new Date(0);
  at.setUTCFullYear(year, month - 1, day);
  return Math.round(at.getTime() / 86_400_000);
}

function fromEpochDay(days: number): CivilDate {
  const at = new Date(days * 86_400_000);
  return {
    year: at.getUTCFullYear(),
    month: at.getUTCMonth() + 1,
    day: at.getUTCDate(),
  };
}

export function addDays(date: CivilDate, days: number): CivilDate {
  return fromEpochDay(toEpochDay(date) + days);
}

/** Months later (or earlier); the day stays, or goes to the month's last. */
export function addMonths(date: CivilDate, months: number): CivilDate {
  const index = date.year * 12 + (date.month - 1) + months;
  const year = Math.floor(index / 12);
  const month = (index % 12) + 1;
  return { year, month, day: Math.min(date.day, daysInMonth(year, month)) };
}

export function addYears(date: CivilDate, years: number): CivilDate {
  return addMonths(date, years * 12);
}

/** Negative when a is before b, 0 on the same day, positive after. */
export function compareDays(a: CivilDate, b: CivilDate): number {
  return toEpochDay(a) - toEpochDay(b);
}

export function isSameDay(a: CivilDate | null, b: CivilDate | null): boolean {
  return a !== null && b !== null && compareDays(a, b) === 0;
}

export function isSameMonth(a: CivilDate, b: CivilDate): boolean {
  return a.year === b.year && a.month === b.month;
}

/** 0 (Sunday) to 6 (Saturday). */
export function dayOfWeek(date: CivilDate): number {
  // 1970-01-01 was a Thursday (4).
  return (((toEpochDay(date) + 4) % 7) + 7) % 7;
}

export function startOfMonth(date: CivilDate): CivilDate {
  return { ...date, day: 1 };
}

export function endOfMonth(date: CivilDate): CivilDate {
  return { ...date, day: daysInMonth(date.year, date.month) };
}

/** The first day of the date's week, for a week that starts on `firstDay`. */
export function startOfWeek(date: CivilDate, firstDay: number): CivilDate {
  return addDays(date, -((dayOfWeek(date) - firstDay + 7) % 7));
}

export function endOfWeek(date: CivilDate, firstDay: number): CivilDate {
  return addDays(startOfWeek(date, firstDay), 6);
}

/** The date in [min, max]; either bound may be missing. */
export function clampDay(
  date: CivilDate,
  min: CivilDate | null,
  max: CivilDate | null,
): CivilDate {
  if (min && compareDays(date, min) < 0) return min;
  if (max && compareDays(date, max) > 0) return max;
  return date;
}

/** Today in a time zone (default: the browser's). */
export function todayIn(timeZone?: string, now = new Date()): CivilDate {
  const parts = new Intl.DateTimeFormat('en-US', {
    timeZone,
    year: 'numeric',
    month: 'numeric',
    day: 'numeric',
  }).formatToParts(now);
  const part = (type: Intl.DateTimeFormatPartTypes) =>
    Number(parts.find((each) => each.type === type)?.value);
  return { year: part('year'), month: part('month'), day: part('day') };
}

/** The weeks that show a month: each is 7 dates, some outside the month. */
export function monthWeeks(month: CivilDate, firstDay: number): CivilDate[][] {
  const first = startOfWeek(startOfMonth(month), firstDay);
  const last = endOfWeek(endOfMonth(month), firstDay);
  const weeks: CivilDate[][] = [];
  for (let at = first; compareDays(at, last) <= 0; at = addDays(at, 7)) {
    weeks.push(Array.from({ length: 7 }, (_, index) => addDays(at, index)));
  }
  return weeks;
}
