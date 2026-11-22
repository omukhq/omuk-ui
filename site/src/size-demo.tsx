import { Button } from '@omuk/ui/button';
import { Switch } from '@omuk/ui/switch';
import { useCallback, useId, useRef, useState } from 'react';

// Promise 1, live: the same Save button twice. The first swaps its label
// for "Saving…", as most buttons do, and grows; the button beside it moves.
// The second is Omuk UI's Button with `isLoading`: the label stays in the
// layout, hidden, and the spinner sits over it. Each shows its width.

/** How long a press of Save loads. */
const PRESS_MS = 1800;

/** A node's width in whole pixels, kept up to date (a ResizeObserver). */
function useWidth() {
  const [width, setWidth] = useState(0);
  const ref = useCallback((node: HTMLElement | null) => {
    if (!node) return;
    const observer = new ResizeObserver(() =>
      setWidth(Math.round(node.getBoundingClientRect().width)),
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, []);
  return [ref, width] as const;
}

export function SizeDemo() {
  const [loading, setLoading] = useState(false);
  const [rest, setRest] = useState({ swap: 0, kit: 0 });
  const [swapRef, swapWidth] = useWidth();
  const [kitRef, kitWidth] = useWidth();
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined);
  const switchId = useId();

  function hold(on: boolean) {
    clearTimeout(timer.current);
    // The widths at rest, read before the change, to compare against.
    if (on && !loading) setRest({ swap: swapWidth, kit: kitWidth });
    setLoading(on);
  }

  function press() {
    hold(true);
    timer.current = setTimeout(() => setLoading(false), PRESS_MS);
  }

  return (
    <div className="flex flex-col gap-4 rounded-xl bg-panel p-4 sm:p-6">
      <Row
        title="A label that changes"
        note="Most buttons swap the text. The button grows, and Cancel moves."
        width={swapWidth}
        rest={loading ? rest.swap : null}
      >
        <Button ref={swapRef} disabled={loading} onClick={press}>
          {loading ? 'Saving…' : 'Save'}
        </Button>
        <Button variant="ghost">Cancel</Button>
      </Row>
      <Row
        title="Omuk UI"
        note="The label stays in place, hidden, and the spinner sits over it."
        width={kitWidth}
        rest={loading ? rest.kit : null}
      >
        <Button
          ref={kitRef}
          isLoading={loading}
          loadingLabel="Saving"
          onClick={press}
        >
          Save
        </Button>
        <Button variant="ghost">Cancel</Button>
      </Row>
      <div className="flex items-center gap-3 border-t pt-4">
        <Switch
          id={switchId}
          checked={loading}
          onCheckedChange={(checked) => hold(checked)}
        />
        <label htmlFor={switchId} className="text-sm text-foreground">
          Keep both buttons loading
        </label>
      </div>
    </div>
  );
}

function Row({
  title,
  note,
  width,
  rest,
  children,
}: {
  title: string;
  note: string;
  width: number;
  /** The width at rest while loading, or null at rest. */
  rest: number | null;
  children: React.ReactNode;
}) {
  const grew = rest !== null && width !== rest;
  return (
    <div className="flex flex-col gap-3 rounded-lg bg-raised p-4 shadow-sm">
      <div className="flex flex-col gap-0.5">
        <p className="font-medium text-foreground">{title}</p>
        <p className="text-xs text-muted">{note}</p>
      </div>
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-2">{children}</div>
        <p
          className={
            grew
              ? 'font-mono text-xs text-danger tabular-nums'
              : 'font-mono text-xs text-muted tabular-nums'
          }
          aria-live="polite"
        >
          {width > 0 ? `${width} px` : ''}
          {rest !== null && (grew ? `, was ${rest}` : ', the same')}
        </p>
      </div>
    </div>
  );
}
