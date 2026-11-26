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
import { useDateLocale } from './date/hydration';
import { type FieldKind, type HourCycle, hourCycleOf } from './date/locale';
import { useFieldControl } from './field-context';
import { FormValue } from './form-value';
import { InputGroupButton } from './input-group';
import { PopupFrame, popupState, usePopupRoot } from './popup';
import { FIELD_SIZE, type FieldSize, POP, SURFACE } from './recipes';
import { cn } from './utils';

// One date component (the date pickers plan): `mode` is `date` (a day, or
// with `granularity="minute"` a day and a time), `range` (a first and a
// last day) or `time`. The value is ISO text, and its type follows the
// mode. The field is React Aria's: the parts are typed, the arrows step
// them; the calendar button inside the field opens a Calendar.

/** Today, safe in pre-rendered HTML (null until the page hydrates). */
export { useToday } from './date/hydration';
export type { DateRange };

/**
 * The picker's first typed part, next to its form value: where the focus
 * goes when the form reports that a required date is empty.
 */
function firstPart(input: HTMLInputElement) {
  return input.parentElement?.querySelector<HTMLElement>('[data-segment]');
}

/** A shortcut beside the range calendar: "Last 7 days". */
export type DatePreset = { label: string; range: DateRange };

type PickerBase = {
  /** The language: the parts' order, names, 12 or 24 hours. Default: the browser's. */
  locale?: string;
  /** Where "today" is. Default: the browser's time zone. */
  timeZone?: string;
  /** The height, as Button's: xs 24, sm 28, md 32 (default), lg 36. */
  size?: FieldSize;
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
  /**
   * Which edge the calendar lines up with: the field's left (`start`, the
   * default) or its right (`end`, for a field near the right edge).
   */
  align?: 'start' | 'end';
  'aria-label'?: string;
  /** The id of the visible text that names it. A `<label for={id}>` works too. */
  'aria-labelledby'?: string;
  id?: string;
  /**
   * On the picker's outer box. It fills the width it gets, like Input; pass
   * a width to narrow it (`w-fit` sizes it to its value, as in a toolbar).
   */
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
  // A part has the focus (someone types). Not the calendar button, and not
  // the open calendar: those keep the placeholder, so the field does not
  // grow and shove its neighbours when the calendar opens (owner, 18 Nov
  // 2026).
  const [typing, setTyping] = useState(false);
  const disabled = base.isDisabled ?? false;
  const invalid = Boolean(base.isInvalid || error);
  const showPlaceholder =
    Boolean(base.placeholder) && !hasValue && !touched && !typing;

  function focusFirstPart() {
    box.current?.querySelector<HTMLElement>('[data-segment]')?.focus();
  }

  // A visible `<label for={id}>` (FieldLabel): a label names only an input
  // or a button, not this group, so the group points at it, and a press on
  // it goes to the first part, as a label's does. Found from the box's ref.
  const [labelId, setLabelId] = useState<string | undefined>();
  const labelledBy = base['aria-labelledby'] ?? labelId;

  /** Links the label for `id`, if there is one; returns the unlink. */
  function linkLabel(node: HTMLElement) {
    const id = base.id;
    if (!id) return;
    const text = node.ownerDocument.querySelector<HTMLLabelElement>(
      `label[for="${CSS.escape(id)}"]`,
    );
    if (!text) return;
    if (!text.id) text.id = `${id}-label`;
    if (labelId !== text.id) setLabelId(text.id);
    text.addEventListener('click', focusFirstPart);
    return () => text.removeEventListener('click', focusFirstPart);
  }
  const control = useFieldControl({
    'aria-describedby': error ? errorId : undefined,
    'aria-invalid': invalid || undefined,
  });

  return (
    <div className={cn('flex w-full min-w-0 flex-col gap-1', base.className)}>
      <div
        ref={(node) => {
          box.current = node;
          if (!node) return;
          if (root && root.trigger !== node) root.setTrigger(node);
          return linkLabel(node);
        }}
        id={base.id}
        role="group"
        aria-label={labelledBy ? undefined : label}
        aria-labelledby={labelledBy}
        aria-invalid={control['aria-invalid']}
        aria-describedby={control['aria-describedby']}
        aria-disabled={disabled || undefined}
        data-slot="date-picker"
        data-size={base.size ?? 'md'}
        className={cn(
          // A field's box (DESIGN.md, Field): the 2-wide edge, the focus ring
          // while a part has the focus, danger when invalid.
          'relative flex w-full min-w-0 items-center gap-1 rounded-md bg-page pl-3 text-sm text-foreground transition-shadow',
          'edge-control inset-ring-control has-[[data-segment]:focus]:focus-ring aria-invalid:inset-ring-danger', // design-ok: selectors, not values
          FIELD_SIZE[base.size ?? 'md'],
          root ? 'pr-1' : 'pr-3',
          disabled && 'bg-hover text-muted inset-ring-border',
        )}
        onFocus={(event) => {
          if (isPart(event.target)) setTyping(true);
        }}
        onBlur={(event) => {
          if (!isPart(event.relatedTarget)) setTyping(false);
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
            align: base.align ?? 'start',
            sideOffset: 6,
            alignOffset: 0,
          }}
          className="isolate z-50"
          // The day takes the focus; its ring shows only when the calendar
          // was opened from the keyboard (React Aria's).
          initialFocus={(popupEl) => {
            // A variable, not a literal: TypeScript before 6 has no
            // `focusVisible` in FocusOptions, and an app that copied this
            // file (omuk add) may use one. The browser reads it either way.
            const options = {
              preventScroll: false,
              focusVisible: root.how === 'keyboard',
            };
            popupEl
              .querySelector<HTMLElement>(
                '[data-slot=calendar] button[tabindex="0"]',
              )
              ?.focus(options);
          }}
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

/** One of the field's typed parts (a spinbutton). */
function isPart(node: EventTarget | null): boolean {
  return node instanceof Element && node.hasAttribute('data-segment');
}

// --- One value: a day, a day and a time, or a time ----------------------------

function SinglePicker(props: DateModeProps | TimeModeProps) {
  const isTime = props.mode === 'time';
  const kind: FieldKind = isTime
    ? 'time'
    : props.granularity === 'minute'
      ? 'dateTime'
      : 'date';
  // The browser's language once a pre-rendered page has hydrated.
  const locale = useDateLocale(props.locale);
  const hourCycle = props.hourCycle ?? hourCycleOf(locale);
  const [own, setOwn] = useState(props.defaultValue ?? null);
  const value = props.value === undefined ? own : props.value;
  const [touched, setTouched] = useState(false);
  const [interacted, setInteracted] = useState(false);
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
    setInteracted(true);
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

  // The form knows the problem at once; the person sees it only once they
  // have changed the field or sent the form (as :user-invalid): a
  // `validate` that rejects null would otherwise show at page load.
  const problem = props.validate?.(value) ?? null;
  const error = value === null && !interacted ? null : problem;

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
          <FormValue
            name={props.name}
            value={value ?? ''}
            required={props.isRequired}
            error={problem}
            focusTarget={firstPart}
            onInvalid={() => setInteracted(true)}
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
  // The browser's language once a pre-rendered page has hydrated.
  const locale = useDateLocale(props.locale);
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
  const [interacted, setInteracted] = useState(false);
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
    setInteracted(true);
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
    setInteracted(true);
    setDraft(range);
    set(range);
    if (props.shouldCloseOnSelect ?? true) root.setOpen(false, 'item-press');
  }

  const typedStart = parseDay(draft.start);
  const typedEnd = parseDay(draft.end);
  const backwards = Boolean(
    typedStart && typedEnd && compareDays(typedStart, typedEnd) > 0,
  );
  // As one date: no error for an empty range until it is changed or sent.
  const problem = props.validate?.(value) ?? null;
  const error = value === null && !interacted ? null : problem;
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
            <FormValue
              name={props.startName}
              value={value?.start ?? ''}
              required={props.isRequired}
              error={problem}
              focusTarget={firstPart}
              onInvalid={() => setInteracted(true)}
            />
          )}
          {props.endName && (
            <FormValue
              name={props.endName}
              value={value?.end ?? ''}
              required={props.isRequired}
              focusTarget={firstPart}
              onInvalid={() => setInteracted(true)}
            />
          )}
        </>
      }
    />
  );
}
