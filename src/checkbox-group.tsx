import { type ComponentPropsWithRef, createContext, useState } from 'react';
import { cn } from './utils';

// A group of checkboxes with one value: the list of the checked ones (Base
// UI's CheckboxGroup). Each <Checkbox value="…"> inside it asks the group
// whether it is checked, and tells it when it changes. A `<Checkbox parent>`
// checks or clears them all: checked when every value in `allValues` is,
// a dash when only some are.
//
// A `role="group"`: name it with `aria-labelledby` (a heading or a Label),
// as a radio group. Tab moves through the boxes; Space toggles one.

export type CheckboxGroupState = {
  value: readonly string[];
  /** Turns one value on or off. */
  toggle: (value: string, on: boolean) => void;
  /** The values a parent checkbox checks and clears. */
  allValues: readonly string[];
  /** Turns every value in `allValues` on, or all of them off. */
  setAll: (on: boolean) => void;
  disabled: boolean;
  /** The form field's name for every box in the group. */
  name?: string;
};

export const CheckboxGroupContext = createContext<CheckboxGroupState | null>(
  null,
);

/**
 * A parent checkbox's look from the group's value: checked when every value
 * in `allValues` is checked, mixed when some are.
 */
export function parentState(
  value: readonly string[],
  allValues: readonly string[],
): { checked: boolean; mixed: boolean } {
  const on = allValues.filter((each) => value.includes(each)).length;
  return {
    checked: allValues.length > 0 && on === allValues.length,
    mixed: on > 0 && on < allValues.length,
  };
}

type CheckboxGroupProps = Omit<
  ComponentPropsWithRef<'div'>,
  'defaultValue' | 'onChange'
> & {
  /** The checked values, when the parent keeps them. */
  value?: readonly string[];
  /** The checked values at first, when the group keeps them. */
  defaultValue?: readonly string[];
  onValueChange?: (value: string[]) => void;
  /** Every value a `<Checkbox parent>` checks and clears. */
  allValues?: readonly string[];
  disabled?: boolean;
  /** The form field's name: each checked box sends its value under it. */
  name?: string;
};

function CheckboxGroup({
  className,
  value: controlled,
  defaultValue = [],
  onValueChange,
  allValues = [],
  disabled = false,
  name,
  ...props
}: CheckboxGroupProps) {
  const [own, setOwn] = useState<readonly string[]>(defaultValue);
  const value = controlled ?? own;

  function change(next: string[]) {
    onValueChange?.(next);
    setOwn(next);
  }

  function toggle(item: string, on: boolean) {
    const has = value.includes(item);
    if (on === has) return;
    change(on ? [...value, item] : value.filter((each) => each !== item));
  }

  function setAll(on: boolean) {
    // Keep any checked value that is not one of allValues.
    const others = value.filter((each) => !allValues.includes(each));
    change(on ? [...others, ...allValues] : others);
  }

  return (
    <CheckboxGroupContext
      value={{ value, toggle, allValues, setAll, disabled, name }}
    >
      <div
        role="group"
        data-slot="checkbox-group"
        data-disabled={disabled ? '' : undefined}
        className={cn('flex flex-col gap-3', className)}
        {...props}
      />
    </CheckboxGroupContext>
  );
}

export { CheckboxGroup };
