// The arithmetic behind <Sortable> (./sortable.tsx), kept apart so it can be
// tested without a browser: a new order after one move, and where a dragged
// item would land.

/**
 * The order after the item at `from` moves to `to`. The other items keep
 * their order; an index outside the list leaves the order as it is.
 */
export function move<T>(order: readonly T[], from: number, to: number): T[] {
  const next = [...order];
  if (from < 0 || from >= next.length || to < 0 || to >= next.length) {
    return next;
  }
  const [item] = next.splice(from, 1);
  if (item === undefined) return [...order];
  next.splice(to, 0, item);
  return next;
}

/** An item's place on screen when the drag starts: its top and height. */
export type Span = { top: number; height: number };

/**
 * Where the dragged item lands: the index of the last item whose middle it
 * has passed, moving down, or the first, moving up. `offset` is how far the
 * pointer has moved since the drag started.
 */
export function landing(
  spans: readonly Span[],
  from: number,
  offset: number,
): number {
  const dragged = spans[from];
  if (!dragged) return from;
  const middle = dragged.top + dragged.height / 2 + offset;
  let to = from;
  spans.forEach((span, index) => {
    const theirs = span.top + span.height / 2;
    if (index > from && middle > theirs) to = Math.max(to, index);
    if (index < from && middle < theirs) to = Math.min(to, index);
  });
  return to;
}

/**
 * How far each item moves aside while one is dragged from `from` to `to`:
 * the items it passes step by its height and the gap after it; the others
 * stay. The dragged item follows the pointer, so it is 0 here.
 */
export function shifts(
  spans: readonly Span[],
  from: number,
  to: number,
): number[] {
  const dragged = spans[from];
  const next = spans[from + 1] ?? spans[from - 1];
  if (!dragged) return spans.map(() => 0);
  // The gap between two items, from the pair next to the dragged one.
  const gap = next
    ? Math.max(
        0,
        Math.abs(next.top - dragged.top) -
          (next.top > dragged.top ? dragged.height : next.height),
      )
    : 0;
  const step = dragged.height + gap;
  return spans.map((_, index) => {
    if (to > from && index > from && index <= to) return -step;
    if (to < from && index < from && index >= to) return step;
    return 0;
  });
}
