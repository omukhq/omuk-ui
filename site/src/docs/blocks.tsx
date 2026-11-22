import { Segmented, SegmentedItem } from '@omuk/ui/segmented';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@omuk/ui/table';
import { cn } from '@omuk/ui/utils';
import { type ReactNode, useState } from 'react';
import { CopyButton } from '../copy-button';

// The parts every component page is made of. A page is a list of these:
// sections, live examples with their code, a props table, the keys.

/** A titled part of a page: an h2 and what it holds. */
export function DocSection({
  title,
  description,
  children,
}: {
  title: string;
  description?: ReactNode;
  children: ReactNode;
}) {
  const id = title.toLowerCase().replace(/[^a-z0-9]+/g, '-');
  return (
    <section aria-labelledby={id} className="flex flex-col gap-4 pt-14">
      <div className="flex flex-col gap-1">
        <h2 id={id} className="text-xl font-semibold text-foreground">
          {title}
        </h2>
        {description && (
          <p className="max-w-2xl text-base text-pretty text-muted">
            {description}
          </p>
        )}
      </div>
      {children}
    </section>
  );
}

/**
 * A live example and its code. `source` is the example file itself
 * (imported with `?raw`), so the code shown is the code that runs.
 */
export function Example({
  source,
  children,
  align = 'center',
}: {
  source: string;
  children: ReactNode;
  /** Where the preview sits in its frame: centred, or from the top left. */
  align?: 'center' | 'start';
}) {
  const [view, setView] = useState('preview');
  return (
    <div className="flex min-w-0 flex-col gap-2">
      <Segmented
        aria-label="Show"
        value={view}
        onValueChange={setView}
        className="self-start"
      >
        <SegmentedItem value="preview">Preview</SegmentedItem>
        <SegmentedItem value="code">Code</SegmentedItem>
      </Segmented>
      {view === 'preview' ? (
        <div
          className={cn(
            'flex min-h-48 flex-wrap gap-3 rounded-xl p-6 inset-ring inset-ring-border md:p-10',
            align === 'center'
              ? 'items-center justify-center'
              : 'flex-col items-stretch',
          )}
        >
          {children}
        </div>
      ) : (
        <CodeView code={source.trimEnd()} />
      )}
    </div>
  );
}

/** A file's code, scrolling inside its frame, with a copy button. */
export function CodeView({ code }: { code: string }) {
  return (
    <div className="relative rounded-xl bg-panel">
      <pre className="max-h-128 overflow-auto p-5 pr-12 font-mono text-xs text-foreground scrollbar-subtle">
        <code>{code}</code>
      </pre>
      <div className="absolute top-3 right-3">
        <CopyButton text={code} label="Copy the code" />
      </div>
    </div>
  );
}

export type PropRow = {
  name: string;
  type: string;
  /** The default, as code; none when the prop has no default. */
  default?: string;
  description: string;
};

/** A component's props: name, type, default, and what each one does. */
export function PropsTable({ rows }: { rows: PropRow[] }) {
  return (
    <div className="overflow-x-auto rounded-xl inset-ring inset-ring-border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="pl-5">Prop</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Default</TableHead>
            <TableHead className="pr-5">What it does</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {rows.map((row) => (
            <TableRow key={row.name} className="align-top">
              <TableCell className="py-3 pl-5 font-mono text-xs text-foreground">
                {row.name}
              </TableCell>
              <TableCell className="py-3 font-mono text-xs text-accent">
                {row.type}
              </TableCell>
              <TableCell className="py-3 font-mono text-xs text-muted">
                {row.default ?? ''}
              </TableCell>
              <TableCell className="min-w-64 py-3 pr-5 whitespace-normal text-muted">
                {row.description}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

/** The keys a component answers to, and what each does. */
export function KeysTable({ rows }: { rows: [string, string][] }) {
  return (
    <dl className="flex flex-col border-t">
      {rows.map(([keys, action]) => (
        <div
          key={keys}
          className="grid gap-1 border-b py-3 sm:grid-cols-3 sm:gap-6"
        >
          <dt className="flex flex-wrap gap-1">
            {keys.split(' + ').map((key, index) => (
              <span key={key} className="flex items-center gap-1">
                {index > 0 && <span className="text-xs text-muted">+</span>}
                <kbd className="rounded-sm bg-hover px-1.5 font-mono text-xs text-foreground">
                  {key}
                </kbd>
              </span>
            ))}
          </dt>
          <dd className="text-pretty text-muted sm:col-span-2">{action}</dd>
        </div>
      ))}
    </dl>
  );
}

/** A short list of notes: accessibility, behaviour, limits. */
export function Notes({ items }: { items: ReactNode[] }) {
  return (
    <ul className="flex max-w-2xl list-disc flex-col gap-2 pl-5 text-base text-pretty text-muted marker:text-control">
      {items.map((item, index) => (
        // The notes are fixed text: their order is their identity.
        // biome-ignore lint/suspicious/noArrayIndexKey: a fixed list
        <li key={index}>{item}</li>
      ))}
    </ul>
  );
}

/** One import line, with a copy button. */
export function ImportLine({ code }: { code: string }) {
  return (
    <div className="flex max-w-full items-center gap-2 rounded-lg py-1 pr-1 pl-4 inset-ring inset-ring-border">
      <code className="min-w-0 flex-1 truncate font-mono text-xs text-foreground">
        {code}
      </code>
      <CopyButton text={code} label="Copy the import" />
    </div>
  );
}
