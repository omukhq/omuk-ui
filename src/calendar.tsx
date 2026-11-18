import { ChevronLeftIcon, ChevronRightIcon } from 'lucide-react';
import { type KeyboardEvent, useRef, useState } from 'react';
import { Button } from './button';
import {
  addDays,
  addMonths,
  type CivilDate,
  clampDay,
  compareDays,
  endOfWeek,
  formatDay,
  isSameDay,
  isSameMonth,
  monthWeeks,
  parseDay,
  startOfMonth,
  startOfWeek,
  todayIn,
} from './date/civil';
import {
  browserLocale,
  firstDayOfWeek as firstDayOf,
  formatNumber,
  fullDate,
  monthYear,
  weekdayNames,
} from './date/locale';
import { cn } from './utils';

// A month grid to choose a day, or a first and a last day (React Aria's
// Calendar and RangeCalendar). Values are ISO days: "2026-11-18". The arrow
// keys move a day or a week, Page Up and Page Down a month (with Shift, a
// year), Home and End to the week's ends; Enter or Space chooses.

export type DateRange = { start: string; end: string };

type CalendarBase = {
  /** The language: names, order, first day of the week. Default: the browser's. */
  locale?: string;
  /** Where "today" is. Default: the browser's time zone. */
  timeZone?: string;
  minValue?: string;
  maxValue?: string;
  /** A day that cannot be chosen (a holiday, a full day). */
  isDateUnavailable?: (day: string) => boolean;
  /** Months side by side. Default 1. */
  visibleMonths?: number;
  /** "Next" moves all the visible months (`visible`, default) or one (`single`). */
  pageBehavior?: 'visible' | 'single';
  /** 0 (Sunday) to 6 (Saturday). Default: the language's. */
  firstDayOfWeek?: number;
  isDisabled?: boolean;
  isReadOnly?: boolean;
  /** Puts the focus on the chosen day (or today) when it appears. */
  autoFocus?: boolean;
  className?: string;
  'aria-label'?: string;
};

export type CalendarProps =
  | (CalendarBase & {
      mode?: 'single';
      value?: string | null;
      defaultValue?: string | null;
      onChange?: (value: string) => void;
    })
  | (CalendarBase & {
      mode: 'range';
      value?: DateRange | null;
      defaultValue?: DateRange | null;
      onChange?: (value: DateRange) => void;
    });

function ordered(a: CivilDate, b: CivilDate): [CivilDate, CivilDate] {
  return compareDays(a, b) <= 0 ? [a, b] : [b, a];
}

export function Calendar(props: CalendarProps) {
  const {
    locale = browserLocale(),
    timeZone,
    minValue,
    maxValue,
    isDateUnavailable,
    visibleMonths = 1,
    pageBehavior = 'visible',
    isDisabled = false,
    isReadOnly = false,
    autoFocus = false,
    className,
  } = props;
  const firstDay = props.firstDayOfWeek ?? firstDayOf(locale);
  const min = parseDay(minValue);
  const max = parseDay(maxValue);
  const today = todayIn(timeZone);

  // The chosen day or range: the caller's, or our own when not controlled.
  const [ownSingle, setOwnSingle] = useState(
    props.mode === 'range' ? null : (props.defaultValue ?? null),
  );
  const [ownRange, setOwnRange] = useState(
    props.mode === 'range' ? (props.defaultValue ?? null) : null,
  );
  const single =
    props.mode === 'range'
      ? null
      : parseDay(props.value === undefined ? ownSingle : props.value);
  const rangeValue =
    props.mode === 'range'
      ? props.value === undefined
        ? ownRange
        : props.value
      : null;
  const rangeStart = parseDay(rangeValue?.start);
  const rangeEnd = parseDay(rangeValue?.end);

  const [focused, setFocused] = useState(() =>
    clampDay(single ?? rangeStart ?? today, min, max),
  );
  const [first, setFirst] = useState(() => startOfMonth(focused));
  // The first click of a range, until the second.
  const [anchor, setAnchor] = useState<CivilDate | null>(null);
  const [hovered, setHovered] = useState<CivilDate | null>(null);
  // Set when a key moved the focus: the day's button takes it on render.
  const focusPending = useRef(autoFocus);

  const months = Array.from({ length: visibleMonths }, (_, at) =>
    addMonths(first, at),
  );
  const lastShown = months[months.length - 1];
  const page = pageBehavior === 'single' ? 1 : visibleMonths;

  function isUnavailable(day: CivilDate) {
    return (
      (min !== null && compareDays(day, min) < 0) ||
      (max !== null && compareDays(day, max) > 0) ||
      Boolean(isDateUnavailable?.(formatDay(day)))
    );
  }

  /** Moves the focus to a day, and the months with it when it leaves them. */
  function focusDay(day: CivilDate) {
    const next = clampDay(day, min, max);
    setFocused(next);
    focusPending.current = true;
    if (compareDays(next, first) < 0) setFirst(startOfMonth(next));
    else if (compareDays(next, addMonths(lastShown, 1)) >= 0) {
      setFirst(addMonths(startOfMonth(next), -(visibleMonths - 1)));
    }
    if (anchor) setHovered(next);
  }

  function choose(day: CivilDate) {
    if (isDisabled || isReadOnly || isUnavailable(day)) return;
    setFocused(day);
    if (props.mode !== 'range') {
      setOwnSingle(formatDay(day));
      props.onChange?.(formatDay(day));
      return;
    }
    if (!anchor) {
      setAnchor(day);
      setHovered(day);
      return;
    }
    const [start, end] = ordered(anchor, day);
    const next = { start: formatDay(start), end: formatDay(end) };
    setAnchor(null);
    setHovered(null);
    setOwnRange(next);
    props.onChange?.(next);
  }

  function onKeyDown(event: KeyboardEvent<HTMLButtonElement>) {
    const moves: Record<string, () => CivilDate> = {
      ArrowLeft: () => addDays(focused, -1),
      ArrowRight: () => addDays(focused, 1),
      ArrowUp: () => addDays(focused, -7),
      ArrowDown: () => addDays(focused, 7),
      PageUp: () => addMonths(focused, event.shiftKey ? -12 : -1),
      PageDown: () => addMonths(focused, event.shiftKey ? 12 : 1),
      Home: () => startOfWeek(focused, firstDay),
      End: () => endOfWeek(focused, firstDay),
    };
    const move = moves[event.key];
    if (move) {
      event.preventDefault();
      focusDay(move());
    } else if (event.key === 'Escape' && anchor) {
      // A range half chosen: Escape lets it go (the popup stays open).
      event.preventDefault();
      event.stopPropagation();
      setAnchor(null);
      setHovered(null);
    }
  }

  function turn(step: number) {
    setFirst(addMonths(first, step));
    setFocused(clampDay(addMonths(focused, step), min, max));
  }

  // The days to fill: the chosen range, or the one being chosen.
  const [bandStart, bandEnd] = anchor
    ? ordered(anchor, hovered ?? anchor)
    : rangeStart && rangeEnd
      ? [rangeStart, rangeEnd]
      : [null, null];
  const weekdays = weekdayNames(locale, 'short');
  const longWeekdays = weekdayNames(locale, 'long');
  const order = Array.from({ length: 7 }, (_, at) => (firstDay + at) % 7);
  const canGoBack =
    !min || compareDays(startOfMonth(first), startOfMonth(min)) > 0;
  const canGoOn =
    !max || compareDays(startOfMonth(lastShown), startOfMonth(max)) < 0;

  return (
    <section
      data-slot="calendar"
      aria-label={
        props['aria-label'] ??
        months.map((m) => monthYear(locale, m)).join(' – ')
      }
      className={cn('flex gap-4 p-2', className)}
    >
      {/* Read out when the months change. */}
      <p aria-live="polite" className="sr-only">
        {months.map((m) => monthYear(locale, m)).join(' – ')}
      </p>
      {months.map((month, monthAt) => (
        <div key={formatDay(month)} className="flex flex-col gap-2">
          <header className="flex h-8 items-center justify-between gap-2">
            {monthAt === 0 ? (
              <Button
                variant="ghost"
                size="icon"
                aria-label="Previous"
                disabled={!canGoBack || isDisabled}
                onClick={() => turn(-page)}
              >
                <ChevronLeftIcon strokeWidth={1.5} />
              </Button>
            ) : (
              <span className="size-8" />
            )}
            <h2 className="text-sm font-medium">{monthYear(locale, month)}</h2>
            {monthAt === months.length - 1 ? (
              <Button
                variant="ghost"
                size="icon"
                aria-label="Next"
                disabled={!canGoOn || isDisabled}
                onClick={() => turn(page)}
              >
                <ChevronRightIcon strokeWidth={1.5} />
              </Button>
            ) : (
              <span className="size-8" />
            )}
          </header>
          <table
            // biome-ignore lint/a11y/noNoninteractiveElementToInteractiveRole: the WAI-ARIA date grid (APG's date picker, React Aria): a table with the grid role.
            role="grid"
            aria-label={monthYear(locale, month)}
            aria-disabled={isDisabled || undefined}
            aria-readonly={isReadOnly || undefined}
            aria-multiselectable={props.mode === 'range' || undefined}
            className="border-collapse"
            onPointerLeave={() => anchor && setHovered(null)}
          >
            <thead>
              <tr>
                {order.map((weekday) => (
                  <th
                    key={weekday}
                    scope="col"
                    abbr={longWeekdays[weekday]}
                    className="size-8 p-0 text-xs font-normal text-muted"
                  >
                    {weekdays[weekday]}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {monthWeeks(month, firstDay).map((week) => (
                <tr key={formatDay(week[0])}>
                  {week.map((day) => {
                    if (!isSameMonth(day, month)) {
                      return <td key={formatDay(day)} className="p-0" />;
                    }
                    const unavailable = isUnavailable(day);
                    const selected =
                      isSameDay(day, single) ||
                      (bandStart !== null &&
                        bandEnd !== null &&
                        compareDays(day, bandStart) >= 0 &&
                        compareDays(day, bandEnd) <= 0);
                    const isStart = isSameDay(day, bandStart);
                    const isEnd = isSameDay(day, bandEnd);
                    const isPoint = isSameDay(day, single) || isStart || isEnd;
                    const isToday = isSameDay(day, today);
                    const isFocused = isSameDay(day, focused);
                    return (
                      // biome-ignore lint/a11y/useFocusableInteractive: a date grid's cell; the day's button inside takes the focus (APG).
                      <td
                        key={formatDay(day)}
                        // biome-ignore lint/a11y/noNoninteractiveElementToInteractiveRole: a date grid's cell; the day's button inside takes the focus (APG).
                        role="gridcell"
                        aria-selected={selected || undefined}
                        aria-disabled={unavailable || isDisabled || undefined}
                        className="p-0"
                      >
                        <button
                          type="button"
                          ref={(node) => {
                            if (node && isFocused && focusPending.current) {
                              focusPending.current = false;
                              node.focus();
                            }
                          }}
                          tabIndex={isFocused ? 0 : -1}
                          disabled={isDisabled}
                          aria-disabled={unavailable || undefined}
                          aria-label={`${isToday ? 'Today, ' : ''}${fullDate(locale, day)}${selected ? ', selected' : ''}`}
                          data-today={isToday ? '' : undefined}
                          data-selected={isPoint ? '' : undefined}
                          data-in-range={selected && !isPoint ? '' : undefined}
                          data-unavailable={unavailable ? '' : undefined}
                          className={cn(
                            'flex size-8 items-center justify-center rounded-md text-sm text-foreground tabular-nums outline-none hover:bg-hover focus-visible:focus-ring',
                            'data-today:inset-ring-2 data-today:inset-ring-control',
                            'data-in-range:rounded-none data-in-range:bg-selected',
                            'data-selected:bg-primary data-selected:text-on-primary data-selected:hover:bg-primary',
                            isStart && !isEnd && 'rounded-r-none',
                            isEnd && !isStart && 'rounded-l-none',
                            'data-unavailable:cursor-not-allowed data-unavailable:text-muted data-unavailable:line-through data-unavailable:hover:bg-transparent',
                            'disabled:cursor-not-allowed disabled:text-muted',
                          )}
                          onClick={() => choose(day)}
                          onKeyDown={onKeyDown}
                          onPointerEnter={() => anchor && setHovered(day)}
                          onFocus={() => {
                            if (!isFocused) setFocused(day);
                          }}
                        >
                          {formatNumber(locale, day.day)}
                        </button>
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ))}
    </section>
  );
}
