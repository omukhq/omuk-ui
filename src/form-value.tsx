import type { ComponentPropsWithRef } from 'react';

type FormValueProps = Omit<
  ComponentPropsWithRef<'input'>,
  'type' | 'onChange' | 'onFocus' | 'readOnly' | 'tabIndex' | 'className'
> & {
  /**
   * The visible control that takes the focus when the form reports an
   * error. Gets this input, for a control found next to it in the page.
   */
  focusTarget: (input: HTMLInputElement) => HTMLElement | null | undefined;
};

/**
 * The value a form sends for a control that is not a native field (select,
 * combobox, date picker). A visually hidden text input, not
 * `type="hidden"`: a browser checks only real fields, so with `required` the
 * form does not send while the value is empty (Modern Web Guidance,
 * select-menu-interaction). The browser focuses this input to show its
 * message; the input hands the focus on to the visible control.
 */
export function FormValue({ focusTarget, ...props }: FormValueProps) {
  return (
    <input
      {...props}
      aria-hidden
      tabIndex={-1}
      autoComplete="off"
      className="sr-only pointer-events-none"
      // React's value is the source; a change here comes from nowhere.
      onChange={() => {}}
      onFocus={(event) => focusTarget(event.currentTarget)?.focus()}
    />
  );
}
