import { Input } from '@omuk/ui/input';
import { Label } from '@omuk/ui/label';
import { Segmented, SegmentedItem } from '@omuk/ui/segmented';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@omuk/ui/select';
import { Switch } from '@omuk/ui/switch';
import { cn } from '@omuk/ui/utils';
import { type ReactNode, useId, useState } from 'react';
import { CodeView } from './blocks';

// A live component with a panel of its props beside it. Each change in the
// panel redraws the component and the code under it, so the code is always
// what you see.

type Value = string | boolean | number;
type Values = Record<string, Value>;

/**
 * One prop in the panel: a switch for a boolean, a number field, a text
 * field, or a choice of values (side by side when few, else a select).
 */
export type Control<T extends Values> = {
  [K in keyof T & string]: T[K] extends boolean
    ? { name: K; kind: 'boolean' }
    : T[K] extends number
      ? { name: K; kind: 'number'; min?: number; max?: number }
      :
          | { name: K; kind: 'text' }
          | { name: K; kind: 'choice'; options: readonly T[K][] };
}[keyof T & string];

export function Playground<T extends Values>({
  initial,
  controls,
  render,
  code,
  align = 'center',
}: {
  /** Where the component sits: centred, or full width from the top. */
  align?: 'center' | 'start';
  initial: T;
  controls: Control<T>[];
  render: (values: T) => ReactNode;
  code: (values: T) => string;
}) {
  const [values, setValues] = useState(initial);
  function set(name: keyof T, value: Value) {
    setValues((previous) => ({ ...previous, [name]: value }));
  }
  return (
    // A border, not an inset ring: the panel's fill would cover a ring.
    <div className="flex flex-col overflow-hidden rounded-xl border lg:flex-row">
      <div className="flex min-w-0 flex-1 flex-col gap-4 p-4">
        <div
          className={cn(
            'flex min-h-56 flex-wrap gap-3 p-6',
            align === 'center'
              ? 'items-center justify-center'
              : 'flex-col items-stretch',
          )}
        >
          {render(values)}
        </div>
        <CodeView code={code(values)} />
      </div>
      <div className="flex shrink-0 flex-col gap-5 border-t bg-panel p-5 lg:w-64 lg:border-t-0 lg:border-l">
        {controls.map((control) => (
          <ControlField
            key={control.name}
            control={control}
            value={values[control.name]}
            onChange={(value) => set(control.name, value)}
          />
        ))}
      </div>
    </div>
  );
}

function ControlField<T extends Values>({
  control,
  value,
  onChange,
}: {
  control: Control<T>;
  value: Value;
  onChange: (value: Value) => void;
}) {
  const id = useId();
  const label = (
    <Label htmlFor={id} id={`${id}-label`} className="font-mono text-xs">
      {control.name}
    </Label>
  );
  if (control.kind === 'boolean') {
    return (
      <div className="flex flex-col gap-2">
        {label}
        <Switch
          id={id}
          checked={value === true}
          onCheckedChange={(checked) => onChange(checked)}
        />
      </div>
    );
  }
  if (control.kind === 'number') {
    return (
      <div className="flex flex-col gap-2">
        {label}
        <Input
          id={id}
          type="number"
          min={control.min}
          max={control.max}
          value={typeof value === 'number' ? value : 0}
          onChange={(event) => {
            // A typed value can pass min and max: keep it inside them, so
            // the component never gets a count it cannot draw.
            const next = event.target.valueAsNumber;
            if (Number.isNaN(next)) return;
            onChange(
              Math.min(
                control.max ?? Number.POSITIVE_INFINITY,
                Math.max(control.min ?? Number.NEGATIVE_INFINITY, next),
              ),
            );
          }}
        />
      </div>
    );
  }
  const text = typeof value === 'string' ? value : '';
  if (control.kind === 'text') {
    return (
      <div className="flex flex-col gap-2">
        {label}
        <Input
          id={id}
          value={text}
          onChange={(event) => onChange(event.target.value)}
        />
      </div>
    );
  }
  const options = control.options.map(String);
  // A few short values fit side by side; a longer list goes in a select.
  const fits =
    options.length <= 4 && options.every((option) => option.length <= 7);
  return (
    <div className="flex flex-col gap-2">
      {label}
      {fits ? (
        <Segmented
          aria-labelledby={`${id}-label`}
          value={text}
          onValueChange={onChange}
        >
          {options.map((option) => (
            <SegmentedItem key={option} value={option}>
              {option}
            </SegmentedItem>
          ))}
        </Segmented>
      ) : (
        <Select
          items={options.map((option) => ({ value: option, label: option }))}
          value={text}
          onValueChange={(next) => next !== null && onChange(next)}
        >
          <SelectTrigger id={id} className="w-full">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {options.map((option) => (
              <SelectItem key={option} value={option}>
                {option}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      )}
    </div>
  );
}

/**
 * The JSX for one element, as text. A prop at its default is left out, a
 * true boolean is its bare name, a false one is left out, a number goes in
 * braces.
 */
export function jsx(
  tag: string,
  props: Record<string, Value>,
  defaults: Record<string, Value>,
  children?: string,
) {
  const attributes = Object.entries(props)
    .filter(([name, value]) => value !== false && value !== defaults[name])
    .map(([name, value]) =>
      value === true
        ? name
        : typeof value === 'number'
          ? `${name}={${value}}`
          : `${name}="${value}"`,
    );
  const open = [tag, ...attributes].join(' ');
  return children ? `<${open}>${children}</${tag}>` : `<${open} />`;
}
