import { Button } from '@omuk/ui/button';
import { cn } from '@omuk/ui/utils';
import { useCallback, useRef, useState } from 'react';

// The hero's spec drawing: two Save buttons, shown twice their size, each
// with a dimension line over it. Press either: both load for a moment. The
// first swaps its label for "Saving…", as most buttons do: its line
// stretches and turns red, and Cancel is pushed aside. The second is Omuk
// UI's Button with `isLoading`: the label stays in the layout, hidden, and
// the line holds. The widths are measured live, in CSS pixels.

/** How long a press of Save loads. */
const PRESS_MS = 2400;

/**
 * A node's width in whole CSS pixels, kept up to date, and its width the
 * last time it was at rest (no `data-loading` on the node).
 */
function useWidths() {
  const [width, setWidth] = useState(0);
  const [rest, setRest] = useState(0);
  const ref = useCallback((node: HTMLElement | null) => {
    if (!node) return;
    const observer = new ResizeObserver(() => {
      const next = node.offsetWidth;
      setWidth(next);
      if (node.dataset.loading !== 'true') setRest(next);
    });
    observer.observe(node);
    return () => observer.disconnect();
  }, []);
  return { ref, width, rest };
}

export function SizeDemo() {
  const [loading, setLoading] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined);

  function press() {
    clearTimeout(timer.current);
    setLoading(true);
    timer.current = setTimeout(() => setLoading(false), PRESS_MS);
  }

  return (
    <figure className="overflow-hidden rounded-xl bg-panel">
      <div className="ruler h-5 border-b" aria-hidden />
      <div className="grid divide-y md:grid-cols-2 md:divide-x md:divide-y-0">
        <Specimen
          title="A button that swaps its label"
          note="Most kits do this. The button grows while it saves, and the page around it moves."
          loading={loading}
          render={(isLoading) => (
            <Button disabled={isLoading} onClick={press}>
              {isLoading ? 'Saving…' : 'Save'}
            </Button>
          )}
        />
        <Specimen
          title="Omuk UI’s Button"
          note="The label stays in the layout, hidden, and the spinner sits on top. Nothing moves."
          loading={loading}
          render={(isLoading) => (
            <Button isLoading={isLoading} loadingLabel="Saving" onClick={press}>
              Save
            </Button>
          )}
        />
      </div>
      <figcaption className="border-t px-6 py-4 text-sm text-muted">
        Press either Save button. Both load for two seconds. The widths are
        measured live from the page, not drawn.
      </figcaption>
    </figure>
  );
}

function Specimen({
  title,
  note,
  loading,
  render,
}: {
  title: string;
  note: string;
  loading: boolean;
  render: (loading: boolean) => React.ReactNode;
}) {
  const { ref, width, rest } = useWidths();
  const grew = loading && rest > 0 && width !== rest;
  return (
    <div className="flex flex-col justify-between gap-10 p-6 md:p-8">
      <div className="magnify flex items-end gap-2">
        <div
          ref={ref}
          data-loading={loading}
          className="flex flex-col items-stretch gap-1"
        >
          <Dimension value={width} grew={grew} />
          {render(loading)}
        </div>
        <Button variant="ghost" tabIndex={-1}>
          Cancel
        </Button>
      </div>
      <div className="flex flex-col gap-1">
        <p className="font-medium text-foreground">{title}</p>
        <p className="max-w-sm text-pretty text-muted">{note}</p>
        <p
          className={cn(
            'pt-2 font-mono text-xs tabular-nums',
            grew ? 'text-danger' : 'text-muted',
          )}
          aria-live="polite"
        >
          {rest > 0 && `At rest ${rest} px.`}
          {loading && ` Loading ${width} px.`}
        </p>
      </div>
    </div>
  );
}

/** A dimension line the width of its parent, with the width written on it. */
function Dimension({ value, grew }: { value: number; grew: boolean }) {
  return (
    <div
      className={cn(
        'dimension flex h-3 items-center justify-center transition-colors',
        grew ? 'text-danger' : 'text-accent',
      )}
      aria-hidden
    >
      <span className="bg-panel px-1 font-mono text-2xs tabular-nums">
        {value > 0 ? value : ''}
      </span>
    </div>
  );
}
