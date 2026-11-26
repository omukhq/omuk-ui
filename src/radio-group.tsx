import {
  type ComponentPropsWithRef,
  createContext,
  type KeyboardEvent,
  use,
  useState,
} from 'react';
import { FormValue, resetWithForm } from './form-value';
import { useMergedRef } from './render';
import { cn } from './utils';

// WAI-ARIA radio group: one tab stop (the picked radio; while none is
// picked, each radio), the arrow keys move AND pick. The root app has no radio; the names follow
// shadcn's (RadioGroup, RadioGroupItem) so a later root one can match.
//
// DESIGN.md, section 3: the checkbox's box, round: the 2-wide control edge,
// the same on hover. Picked: an on-primary centre in a 5-wide accent ring.
// Focus: the one focus ring. Disabled: the hover fill and the plain `inset-ring inset-ring-border`.

type RadioGroupState = {
  value: string | null;
  pick: (value: string) => void;
  disabled: boolean;
};

const RadioGroupContext = createContext<RadioGroupState | null>(null);

/**
 * The arrow keys in a group of `role=radio` buttons: move to the next one
 * (round at the ends) and pick it. The segmented control uses it too.
 */
export function moveAndPick(event: KeyboardEvent<HTMLElement>) {
  const back = event.key === 'ArrowUp' || event.key === 'ArrowLeft';
  const forward = event.key === 'ArrowDown' || event.key === 'ArrowRight';
  if (!back && !forward) return;
  const radios = [
    ...event.currentTarget.querySelectorAll<HTMLButtonElement>(
      '[role=radio]:not(:disabled)',
    ),
  ];
  const from = radios.indexOf(event.target as HTMLButtonElement);
  if (from < 0) return;
  event.preventDefault();
  const next =
    radios[(from + (forward ? 1 : -1) + radios.length) % radios.length];
  next?.focus();
  next?.click();
}

type RadioGroupProps = Omit<
  ComponentPropsWithRef<'div'>,
  'defaultValue' | 'onChange'
> & {
  value?: string | null;
  defaultValue?: string | null;
  onValueChange?: (value: string) => void;
  disabled?: boolean;
  /** The form field's name. Without it, no native input is drawn. */
  name?: string;
  /** The form does not send while no radio is picked. Needs `name`. */
  required?: boolean;
};

function RadioGroup({
  className,
  value: controlled,
  defaultValue = null,
  onValueChange,
  disabled = false,
  name,
  required = false,
  children,
  ref,
  ...props
}: RadioGroupProps) {
  const [own, setOwn] = useState(defaultValue);
  // A form reset puts it back to defaultValue, as native radios.
  const merged = useMergedRef(
    ref,
    resetWithForm(() => setOwn(defaultValue)),
  );
  const value = controlled === undefined ? own : controlled;
  function pick(next: string) {
    if (next === value) return;
    onValueChange?.(next);
    setOwn(next);
  }
  return (
    <RadioGroupContext value={{ value, pick, disabled }}>
      <div
        ref={merged}
        role="radiogroup"
        aria-required={required || undefined}
        aria-disabled={disabled || undefined}
        data-slot="radio-group"
        data-disabled={disabled ? '' : undefined}
        className={cn('grid gap-3', className)}
        onKeyDown={moveAndPick}
        {...props}
      >
        {children}
        {/* Not type="hidden": the browser checks `required` only on a real
            field. Its message focuses the picked radio, else the first.
            Named only once a radio is picked: with none, the form sends
            nothing for the group, as with native radios. */}
        {name && (
          <FormValue
            name={value === null ? undefined : name}
            value={value ?? ''}
            required={required}
            disabled={disabled}
            focusTarget={(input) =>
              input.parentElement?.querySelector<HTMLElement>(
                '[role=radio][aria-checked=true], [role=radio]:not(:disabled)',
              )
            }
          />
        )}
      </div>
    </RadioGroupContext>
  );
}

function RadioGroupItem({
  className,
  value,
  disabled: own = false,
  ...props
}: Omit<ComponentPropsWithRef<'button'>, 'value'> & { value: string }) {
  const group = use(RadioGroupContext);
  if (!group) throw new Error('A radio must be inside <RadioGroup>.');
  const checked = group.value === value;
  const disabled = group.disabled || own;
  const tabStop = checked || group.value === null ? 0 : -1;
  return (
    <button
      type="button"
      role="radio"
      aria-checked={checked}
      disabled={disabled}
      tabIndex={tabStop}
      data-slot="radio-group-item"
      data-checked={checked ? '' : undefined}
      data-unchecked={checked ? undefined : ''}
      className={cn(
        'peer relative fixed-size inline-flex size-4 shrink-0 items-center justify-center rounded-full bg-page edge-control inset-ring-control outline-none transition-colors before:absolute before:-inset-2',
        // No hover edge, as fields (owner, 18 Nov 2026).
        'focus-visible:focus-ring aria-invalid:edge-control aria-invalid:inset-ring-danger',
        // Picked and disabled only when so (the radio knows).
        checked && 'bg-accent inset-ring-accent',
        disabled && 'cursor-not-allowed bg-hover inset-ring inset-ring-border',
        className,
      )}
      onClick={() => group.pick(value)}
      {...props}
    >
      {checked && (
        <span
          data-slot="radio-group-indicator"
          className={cn(
            'size-1.5 rounded-full',
            disabled ? 'bg-muted' : 'bg-on-primary',
          )}
        />
      )}
    </button>
  );
}

export { RadioGroup, RadioGroupItem };
