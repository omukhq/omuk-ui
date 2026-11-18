import { CheckIcon } from 'lucide-react';
import { type ComponentPropsWithRef, type MouseEvent, useState } from 'react';
import { mergeProps, type RenderProp, useRender } from './render';
import { cn } from './utils';

// WAI-ARIA switch: a <button role="switch">. Space toggles it, and Enter too
// (the button's own click; the pattern allows Enter). With a `name`, a hidden
// native checkbox beside it takes part in the form, as Base UI's does.
//
// DESIGN.md, section 3: a 44 × 24 track. Off: it reads like an empty
// checkbox (decisions, R13) — the page fill and the 2-wide control edge,
// the same on hover, with a 16 knob in the control grey (R28). On: the accent
// with a 20 knob that holds an accent check (12, stroke 3.5). The knob grows
// and slides. Disabled: the hover fill and the plain `inset-ring inset-ring-border`, the knob in the
// border colour, the check muted. Focus: the one focus ring. `sm` is a step
// smaller (36 × 20), for dense rows.
//
// The state's look is picked here rather than with competing variants
// (`disabled:` against `aria-checked:`), whose order in the stylesheet would
// decide which one wins.

/** Base UI's `eventDetails` for a change, the parts callers read. */
type CheckedChangeDetails = { reason: string; event: Event };

type SwitchProps = Omit<
  ComponentPropsWithRef<'button'>,
  'value' | 'defaultChecked' | 'defaultValue' | 'onChange'
> & {
  size?: 'sm' | 'default';
  checked?: boolean;
  defaultChecked?: boolean;
  onCheckedChange?: (
    checked: boolean,
    eventDetails: CheckedChangeDetails,
  ) => void;
  readOnly?: boolean;
  required?: boolean;
  /** The form field's name. Without it, no native input is drawn. */
  name?: string;
  /** What the form sends when the switch is on (the browser's default: "on"). */
  value?: string;
  render?: RenderProp;
};

function Switch({
  className,
  size = 'default',
  checked: controlled,
  defaultChecked = false,
  onCheckedChange,
  disabled = false,
  readOnly = false,
  required = false,
  name,
  value,
  form,
  render,
  ...props
}: SwitchProps) {
  const [own, setOwn] = useState(defaultChecked);
  const checked = controlled ?? own;
  const state = checked ? 'data-checked' : 'data-unchecked';
  const button = useRender(
    'button',
    mergeProps(
      {
        type: 'button',
        role: 'switch',
        'aria-checked': checked,
        'aria-readonly': readOnly || undefined,
        'aria-required': required || undefined,
        disabled,
        form,
        'data-slot': 'switch',
        'data-size': size,
        [state]: '',
        'data-disabled': disabled ? '' : undefined,
        'data-readonly': readOnly ? '' : undefined,
        'data-required': required ? '' : undefined,
        className: cn(
          'peer group/switch relative inline-flex shrink-0 items-center rounded-full p-0.5 transition-colors outline-none after:absolute after:-inset-x-3 after:-inset-y-2 focus-visible:focus-ring aria-invalid:inset-ring-2 aria-invalid:inset-ring-danger',
          disabled
            ? 'cursor-not-allowed bg-hover inset-ring inset-ring-border'
            : checked
              ? 'bg-accent'
              : 'bg-page inset-ring-2 inset-ring-control',
          size === 'sm' ? 'h-5 w-9' : 'h-6 w-11',
          className,
        ),
        onClick(event: MouseEvent) {
          if (readOnly || event.defaultPrevented) return;
          const next = !checked;
          onCheckedChange?.(next, { reason: 'none', event: event.nativeEvent });
          setOwn(next);
        },
        children: (
          <span
            data-slot="switch-thumb"
            {...{ [state]: '' }}
            className={cn(
              'pointer-events-none grid place-items-center rounded-full transition-all',
              disabled
                ? 'bg-border text-muted'
                : checked
                  ? 'bg-on-primary text-accent'
                  : 'bg-control',
              // The knob's place and size for the state (the switch knows).
              size === 'sm'
                ? checked
                  ? 'size-4 translate-x-4'
                  : 'm-0.5 size-3'
                : checked
                  ? 'size-5 translate-x-5'
                  : 'm-0.5 size-4',
            )}
          >
            {checked && (
              <CheckIcon
                className={size === 'sm' ? 'size-2.5' : 'size-3'}
                strokeWidth={3.5}
              />
            )}
          </span>
        ),
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

export { Switch };
