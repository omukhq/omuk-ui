'use client';

import { cva, type VariantProps } from 'class-variance-authority';
import { useCallback, useId, useMemo, useState } from 'react';
import {
  FieldContext,
  type FieldPart,
  type FieldState,
  useFieldPart,
} from './field-context';
import { Label } from './label';
import { Separator } from './separator';
import { cn } from './utils';

function FieldSet({ className, ...props }: React.ComponentProps<'fieldset'>) {
  return (
    <fieldset
      data-slot="field-set"
      className={cn(
        'flex flex-col gap-6 [&:has(>[data-slot=checkbox-group])]:gap-3 [&:has(>[data-slot=radio-group])]:gap-3',
        className,
      )}
      {...props}
    />
  );
}

function FieldLegend({
  className,
  variant = 'legend',
  ...props
}: React.ComponentProps<'legend'> & { variant?: 'legend' | 'label' }) {
  return (
    <legend
      data-slot="field-legend"
      data-variant={variant}
      className={cn(
        'mb-3',
        variant === 'label'
          ? 'text-sm font-medium'
          : 'text-base leading-tight font-semibold',
        className,
      )}
      {...props}
    />
  );
}

function FieldGroup({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="field-group"
      className={cn(
        'group/field-group @container/field-group flex w-full flex-col gap-6 data-[slot=checkbox-group]:gap-3 *:data-[slot=field-group]:gap-4',
        className,
      )}
      {...props}
    />
  );
}

const fieldVariants = cva('group/field flex w-full', {
  variants: {
    // Vertical: the label above, gap 1 (DESIGN.md, section 3). Beside a
    // checkbox, radio or switch: gap 2, the control on the first line.
    orientation: {
      vertical: 'flex-col gap-1 *:w-full [&>.sr-only]:w-auto',
      horizontal:
        'flex-row items-center gap-2 [&:has(>[data-slot=field-content])]:items-start *:data-[slot=field-label]:flex-auto [&:has(>[data-slot=field-content])>[role=checkbox]]:mt-0.5 [&:has(>[data-slot=field-content])>[role=radio]]:mt-0.5',
      responsive:
        'flex-col gap-1 *:w-full @md/field-group:flex-row @md/field-group:items-center @md/field-group:gap-2 @md/field-group:*:w-auto @md/field-group:[&:has(>[data-slot=field-content])]:items-start @md/field-group:*:data-[slot=field-label]:flex-auto [&>.sr-only]:w-auto',
    },
  },
  defaultVariants: {
    orientation: 'vertical',
  },
});

/**
 * A label, a control, and its description and error. The control inside
 * names the description and the error in `aria-describedby` by itself, and
 * is invalid while the error shows (field-context.ts).
 */
function Field({
  className,
  orientation = 'vertical',
  ...props
}: React.ComponentProps<'div'> & VariantProps<typeof fieldVariants>) {
  const [parts, setParts] = useState<FieldState['parts']>([]);
  const add = useCallback(
    (id: string, part: FieldPart) =>
      setParts((now) => [
        ...now.filter((each) => each.id !== id),
        { id, part },
      ]),
    [],
  );
  const remove = useCallback(
    (id: string) => setParts((now) => now.filter((each) => each.id !== id)),
    [],
  );
  const field = useMemo(() => ({ parts, add, remove }), [parts, add, remove]);
  return (
    <FieldContext value={field}>
      <div
        role="group"
        data-slot="field"
        data-orientation={orientation}
        className={cn(fieldVariants({ orientation }), className)}
        {...props}
      />
    </FieldContext>
  );
}

function FieldContent({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="field-content"
      className={cn('group/field-content flex flex-1 flex-col', className)}
      {...props}
    />
  );
}

function FieldLabel({
  className,
  ...props
}: React.ComponentProps<typeof Label>) {
  return (
    <Label
      data-slot="field-label"
      className={cn(
        'group/field-label peer/field-label flex w-fit gap-2 group-data-disabled/field:text-muted',
        // A label around a whole field is a choice card: the `inset-ring inset-ring-border`,
        // the picked edge once its control is on.
        '[&:has(>[data-slot=field])]:w-full [&:has(>[data-slot=field])]:flex-col [&:has(>[data-slot=field])]:rounded-md [&:has(>[data-slot=field])]:inset-ring [&:has(>[data-slot=field])]:inset-ring-border [&:has(>[data-slot=field]_[aria-checked=true])]:edge-control [&:has(>[data-slot=field]_[aria-checked=true])]:inset-ring-accent *:data-[slot=field]:p-3',
        className,
      )}
      {...props}
    />
  );
}

function FieldTitle({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="field-label"
      className={cn(
        'flex w-fit items-center gap-2 text-sm font-medium group-data-disabled/field:text-muted',
        className,
      )}
      {...props}
    />
  );
}

function FieldDescription({
  className,
  id: ownId,
  ...props
}: React.ComponentProps<'p'>) {
  const autoId = useId();
  const id = ownId ?? autoId;
  useFieldPart(id, 'description', true);
  return (
    <p
      id={id}
      data-slot="field-description"
      className={cn(
        'text-left text-xs leading-normal font-normal text-muted group-has-data-horizontal/field:text-balance [[data-variant=legend]+&]:-mt-2',
        '[&>a]:text-accent [&>a]:underline [&>a]:underline-offset-4',
        className,
      )}
      {...props}
    />
  );
}

function FieldSeparator({
  children,
  className,
  ...props
}: React.ComponentProps<'div'> & {
  children?: React.ReactNode;
}) {
  return (
    <div
      data-slot="field-separator"
      data-content={!!children}
      className={cn('relative -my-2 h-5 text-sm', className)}
      {...props}
    >
      <Separator className="absolute inset-0 top-1/2" />
      {children && (
        <span
          className="relative mx-auto block w-fit bg-page px-2 text-muted"
          data-slot="field-separator-content"
        >
          {children}
        </span>
      )}
    </div>
  );
}

/** The children, else the errors' messages: one as text, more as a list. */
function errorContent(
  children: React.ReactNode,
  errors: Array<{ message?: string } | undefined> | undefined,
) {
  if (children) return children;
  if (!errors?.length) return null;
  const unique = [
    ...new Map(errors.map((error) => [error?.message, error])).values(),
  ];
  if (unique.length === 1) return unique[0]?.message;
  return (
    <ul className="ml-4 flex list-disc flex-col gap-1">
      {unique.map(
        (error, index) =>
          error?.message && <li key={index}>{error.message}</li>,
      )}
    </ul>
  );
}

/**
 * The field's error. Not a live region of its own: the control names it in
 * `aria-describedby` and turns invalid, so a screen reader reads it with
 * the field (Modern Web Guidance, accessible-error-announcement: an alert
 * per message is not read out reliably). After a failed submit, the app
 * moves the focus to the first invalid field.
 */
function FieldError({
  className,
  children,
  errors,
  id: ownId,
  ...props
}: React.ComponentProps<'div'> & {
  errors?: Array<{ message?: string } | undefined>;
}) {
  const autoId = useId();
  const id = ownId ?? autoId;
  const content = errorContent(children, errors);
  useFieldPart(id, 'error', Boolean(content));
  if (!content) return null;
  return (
    <div
      id={id}
      data-slot="field-error"
      className={cn('text-xs font-normal text-danger', className)}
      {...props}
    >
      {content}
    </div>
  );
}

export {
  Field,
  FieldContent,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSeparator,
  FieldSet,
  FieldTitle,
};
