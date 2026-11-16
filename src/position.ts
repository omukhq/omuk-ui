// Places a popup beside its anchor, as Base UI's positioner does: on the
// side asked for, flipped to the other side when it doesn't fit, shifted
// along the edge to stay in the window, and with the CSS variables the root
// class strings read (--anchor-width, --available-height,
// --transform-origin). A script and not CSS anchor positioning: the classes
// need to know the side it landed on (data-side), which CSS can't report.

export type Side =
  | 'top'
  | 'bottom'
  | 'left'
  | 'right'
  | 'inline-start'
  | 'inline-end';
export type Align = 'start' | 'center' | 'end';

export type Placement = {
  side: Side;
  align: Align;
  sideOffset: number;
  alignOffset: number;
};

/** A box in window coordinates: an element's, or a pointer's (no size). */
export type Box = { top: number; left: number; width: number; height: number };

/** Base UI's collision padding: how near the window's edge a popup may go. */
const EDGE = 5;

const OPPOSITE = {
  top: 'bottom',
  bottom: 'top',
  left: 'right',
  right: 'left',
  'inline-start': 'inline-end',
  'inline-end': 'inline-start',
} as const;

function physical(side: Side) {
  const rtl = document.documentElement.dir === 'rtl';
  if (side === 'inline-start') return rtl ? 'right' : 'left';
  if (side === 'inline-end') return rtl ? 'left' : 'right';
  return side;
}

function clamp(value: number, min: number, max: number) {
  return Math.max(min, Math.min(value, max));
}

function px(value: number) {
  return `${value}px`;
}

/** On whole device pixels, as floating-ui places, so edges stay sharp. */
function snap(value: number) {
  const ratio = window.devicePixelRatio || 1;
  return Math.round(value * ratio) / ratio;
}

/**
 * Moves `positioner` (a fixed, top-layer box around the popup) beside
 * `anchor`, and marks every `[data-side]` inside it with the side it took.
 */
export function place(positioner: HTMLElement, anchor: Box, at: Placement) {
  const style = positioner.style;
  const width = document.documentElement.clientWidth;
  const height = document.documentElement.clientHeight;
  const space = {
    top: anchor.top - EDGE,
    bottom: height - anchor.top - anchor.height - EDGE,
    left: anchor.left - EDGE,
    right: width - anchor.left - anchor.width - EDGE,
  };
  style.setProperty('--anchor-width', px(anchor.width));
  style.setProperty('--anchor-height', px(anchor.height));
  style.setProperty('--available-width', px(width - 2 * EDGE));

  let side = at.side;
  let edge = physical(side);
  const vertical = edge === 'top' || edge === 'bottom';
  function measure(available: number) {
    style.setProperty('--available-height', px(available));
    return { w: positioner.offsetWidth, h: positioner.offsetHeight };
  }
  // Its own size first, with the window's room: measured already squeezed
  // into the asked side's room, a list always "fits" there (shrunk to a
  // row or two) and never flips.
  const natural = measure(height - 2 * EDGE);
  const need = (vertical ? natural.h : natural.w) + at.sideOffset;
  const flipped = OPPOSITE[side];
  // As floating-ui's flip: the other side, when this one is too small for
  // it and that one has more room.
  if (need > space[edge] && space[physical(flipped)] > space[edge]) {
    side = flipped;
    edge = physical(side);
  }
  const { w, h } = vertical ? measure(space[edge] - at.sideOffset) : natural;
  const inverted = at.align === 'end' ? -1 : 1;
  let top: number;
  let left: number;
  if (vertical) {
    top =
      edge === 'bottom'
        ? anchor.top + anchor.height + at.sideOffset
        : anchor.top - at.sideOffset - h;
    const start =
      at.align === 'start'
        ? anchor.left
        : at.align === 'end'
          ? anchor.left + anchor.width - w
          : anchor.left + (anchor.width - w) / 2;
    left = clamp(start + at.alignOffset * inverted, EDGE, width - w - EDGE);
  } else {
    left =
      edge === 'right'
        ? anchor.left + anchor.width + at.sideOffset
        : anchor.left - at.sideOffset - w;
    const start =
      at.align === 'start'
        ? anchor.top
        : at.align === 'end'
          ? anchor.top + anchor.height - h
          : anchor.top + (anchor.height - h) / 2;
    top = clamp(start + at.alignOffset * inverted, EDGE, height - h - EDGE);
  }
  left = snap(left);
  top = snap(top);
  style.left = px(left);
  style.top = px(top);

  // Where the anchor is, seen from the popup: it grows from there.
  const centerX = anchor.left + anchor.width / 2 - left;
  const centerY = anchor.top + anchor.height / 2 - top;
  const origin = vertical
    ? `${px(clamp(centerX, 0, w))} ${px(edge === 'bottom' ? -at.sideOffset : h + at.sideOffset)}`
    : `${px(edge === 'right' ? -at.sideOffset : w + at.sideOffset)} ${px(clamp(centerY, 0, h))}`;
  style.setProperty('--transform-origin', origin);

  for (const part of positioner.querySelectorAll<HTMLElement>('[data-side]')) {
    part.dataset.side = side;
    // A tooltip's arrow points at the anchor's middle.
    if (part.dataset.arrow !== undefined && vertical) {
      part.style.left = px(centerX - part.offsetWidth / 2);
    }
  }
}

/** The element's box, for `place`. */
export function boxOf(element: Element): Box {
  const { top, left, width, height } = element.getBoundingClientRect();
  return { top, left, width, height };
}
