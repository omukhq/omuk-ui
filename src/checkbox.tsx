import {
  type ComponentPropsWithRef,
  type KeyboardEvent,
  type MouseEvent,
  use,
  useState,
} from 'react';
import { CheckboxGroupContext, parentState } from './checkbox-group';
import { useFieldControl } from './field-context';
import { resetWithForm } from './form-value';
import { mergeProps, type RenderProp, useMergedRef, useRender } from './render';
import { cn } from './utils';

// WAI-ARIA checkbox: a <button role="checkbox">. Space toggles it (the
// button's own click); Enter does not, as the pattern asks. With a `name`, a
// hidden native checkbox beside it takes part in the form, as Base UI's does.
//
// DESIGN.md, section 3: a 16 box with the 2-wide control edge, the same on hover;
// checked, the accent fill and a 12 tick (stroke 3) in the on-primary
// colour; some checked, a dash. Focus: the one focus ring. Disabled: the
// hover fill and the plain 1-wide `inset-ring inset-ring-border`, the tick muted.

const BOX =
  'peer relative fixed-size inline-flex size-4 shrink-0 items-center justify-center rounded-sm bg-page text-on-primary edge-control inset-ring-control outline-none transition-colors after:absolute after:-inset-x-3 after:-inset-y-2';

/** Focus and invalid: state the browser and a form set, so always on. */
const STATES =
  'focus-visible:focus-ring aria-invalid:edge-control aria-invalid:inset-ring-danger';

// Checked (or some checked) and disabled are added only when so: the box
// knows its own state, and a box at rest carries none of their classes.
// No hover edge, as fields (owner, 18 Nov 2026).
const ON = 'bg-accent inset-ring-accent';
const OFF =
  'cursor-not-allowed bg-hover text-muted inset-ring inset-ring-border';

/** Base UI's `eventDetails` for a change, the parts callers read. */
type CheckedChangeDetails = { reason: string; event: Event };

type CheckboxProps = Omit<
  ComponentPropsWithRef<'button'>,
  'value' | 'defaultChecked' | 'defaultValue' | 'onChange'
> & {
  checked?: boolean;
  defaultChecked?: boolean;
  onCheckedChange?: (
    checked: boolean,
    eventDetails: CheckedChangeDetails,
  ) => void;
  /** Neither on nor off: `aria-checked="mixed"` and a dash. */
  indeterminate?: boolean;
  readOnly?: boolean;
  required?: boolean;
  /** The form field's name. Without it, no native input is drawn. */
  name?: string;
  /**
   * What the form sends when the box is on (the browser's default: "on").
   * In a CheckboxGroup, the value this box stands for: the group checks it.
   */
  value?: string;
  /**
   * In a CheckboxGroup: the box that checks or clears every value in the
   * group's `allValues`; checked when all are, a dash when some are.
   */
  parent?: boolean;
  render?: RenderProp;
};

/** The marks, each one stroke as written with a pen. */
const MARKS = {
  // Down the short arm from the left, then up the long one to the top right
  // (lucide's check runs the other way).
  tick: 'M4 12l5 5L20 6',
  // Some checked: left to right.
  dash: 'M5 12h14',
} as const;

/**
 * The tick or the dash. `drawn` draws it (`animate-tick`, theme.css); else
 * it shows at once.
 */
function Mark({ shape, drawn }: { shape: keyof typeof MARKS; drawn: boolean }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={3}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
      className="size-3"
    >
      <path
        d={MARKS[shape]}
        pathLength={1}
        className={drawn ? 'animate-tick' : undefined}
      />
    </svg>
  );
}

function Checkbox({
  className,
  checked: controlled,
  defaultChecked = false,
  onCheckedChange,
  indeterminate: ownMixed = false,
  disabled: ownDisabled = false,
  readOnly = false,
  required = false,
  name: ownName,
  value,
  parent = false,
  form,
  render,
  ref,
  ...props
}: CheckboxProps) {
  const [own, setOwn] = useState(defaultChecked);
  // A form reset puts it back to defaultChecked, as a native checkbox.
  const merged = useMergedRef(
    ref,
    resetWithForm(() => setOwn(defaultChecked)),
  );
  // In a CheckboxGroup, the group decides: a parent box from all the
  // values, any other from its own value.
  const group = use(CheckboxGroupContext);
  const fromParent =
    group && parent ? parentState(group.value, group.allValues) : null;
  const fromGroup =
    group && !parent && value !== undefined
      ? group.value.includes(value)
      : undefined;
  const checked = fromParent?.checked ?? fromGroup ?? controlled ?? own;
  const indeterminate = fromParent?.mixed ?? ownMixed;
  const disabled = ownDisabled || (group?.disabled ?? false);
  // A parent box stands for no value of its own: it sends nothing.
  const name = parent ? undefined : (ownName ?? group?.name);
  const state = indeterminate
    ? 'data-indeterminate'
    : checked
      ? 'data-checked'
      : 'data-unchecked';
  // The mark is drawn once the box's look has changed since it mounted: a
  // click on it, or a parent box turning to a dash as its group changes. A
  // box that starts checked or mixed shows its mark at once. (Set during
  // render, as React's derived-state pattern: no effect.)
  const [shown, setShown] = useState(state);
  const [changed, setChanged] = useState(false);
  if (shown !== state) {
    setShown(state);
    setChanged(true);
  }
  const button = useRender(
    'button',
    mergeProps(
      {
        type: 'button',
        ref: merged,
        role: 'checkbox',
        'aria-checked': indeterminate ? 'mixed' : checked,
        'aria-readonly': readOnly || undefined,
        'aria-required': required || undefined,
        disabled,
        form,
        'data-slot': 'checkbox',
        [state]: '',
        'data-disabled': disabled ? '' : undefined,
        'data-readonly': readOnly ? '' : undefined,
        'data-required': required ? '' : undefined,
        className: cn(
          BOX,
          STATES,
          (checked || indeterminate) && ON,
          disabled && OFF,
          className,
        ),
        onKeyDown(event: KeyboardEvent) {
          // Enter would press the <button>; a checkbox takes Space only.
          if (event.key === 'Enter') event.preventDefault();
        },
        onClick(event: MouseEvent) {
          if (readOnly || event.defaultPrevented) return;
          // A mixed parent checks them all, as a click on an empty box.
          const next = indeterminate ? true : !checked;
          onCheckedChange?.(next, { reason: 'none', event: event.nativeEvent });
          if (group && parent) group.setAll(next);
          else if (group && value !== undefined) group.toggle(value, next);
          setOwn(next);
        },
        children:
          checked || indeterminate ? (
            <span
              data-slot="checkbox-indicator"
              {...{ [state]: '' }}
              className="grid place-content-center text-current transition-none"
            >
              {/* The header checkbox of a part-selected page: a dash, not a
                  tick. A key per shape, so a new mark draws from its start. */}
              <Mark
                key={indeterminate ? 'dash' : 'tick'}
                shape={indeterminate ? 'dash' : 'tick'}
                drawn={changed}
              />
            </span>
          ) : null,
      },
      { ...props, ...useFieldControl(props) },
    ),
    render,
  );
  return (
    <>
      {button}
      {name && (
        <input
          type="checkbox"
          aria-hidden
          tabIndex={-1}
          className="sr-only pointer-events-none"
          name={name}
          value={value}
          form={form}
          checked={checked}
          disabled={disabled}
          required={required}
          readOnly
          // A failed `required` check focuses this input; pass it on.
          onFocus={(event) =>
            (
              event.currentTarget.previousElementSibling as HTMLElement | null
            )?.focus()
          }
        />
      )}
    </>
  );
}

export { Checkbox };
