import { GripVerticalIcon } from 'lucide-react';
import {
  type ComponentPropsWithRef,
  createContext,
  type KeyboardEvent,
  type PointerEvent,
  use,
  useId,
  useRef,
  useState,
} from 'react';
import { landing, move, type Span, shifts } from './sortable-order';
import { Tooltip, TooltipContent, TooltipTrigger } from './tooltip';
import { cn } from './utils';

// A list the person puts in order (plan: markpad.md/d/xoi4b6ept6r0; owner,
// 19 Nov 2026). The first use is the column order in a data table's Columns
// menu. A short list in one direction: no drag between lists, no tree, no
// scroll while dragging.
//
// - Mouse and touch: one path, Pointer Events with the pointer captured by
//   the handle. The list still scrolls by touch outside the handle.
// - Keyboard: the handle is a button; with it in focus, Up and Down move the
//   item, and the focus stays on the handle. Escape ends a drag.
// - Screen readers: the handle says what it moves and how; a live region
//   says where the item went ("Email moved to position 3 of 8").
// - Motion: while one item is dragged, the items it passes slide aside with
//   the sheet's easing; reduced motion turns it off. On the drop the new
//   order and the cleared offsets draw at once, so nothing jumps.

/** A drag in progress. */
type Drag = {
  value: string;
  pointerId: number;
  startY: number;
  spans: Span[];
  from: number;
  to: number;
  offset: number;
};

type SortableState = {
  order: readonly string[];
  drag: Drag | null;
  shifted: readonly number[];
  instructionsId: string;
  start: (value: string, event: PointerEvent<HTMLElement>) => void;
  follow: (event: PointerEvent<HTMLElement>) => void;
  drop: (event: PointerEvent<HTMLElement>) => void;
  cancel: () => void;
  step: (value: string, by: -1 | 1) => void;
};

const SortableContext = createContext<SortableState | null>(null);
const ItemContext = createContext<{ value: string; label: string } | null>(
  null,
);

function useSortable() {
  const sortable = use(SortableContext);
  if (!sortable) throw new Error('A sortable part must be inside <Sortable>.');
  return sortable;
}

type SortableProps = Omit<
  ComponentPropsWithRef<'ul'>,
  'defaultValue' | 'onChange'
> & {
  /** The items' values, in their order. */
  value?: readonly string[];
  defaultValue?: readonly string[];
  /** The new order, after a drop or a key press that moved an item. */
  onValueChange?: (order: string[]) => void;
  /** An item's name for the announcement; its `label` by default. */
  describe?: (value: string) => string;
};

function Sortable({
  value: controlled,
  defaultValue = [],
  onValueChange,
  describe,
  className,
  children,
  ...props
}: SortableProps) {
  const [own, setOwn] = useState<readonly string[]>(defaultValue);
  const order = controlled ?? own;
  const [drag, setDrag] = useState<Drag | null>(null);
  const [announcement, setAnnouncement] = useState('');
  const list = useRef<HTMLUListElement>(null);
  const labels = useRef(new Map<string, string>());
  const instructionsId = useId();

  function commit(from: number, to: number) {
    if (from === to) return;
    const next = move(order, from, to);
    const moved = order[from] ?? '';
    const name = describe?.(moved) ?? labels.current.get(moved) ?? moved;
    setOwn(next);
    onValueChange?.(next);
    setAnnouncement(`${name} moved to position ${to + 1} of ${next.length}`);
  }

  const state: SortableState = {
    order,
    drag,
    shifted: drag ? shifts(drag.spans, drag.from, drag.to) : [],
    instructionsId,
    start(value, event) {
      if (event.pointerType === 'mouse' && event.button !== 0) return;
      const from = order.indexOf(value);
      const items = list.current?.querySelectorAll<HTMLElement>(
        ':scope > [data-slot=sortable-item]',
      );
      if (from < 0 || !items) return;
      event.preventDefault();
      event.currentTarget.setPointerCapture(event.pointerId);
      const spans = [...items].map((item) => {
        const rect = item.getBoundingClientRect();
        return { top: rect.top, height: rect.height };
      });
      setDrag({
        value,
        pointerId: event.pointerId,
        startY: event.clientY,
        spans,
        from,
        to: from,
        offset: 0,
      });
    },
    follow(event) {
      if (!drag || event.pointerId !== drag.pointerId) return;
      const offset = event.clientY - drag.startY;
      setDrag({ ...drag, offset, to: landing(drag.spans, drag.from, offset) });
    },
    drop(event) {
      if (!drag || event.pointerId !== drag.pointerId) return;
      // In one render: the new order, and no offsets or animation.
      setDrag(null);
      commit(drag.from, drag.to);
    },
    cancel() {
      setDrag(null);
    },
    step(value, by) {
      const from = order.indexOf(value);
      const to = from + by;
      if (from < 0 || to < 0 || to >= order.length) return;
      commit(from, to);
    },
  };

  return (
    <SortableContext value={state}>
      <LabelsContext value={labels.current}>
        <ul
          ref={list}
          data-slot="sortable"
          data-dragging={drag ? '' : undefined}
          className={cn('flex flex-col', className)}
          {...props}
        >
          {children}
        </ul>
      </LabelsContext>
      <span id={instructionsId} hidden>
        Drag to move, or press Up or Down.
      </span>
      <span role="status" aria-live="polite" className="sr-only">
        {announcement}
      </span>
    </SortableContext>
  );
}

/** Each item's label, for the announcement, by value. */
const LabelsContext = createContext<Map<string, string> | null>(null);

type SortableItemProps = ComponentPropsWithRef<'li'> & {
  value: string;
  /** What the item is called: the handle's name and the announcement. */
  label: string;
};

function SortableItem({
  value,
  label,
  className,
  style,
  children,
  ...props
}: SortableItemProps) {
  const sortable = useSortable();
  const labels = use(LabelsContext);
  labels?.set(value, label);
  const index = sortable.order.indexOf(value);
  const dragged = sortable.drag?.value === value;
  const moving = sortable.drag !== null;
  const y = dragged
    ? (sortable.drag?.offset ?? 0)
    : (sortable.shifted[index] ?? 0);
  return (
    <ItemContext value={{ value, label }}>
      <li
        data-slot="sortable-item"
        data-dragged={dragged ? '' : undefined}
        className={cn(
          'relative flex items-center gap-2',
          // The others slide aside; the dragged one follows the pointer.
          moving &&
            !dragged &&
            'transition-transform duration-200 ease-sheet motion-reduce:transition-none',
          dragged && 'z-10 rounded-md bg-raised shadow-md',
          className,
        )}
        style={y ? { ...style, translate: `0 ${y}px` } : style}
        {...props}
      >
        {children}
      </li>
    </ItemContext>
  );
}

type SortableHandleProps = Omit<ComponentPropsWithRef<'button'>, 'children'> & {
  /** The tooltip; says how to move by default. */
  hint?: string;
};

function SortableHandle({
  className,
  hint = 'Drag, or press Up or Down',
  ...props
}: SortableHandleProps) {
  const sortable = useSortable();
  const item = use(ItemContext);
  if (!item)
    throw new Error('A sortable handle must be inside <SortableItem>.');
  const value = item.value;
  const dragged = sortable.drag?.value === value;

  function onKeyDown(event: KeyboardEvent<HTMLButtonElement>) {
    if (event.key === 'Escape' && sortable.drag) {
      event.preventDefault();
      sortable.cancel();
      return;
    }
    const by = event.key === 'ArrowUp' ? -1 : event.key === 'ArrowDown' ? 1 : 0;
    if (!by) return;
    event.preventDefault();
    const handle = event.currentTarget;
    sortable.step(value, by);
    // React moves the item's node to its new place; keep the focus on it.
    requestAnimationFrame(() => handle.focus());
  }

  return (
    <Tooltip>
      <TooltipTrigger
        type="button"
        data-slot="sortable-handle"
        aria-label={`Move ${item.label}`}
        aria-describedby={sortable.instructionsId}
        className={cn(
          'grid size-7 shrink-0 touch-none place-items-center rounded-md text-muted outline-none hover:bg-hover hover:text-foreground focus-visible:focus-ring [&>svg]:size-4',
          dragged ? 'cursor-grabbing' : 'cursor-grab',
          className,
        )}
        onPointerDown={(event: PointerEvent<HTMLElement>) =>
          sortable.start(value, event)
        }
        onPointerMove={sortable.follow}
        onPointerUp={sortable.drop}
        onPointerCancel={sortable.cancel}
        onKeyDown={onKeyDown}
        {...props}
      >
        <GripVerticalIcon strokeWidth={1.5} aria-hidden />
      </TooltipTrigger>
      <TooltipContent>{hint}</TooltipContent>
    </Tooltip>
  );
}

export { Sortable, SortableHandle, SortableItem };
