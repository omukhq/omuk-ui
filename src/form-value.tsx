import { type ComponentPropsWithRef, useLayoutEffect, useRef } from 'react';
import { useMergedRef } from './render';

type FormValueProps = Omit<
  ComponentPropsWithRef<'input'>,
  'type' | 'onChange' | 'onFocus' | 'readOnly' | 'tabIndex' | 'className'
> & {
  /**
   * The visible control that takes the focus when the form reports an
   * error. Gets this input, for a control found next to it in the page.
   */
  focusTarget: (input: HTMLInputElement) => HTMLElement | null | undefined;
  /**
   * The control's own error (a `validate` result): the form does not send
   * while there is one, as with a native check.
   */
  error?: string | null;
};

/**
 * The value a form sends for a control that is not a native field (select,
 * combobox, date picker). A visually hidden text input, not
 * `type="hidden"`: a browser checks only real fields, so with `required` the
 * form does not send while the value is empty (Modern Web Guidance,
 * select-menu-interaction). The browser focuses this input to show its
 * message; the input hands the focus on to the visible control.
 */
export function FormValue({
  focusTarget,
  error,
  ref,
  ...props
}: FormValueProps) {
  const own = useRef<HTMLInputElement | null>(null);
  const merged = useMergedRef(ref, own);
  useLayoutEffect(() => {
    own.current?.setCustomValidity(error ?? '');
  }, [error]);
  return (
    <input
      ref={merged}
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
