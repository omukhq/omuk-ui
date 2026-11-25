import { createContext, use, useLayoutEffect } from 'react';

// What a Field tells the control inside it: the ids of its descriptions and
// errors, while they are on the page. The control then names them in
// `aria-describedby`, so a screen reader reads the hint and the error with
// the field (Modern Web Guidance: forms, accessible-error-announcement).
// Its own file, so a control that reads it does not load Field's parts.

export type FieldPart = 'description' | 'error';

export type FieldState = {
  /** The ids on the page now, descriptions first. */
  parts: { id: string; part: FieldPart }[];
  add: (id: string, part: FieldPart) => void;
  remove: (id: string) => void;
};

export const FieldContext = createContext<FieldState | null>(null);

/** Puts a description's or an error's id on the field while it shows. */
export function useFieldPart(id: string, part: FieldPart, shown: boolean) {
  const field = use(FieldContext);
  const add = field?.add;
  const remove = field?.remove;
  useLayoutEffect(() => {
    if (!add || !remove || !shown) return;
    add(id, part);
    return () => remove(id);
  }, [add, remove, id, part, shown]);
}

type ControlProps = {
  'aria-describedby'?: string;
  'aria-invalid'?: boolean | 'true' | 'false' | 'grammar' | 'spelling';
};

/**
 * A control's describedby and invalid props inside a Field: its own ids
 * first, then the field's descriptions, then its errors while they show;
 * invalid while an error shows, unless the control says otherwise. Outside
 * a Field, the control's own props.
 */
export function useFieldControl(props: ControlProps): ControlProps {
  const field = use(FieldContext);
  if (!field?.parts.length) return props;
  const ordered = [
    ...field.parts.filter((each) => each.part === 'description'),
    ...field.parts.filter((each) => each.part === 'error'),
  ];
  const describedBy = [
    props['aria-describedby'],
    ...ordered.map((each) => each.id),
  ]
    .filter(Boolean)
    .join(' ');
  const hasError = ordered.some((each) => each.part === 'error');
  return {
    'aria-describedby': describedBy,
    'aria-invalid': props['aria-invalid'] ?? (hasError || undefined),
  };
}
