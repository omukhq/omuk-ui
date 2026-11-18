import { type KeyboardEvent, useRef, useState } from 'react';
import { cn } from '../utils';
import type { CivilDateTime } from './civil';
import {
  dayPeriodNames,
  digitOf,
  type FieldKind,
  type FieldPart,
  fieldParts,
  formatNumber,
  type HourCycle,
  type SegmentType,
} from './locale';
import {
  constrain,
  fromValue,
  limitsOf,
  PAGE_STEP,
  type Segments,
  startOf,
  stepPart,
  toValue,
  typeDigit,
  typePeriod,
} from './segments';

// The typed parts of one value (React Aria's DateField and TimeField): a
// `spinbutton` for each part, in the language's order. It keeps the parts
// typed so far and gives the value (ISO text) once every part is filled,
// or null when one is emptied. The box around it is the picker's.

export type DateSegmentsProps = {
  kind: FieldKind;
  value: string | null;
  onChange: (value: string | null) => void;
  locale: string;
  hourCycle: HourCycle;
  /** Where an empty part starts on Up or Down. */
  placeholder: CivilDateTime;
  /** The group's name for screen readers: "Start date", "Date". */
  label: string;
  disabled?: boolean;
  readOnly?: boolean;
  invalid?: boolean;
  forceLeadingZeros?: boolean;
};

const EMPTY_TEXT: Record<SegmentType, string> = {
  day: 'dd',
  month: 'mm',
  year: 'yyyy',
  hour: '––',
  minute: '––',
  dayPeriod: '',
};

/** The part's name in the language ("day", "Tag"), for screen readers. */
function partName(locale: string, type: SegmentType): string {
  try {
    const names = new Intl.DisplayNames(locale, { type: 'dateTimeField' });
    return names.of(type) ?? type;
  } catch {
    return type === 'dayPeriod' ? 'AM/PM' : type;
  }
}

export function DateSegments({
  kind,
  value,
  onChange,
  locale,
  hourCycle,
  placeholder,
  label,
  disabled = false,
  readOnly = false,
  invalid = false,
  forceLeadingZeros = false,
}: DateSegmentsProps) {
  const parts: FieldPart[] = fieldParts(locale, kind, hourCycle);
  const periods = dayPeriodNames(locale);
  const [segments, setSegments] = useState(() =>
    fromValue(value, kind, hourCycle),
  );
  // The value changed from outside (a calendar pick, a reset): show it.
  // Our own change (null while a part is emptied or a year is typed) keeps
  // the parts typed so far.
  const emitted = useRef<string | null | undefined>(undefined);
  const [seen, setSeen] = useState(value);
  if (value !== seen) {
    setSeen(value);
    if (value !== emitted.current) {
      setSegments(fromValue(value, kind, hourCycle));
    }
  }
  // The digits typed into the focused part, until it is full or left.
  const buffer = useRef('');
  // A year being typed is not final until its 4 digits are in or the part
  // is left: "2" is not the year 2 (React Aria's behaviour).
  const typingYear = useRef(false);
  const group = useRef<HTMLDivElement | null>(null);

  function update(next: Segments) {
    setSegments(next);
    const nextValue = typingYear.current
      ? null
      : toValue(next, kind, hourCycle);
    if (nextValue !== value) {
      emitted.current = nextValue;
      onChange(nextValue);
    }
  }

  /** A year left half typed: it is final now. */
  function finishYear() {
    if (!typingYear.current) return false;
    typingYear.current = false;
    buffer.current = '';
    return true;
  }

  /** The part beside this one (any field in the same picker). */
  function moveFrom(from: HTMLElement, step: 1 | -1) {
    const scope = from.closest('[data-slot=date-picker]') ?? group.current;
    const all = [
      ...(scope?.querySelectorAll<HTMLElement>('[data-segment]') ?? []),
    ];
    all[all.indexOf(from) + step]?.focus();
  }

  function text(type: SegmentType): string {
    const typed = segments[type];
    if (typed === undefined) {
      return buffer.current &&
        document.activeElement?.getAttribute('data-segment') === type
        ? buffer.current
        : EMPTY_TEXT[type] || periods[0];
    }
    if (type === 'dayPeriod') return periods[typed] ?? '';
    const size =
      type === 'minute' || (type === 'hour' && hourCycle === 24)
        ? 2
        : type === 'year'
          ? 1
          : forceLeadingZeros
            ? 2
            : 1;
    return formatNumber(locale, typed, size);
  }

  function onKeyDown(type: SegmentType, event: KeyboardEvent<HTMLElement>) {
    const target = event.currentTarget;
    const limits = limitsOf(type, segments, hourCycle);
    const current = segments[type];
    const step = (delta: number) =>
      update({
        ...segments,
        [type]: stepPart(
          current,
          delta,
          limits,
          startOf(type, placeholder, hourCycle),
        ),
      });
    switch (event.key) {
      case 'ArrowLeft':
        event.preventDefault();
        moveFrom(target, -1);
        return;
      case 'ArrowRight':
        event.preventDefault();
        moveFrom(target, 1);
        return;
      case 'Tab':
      case 'Enter':
      case 'Escape':
        return;
    }
    if (readOnly || disabled) return;
    switch (event.key) {
      case 'ArrowUp':
        event.preventDefault();
        step(1);
        return;
      case 'ArrowDown':
        event.preventDefault();
        step(-1);
        return;
      case 'PageUp':
        event.preventDefault();
        step(PAGE_STEP[type]);
        return;
      case 'PageDown':
        event.preventDefault();
        step(-PAGE_STEP[type]);
        return;
      case 'Home':
        event.preventDefault();
        update({ ...segments, [type]: limits.min });
        return;
      case 'End':
        event.preventDefault();
        update({ ...segments, [type]: limits.max });
        return;
      case 'Backspace':
      case 'Delete': {
        event.preventDefault();
        buffer.current = '';
        if (current === undefined) {
          if (event.key === 'Backspace') moveFrom(target, -1);
          return;
        }
        // One digit off the end; the last one empties the part.
        const shorter =
          type === 'dayPeriod' || current < 10
            ? undefined
            : Math.floor(current / 10);
        const next = { ...segments };
        if (shorter === undefined) delete next[type];
        else next[type] = shorter;
        update(next);
        return;
      }
    }
    // Typing. React Aria reads `beforeinput`; a key's text is the same here,
    // and a phone's keyboard sends one key event for each digit as well.
    if (event.key.length !== 1 || event.metaKey || event.ctrlKey) return;
    event.preventDefault();
    if (type === 'dayPeriod') {
      const period = typePeriod(event.key, periods);
      if (period !== null) {
        update({ ...segments, dayPeriod: period });
        moveFrom(target, 1);
      }
      return;
    }
    const digit = digitOf(event.key, locale);
    if (digit === null) return;
    const typed = typeDigit(buffer.current, digit, limits);
    buffer.current = typed.buffer;
    typingYear.current = type === 'year' && !typed.advance;
    const next = { ...segments };
    if (typed.value === null) delete next[type];
    else next[type] = typed.value;
    update(next);
    if (typed.advance) moveFrom(target, 1);
  }

  return (
    <div
      ref={group}
      role="group"
      aria-label={label}
      aria-invalid={invalid || undefined}
      aria-disabled={disabled || undefined}
      data-slot="date-segments"
      className="flex items-center whitespace-nowrap tabular-nums"
      onBlur={(event) => {
        if (event.currentTarget.contains(event.relatedTarget)) return;
        // Leaving the field: a half-typed year is final, and 31 April
        // becomes 30 April.
        const done = constrain(segments);
        if (finishYear() || done !== segments) update(done);
      }}
    >
      {parts.map((part, at) => {
        if (part.type === 'literal') {
          return (
            <span key={at} aria-hidden className="text-muted">
              {part.text}
            </span>
          );
        }
        const type = part.type;
        const limits = limitsOf(type, segments, hourCycle);
        const current = segments[type];
        return (
          <span
            key={type}
            role="spinbutton"
            tabIndex={disabled ? undefined : 0}
            inputMode={type === 'dayPeriod' ? 'text' : 'numeric'}
            enterKeyHint="next"
            data-segment={type}
            data-placeholder={current === undefined ? '' : undefined}
            aria-label={partName(locale, type)}
            aria-valuemin={limits.min}
            aria-valuemax={limits.max}
            aria-valuenow={current}
            aria-valuetext={current === undefined ? undefined : text(type)}
            aria-readonly={readOnly || undefined}
            aria-disabled={disabled || undefined}
            className={cn(
              'rounded-sm px-0.5 text-foreground caret-transparent outline-none select-none not-focus:data-placeholder:text-muted',
              // The focused part: the accent fill, as React Spectrum's.
              'focus:bg-accent focus:text-on-accent',
              disabled && 'text-muted',
            )}
            onFocus={() => {
              if (finishYear()) update(segments);
              buffer.current = '';
            }}
            onKeyDown={(event) => onKeyDown(type, event)}
            onPaste={(event) => event.preventDefault()}
          >
            {text(type)}
          </span>
        );
      })}
    </div>
  );
}
