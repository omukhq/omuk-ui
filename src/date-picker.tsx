import { CalendarIcon, XIcon } from 'lucide-react';
import { type ReactNode, useId, useRef, useState } from 'react';
import { Button } from './button';
import { Calendar, type DateRange } from './calendar';
import {
  type CivilDateTime,
  compareDays,
  parseDateTime,
  parseDay,
  todayIn,
} from './date/civil';
import { DateSegments } from './date/field';
import {
  browserLocale,
  type FieldKind,
  type HourCycle,
  hourCycleOf,
} from './date/locale';
import { InputGroupButton } from './input-group';
import { PopupFrame, popupState, usePopupRoot } from './popup';
import { POP, SURFACE } from './recipes';
import { cn } from './utils';

// One date component (the date pickers plan): `mode` is `date` (a day, or
// with `granularity="minute"` a day and a time), `range` (a first and a
// last day) or `time`. The value is ISO text, and its type follows the
// mode. The field is React Aria's: the parts are typed, the arrows step
// them; the calendar button inside the field opens a Calendar.

export type { DateRange };

/** A shortcut beside the range calendar: "Last 7 days". */
export type DatePreset = { label: string; range: DateRange };

type PickerBase = {
  /** The language: the parts' order, names, 12 or 24 hours. Default: the browser's. */
  locale?: string;
  /** Where "today" is. Default: the browser's time zone. */
  timeZone?: string;
  /** The field's height: 36 for both (owner, 18 Nov 2026); kept for callers. */
  size?: 'default' | 'lg';
  isDisabled?: boolean;
  isReadOnly?: boolean;
  isRequired?: boolean;
  isInvalid?: boolean;
  hourCycle?: HourCycle;
  shouldForceLeadingZeros?: boolean;
  /** Where empty parts start on Up or Down: ISO text. Default: today, 00:00. */
  placeholderValue?: string;
  /** Shown in place of the empty parts until the field is used ("Updated"). */
  placeholder?: string;
  /** Inside the field, before the value ("Updated:"). */
  prefix?: ReactNode;
  /** A clear button while there is a value. */
  showClear?: boolean;
  'aria-label'?: string;
  id?: string;
  className?: string;
};

type CalendarOptions = {
  minValue?: string;
  maxValue?: string;
  isDateUnavailable?: (day: string) => boolean;
  /** Months side by side in the calendar. Default 1. */
  visibleMonths?: number;
  pageBehavior?: 'visible' | 'single';
  firstDayOfWeek?: number;
  isOpen?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  /** Close on a pick. Default: yes, except for a date with a time. */
  shouldCloseOnSelect?: boolean;
};

type DateModeProps = PickerBase &
  CalendarOptions & {
    mode?: 'date';
    /** `minute`: a day and a time ("2026-11-18T14:30"). */
    granularity?: 'day' | 'minute';
    value?: string | null;
    defaultValue?: string | null;
    onChange?: (value: string | null) => void;
    /** An error message for the value, or null when it is fine. */
    validate?: (value: string | null) => string | null;
    /** A hidden input with the ISO text, for a plain form. */
    name?: string;
  };

type RangeModeProps = PickerBase &
  CalendarOptions & {
    mode: 'range';
    value?: DateRange | null;
    defaultValue?: DateRange | null;
    onChange?: (value: DateRange | null) => void;
    validate?: (value: DateRange | null) => string | null;
    presets?: DatePreset[];
    startName?: string;
    endName?: string;
  };

type TimeModeProps = PickerBase & {
  mode: 'time';
  value?: string | null;
  defaultValue?: string | null;
  onChange?: (value: string | null) => void;
  validate?: (value: string | null) => string | null;
  name?: string;
};

export type DatePickerProps = DateModeProps | RangeModeProps | TimeModeProps;

export function DatePicker(props: DatePickerProps) {
  if (props.mode === 'range') return <RangePicker {...props} />;
  return <SinglePicker {...props} />;
}

// --- Shared ------------------------------------------------------------------

function placeholderOf(
  value: string | undefined,
  timeZone: string | undefined,
): CivilDateTime {
  const at = parseDateTime(value) ?? {
    ...(parseDay(value?.slice(0, 10)) ?? todayIn(timeZone)),
    hour: 0,
    minute: 0,
  };
  return at;
}

type ShellProps = {
  base: PickerBase;
  label: string;
  hasValue: boolean;
  /** Something typed, even when the value is not whole yet. */
  touched: boolean;
  error: string | null;
  onClear: () => void;
  root: ReturnType<typeof usePopupRoot> | null;
  fields: ReactNode;
  popup: ReactNode;
  hidden: ReactNode;
};

/** The field box, its buttons, the placeholder, the popup and the error. */
function PickerShell({
  base,
  label,
  hasValue,
  touched,
  error,
  onClear,
  root,
  fields,
  popup,
  hidden,
}: ShellProps) {
  const errorId = useId();
  const calendarButton = useRef<HTMLButtonElement | null>(null);
  const box = useRef<HTMLDivElement | null>(null);
  const [focusWithin, setFocusWithin] = useState(false);
  const disabled = base.isDisabled ?? false;
  const invalid = Boolean(base.isInvalid || error);
  const showPlaceholder =
    Boolean(base.placeholder) &&
    !hasValue &&
    !touched &&
    !focusWithin &&
    !root?.open;

  function focusFirstPart() {
    box.current?.querySelector<HTMLElement>('[data-segment]')?.focus();
  }

  return (
    <div className="inline-flex flex-col gap-1">
      <div
        ref={(node) => {
          box.current = node;
          if (node && root && root.trigger !== node) root.setTrigger(node);
        }}
        id={base.id}
        role="group"
        aria-label={label}
        aria-invalid={invalid || undefined}
        aria-describedby={error ? errorId : undefined}
        aria-disabled={disabled || undefined}
        data-slot="date-picker"
        data-size={base.size ?? 'lg'}
        className={cn(
          // A field's box (DESIGN.md, Field): the 2-wide edge, the focus ring
          // while a part has the focus, danger when invalid.
          'relative inline-flex w-fit max-w-full min-w-0 items-center gap-1 rounded-md bg-page pl-3 text-sm text-foreground transition-shadow',
          'inset-ring-2 inset-ring-control has-[[data-segment]:focus]:focus-ring aria-invalid:inset-ring-danger', // design-ok: selectors, not values
          'h-9',
          root ? 'pr-1' : 'pr-3',
          disabled && 'bg-hover text-muted inset-ring-border',
          base.className,
        )}
        onFocus={() => setFocusWithin(true)}
        onBlur={(event) => {
          if (!event.currentTarget.contains(event.relatedTarget)) {
            setFocusWithin(false);
          }
        }}
        onPointerDown={(event) => {
          // A press on the box (not a button, not a part) goes to the first part.
          const target = event.target;
          if (
            disabled ||
            !(target instanceof Element) ||
            target.closest('button,[data-segment]')
          ) {
            return;
          }
          event.preventDefault();
          focusFirstPart();
        }}
      >
        {base.prefix != null && (
          <span className="shrink-0 text-muted">{base.prefix}</span>
        )}
        {showPlaceholder && (
          <span aria-hidden className="truncate text-muted">
            {base.placeholder}
          </span>
        )}
        {/* While the placeholder shows, the parts stay in the tab order. */}
        <div
          className={cn(
            'flex min-w-0 items-center gap-1',
            showPlaceholder && 'sr-only',
          )}
        >
          {fields}
        </div>
        {/* The clear and the calendar buttons, side by side (24 each). */}
        <span className="ml-auto flex shrink-0 items-center">
          {base.showClear && hasValue && !disabled && !base.isReadOnly && (
            <InputGroupButton
              variant="ghost"
              size="icon-xs"
              aria-label={`Clear ${label}`}
              onClick={onClear}
            >
              <XIcon strokeWidth={1.5} />
            </InputGroupButton>
          )}
          {root && (
            <InputGroupButton
              ref={calendarButton}
              variant="ghost"
              size="icon-xs"
              aria-label="Open the calendar"
              aria-haspopup="dialog"
              aria-expanded={root.open}
              disabled={disabled || base.isReadOnly}
              onClick={(event) =>
                root.setOpen(!root.open, 'trigger-press', event)
              }
            >
              <CalendarIcon strokeWidth={1.5} />
            </InputGroupButton>
          )}
        </span>
        {hidden}
      </div>
      {error && (
        <p id={errorId} className="text-sm text-danger">
          {error}
        </p>
      )}
      {root && root.status !== 'closed' && (
        <PopupFrame
          root={root}
          kind="popover"
          placement={{
            side: 'bottom',
            align: 'start',
            sideOffset: 6,
            alignOffset: 0,
          }}
          className="isolate z-50"
          // The day takes the focus; its ring shows only when the calendar
          // was opened from the keyboard (React Aria's).
          initialFocus={(popupEl) =>
            popupEl
              .querySelector<HTMLElement>(
                '[data-slot=calendar] button[tabindex="0"]',
              )
              ?.focus({ focusVisible: root.how === 'keyboard' })
          }
          finalFocus={calendarButton}
          onDismiss={(reason, event) => {
            if (
              reason === 'outside-press' &&
              event.target instanceof Node &&
              box.current?.contains(event.target)
            ) {
              return;
            }
            root.setOpen(false, reason, event);
          }}
        >
          <div
            role="dialog"
            aria-label={label}
            {...popupState(root.open)}
            className={cn(SURFACE, POP, 'p-0')}
          >
            {popup}
          </div>
        </PopupFrame>
      )}
    </div>
  );
}

// --- One value: a day, a day and a time, or a time ----------------------------

function SinglePicker(props: DateModeProps | TimeModeProps) {
  const isTime = props.mode === 'time';
  const kind: FieldKind = isTime
    ? 'time'
    : props.granularity === 'minute'
      ? 'dateTime'
      : 'date';
  const locale = props.locale ?? browserLocale();
  const hourCycle = props.hourCycle ?? hourCycleOf(locale);
  const [own, setOwn] = useState(props.defaultValue ?? null);
  const value = props.value === undefined ? own : props.value;
  const [touched, setTouched] = useState(false);
  const dateProps = isTime ? null : props;
  const root = usePopupRoot({
    open: dateProps?.isOpen,
    defaultOpen: dateProps?.defaultOpen,
    onOpenChange: (open) => dateProps?.onOpenChange?.(open),
  });
  const placeholder = placeholderOf(props.placeholderValue, props.timeZone);
  const label =
    props['aria-label'] ??
    (isTime ? 'Time' : kind === 'dateTime' ? 'Date and time' : 'Date');

  function set(next: string | null) {
    setOwn(next);
    props.onChange?.(next);
  }

  function pickDay(day: string) {
    if (kind === 'date') {
      set(day);
    } else {
      // Keep the time typed so far; else the placeholder's.
      const time = parseDateTime(value);
      const hour = String(time?.hour ?? placeholder.hour).padStart(2, '0');
      const minute = String(time?.minute ?? placeholder.minute).padStart(
        2,
        '0',
      );
      set(`${day}T${hour}:${minute}`);
    }
    const close = dateProps?.shouldCloseOnSelect ?? kind === 'date';
    if (close) root.setOpen(false, 'item-press');
  }

  const error = props.validate?.(value) ?? null;

  return (
    <PickerShell
      base={props}
      label={label}
      hasValue={value !== null}
      touched={touched}
      error={error}
      root={isTime ? null : root}
      onClear={() => {
        set(null);
        setTouched(false);
      }}
      fields={
        <DateSegments
          kind={kind}
          value={value}
          onChange={(next) => {
            setTouched(true);
            set(next);
          }}
          locale={locale}
          hourCycle={hourCycle}
          placeholder={placeholder}
          label={label}
          disabled={props.isDisabled}
          readOnly={props.isReadOnly}
          invalid={Boolean(props.isInvalid || error)}
          forceLeadingZeros={props.shouldForceLeadingZeros}
        />
      }
      popup={
        dateProps && (
          <Calendar
            locale={locale}
            timeZone={props.timeZone}
            value={value?.slice(0, 10) ?? null}
            onChange={pickDay}
            minValue={dateProps.minValue}
            maxValue={dateProps.maxValue}
            isDateUnavailable={dateProps.isDateUnavailable}
            visibleMonths={dateProps.visibleMonths}
            pageBehavior={dateProps.pageBehavior}
            firstDayOfWeek={dateProps.firstDayOfWeek}
          />
        )
      }
      hidden={
        props.name && (
          <input
            type="hidden"
            name={props.name}
            value={value ?? ''}
            required={props.isRequired}
          />
        )
      }
    />
  );
}

// --- A range: a first day and a last day ------------------------------------

function sameRange(
  a: DateRange | null | undefined,
  b: DateRange | null | undefined,
) {
  if (a === undefined || b === undefined) return false;
  return a?.start === b?.start && a?.end === b?.end;
}

function RangePicker(props: RangeModeProps) {
  const locale = props.locale ?? browserLocale();
  const hourCycle = props.hourCycle ?? hourCycleOf(locale);
  const [own, setOwn] = useState(props.defaultValue ?? null);
  const value = props.value === undefined ? own : props.value;
  // Each end as typed: a range is whole only when both are.
  const [draft, setDraft] = useState<{
    start: string | null;
    end: string | null;
  }>({ start: value?.start ?? null, end: value?.end ?? null });
  // The value changed from outside ("Clear all", a link): show it. Our own
  // change (a null for a half-typed or backwards range) keeps the typing.
  const emitted = useRef<DateRange | null | undefined>(undefined);
  const [seen, setSeen] = useState(value);
  if (value !== seen) {
    setSeen(value);
    if (!sameRange(value, emitted.current)) {
      setDraft({ start: value?.start ?? null, end: value?.end ?? null });
    }
  }
  const root = usePopupRoot({
    open: props.isOpen,
    defaultOpen: props.defaultOpen,
    onOpenChange: (open) => props.onOpenChange?.(open),
  });
  const placeholder = placeholderOf(props.placeholderValue, props.timeZone);
  const label = props['aria-label'] ?? 'Dates';

  function set(next: DateRange | null) {
    emitted.current = next;
    setOwn(next);
    props.onChange?.(next);
  }

  function typed(end: 'start' | 'end', day: string | null) {
    const next = { ...draft, [end]: day };
    const start = parseDay(next.start);
    const last = parseDay(next.end);
    setDraft(next);
    // Typed backwards (the end before the start): no value, and the field
    // is invalid until it is put right (React Aria's). A calendar pick is
    // put in order instead.
    if (start && last && compareDays(start, last) <= 0) {
      set({ start: next.start ?? '', end: next.end ?? '' });
    } else if (value) set(null);
  }

  function pick(range: DateRange) {
    setDraft(range);
    set(range);
    if (props.shouldCloseOnSelect ?? true) root.setOpen(false, 'item-press');
  }

  const typedStart = parseDay(draft.start);
  const typedEnd = parseDay(draft.end);
  const backwards = Boolean(
    typedStart && typedEnd && compareDays(typedStart, typedEnd) > 0,
  );
  const error = props.validate?.(value) ?? null;
  const field = (end: 'start' | 'end') => (
    <DateSegments
      kind="date"
      value={draft[end]}
      onChange={(day) => typed(end, day)}
      locale={locale}
      hourCycle={hourCycle}
      placeholder={placeholder}
      label={end === 'start' ? 'Start date' : 'End date'}
      disabled={props.isDisabled}
      readOnly={props.isReadOnly}
      invalid={Boolean(props.isInvalid || error || backwards)}
      forceLeadingZeros={props.shouldForceLeadingZeros}
    />
  );

  return (
    <PickerShell
      base={{ ...props, isInvalid: props.isInvalid || backwards }}
      label={label}
      hasValue={value !== null}
      touched={draft.start !== null || draft.end !== null}
      error={error}
      root={root}
      onClear={() => {
        setDraft({ start: null, end: null });
        set(null);
      }}
      fields={
        <>
          {field('start')}
          <span aria-hidden className="text-muted">
            –
          </span>
          {field('end')}
        </>
      }
      popup={
        <div className="flex">
          {props.presets && props.presets.length > 0 && (
            <ul className="flex flex-col gap-0.5 border-r p-2">
              {props.presets.map((preset) => (
                <li key={preset.label}>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="w-full justify-start font-normal"
                    onClick={() => pick(preset.range)}
                  >
                    {preset.label}
                  </Button>
                </li>
              ))}
            </ul>
          )}
          <Calendar
            mode="range"
            locale={locale}
            timeZone={props.timeZone}
            value={value}
            onChange={pick}
            minValue={props.minValue}
            maxValue={props.maxValue}
            isDateUnavailable={props.isDateUnavailable}
            visibleMonths={props.visibleMonths}
            pageBehavior={props.pageBehavior}
            firstDayOfWeek={props.firstDayOfWeek}
          />
        </div>
      }
      hidden={
        <>
          {props.startName && (
            <input
              type="hidden"
              name={props.startName}
              value={value?.start ?? ''}
            />
          )}
          {props.endName && (
            <input
              type="hidden"
              name={props.endName}
              value={value?.end ?? ''}
            />
          )}
        </>
      }
    />
  );
}
