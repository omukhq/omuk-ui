import { CheckIcon, MinusIcon } from 'lucide-react';
import {
  type ComponentPropsWithRef,
  type KeyboardEvent,
  type MouseEvent,
  useState,
} from 'react';
import { mergeProps, type RenderProp, useRender } from './render';
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
  'peer relative inline-flex size-4 shrink-0 items-center justify-center rounded-sm bg-page text-on-primary inset-ring-2 inset-ring-control outline-none transition-colors after:absolute after:-inset-x-3 after:-inset-y-2';

/** Focus and invalid: state the browser and a form set, so always on. */
const STATES =
  'focus-visible:focus-ring aria-invalid:inset-ring-2 aria-invalid:inset-ring-danger';

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
  /** What the form sends when the box is on (the browser's default: "on"). */
  value?: string;
  render?: RenderProp;
};

function Checkbox({
  className,
  checked: controlled,
  defaultChecked = false,
  onCheckedChange,
  indeterminate = false,
  disabled = false,
  readOnly = false,
  required = false,
  name,
  value,
  form,
  render,
  ...props
}: CheckboxProps) {
  const [own, setOwn] = useState(defaultChecked);
  const checked = controlled ?? own;
  const state = indeterminate
    ? 'data-indeterminate'
    : checked
      ? 'data-checked'
      : 'data-unchecked';
  const button = useRender(
    'button',
    mergeProps(
      {
        type: 'button',
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
          const next = !checked;
          onCheckedChange?.(next, { reason: 'none', event: event.nativeEvent });
          setOwn(next);
        },
        children:
          checked || indeterminate ? (
            <span
              data-slot="checkbox-indicator"
              {...{ [state]: '' }}
              className="grid place-content-center text-current transition-none"
            >
              {/* The header checkbox of a part-selected page: a dash, not a tick. */}
              {indeterminate ? (
                <MinusIcon className="size-3" strokeWidth={3} />
              ) : (
                <CheckIcon className="size-3" strokeWidth={3} />
              )}
            </span>
          ) : null,
      },
      props,
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
