// The design system's recipes (DESIGN.md, section 3) that more than one
// omuk-ui component draws: the field's box, the floating surface, the menu
// row and its parts. One string each, so a select, a combobox, a dropdown
// and a context menu cannot drift apart.
//
// Edges are inset shadows (`inset-ring inset-ring-border`, `edge-control inset-ring-control`, …). Tailwind writes a
// variant's rule after the plain one, and `aria-*` after `focus-visible`, so
// a state that changes the edge AND can take the focus repeats the focus
// ring under its own variant (`aria-checked:focus-visible:focus-ring`).

/** The one focus treatment: the accent edge and the mark ring. */
export const FOCUS = 'outline-none focus-visible:focus-ring';

/** Disabled is a state, never a fade: hover fill, `inset-ring inset-ring-border`, muted text. */
export const DISABLED =
  'disabled:cursor-not-allowed disabled:bg-hover disabled:text-muted disabled:inset-ring disabled:inset-ring-border';

/**
 * A field's text, without its box: the input inside an input group. No
 * size here: theme.css gives every field 14 (owner, 18 Nov 2026; phones had
 * 16, which keeps an iPhone from zooming in on focus).
 */
export const FIELD_TEXT =
  'w-full min-w-0 bg-transparent text-foreground outline-none placeholder:text-muted';

/** A field's text when disabled: added only then, by the part that knows. */
export const FIELD_TEXT_OFF = 'cursor-not-allowed text-muted';

/**
 * A field's edge (DESIGN.md, section 3, Field; decisions R6, R10): the
 * 2-wide `control` edge, as React Spectrum's field (owner, 18 Nov 2026;
 * 1-wide from alpha.2 to alpha.10), the same on hover (owner: no hover
 * edge on fields), the field's focus ring on focus, and the 2-wide danger
 * edge for `aria-invalid`, which keeps the ring when focused. A native
 * check (`required`, `type="email"`, `pattern`) shows the same edge once
 * the person has changed the field or sent the form (`:user-invalid`), not
 * at page load (Modern Web Guidance, validate-input-after-interaction).
 */
export const FIELD_EDGE =
  'edge-control inset-ring-control focus:focus-ring aria-invalid:inset-ring-danger user-invalid:inset-ring-danger';

/**
 * The same edge on a box that holds the field (input group, chips). The
 * ring comes with the TEXT having focus, not with focus anywhere inside:
 * a trailing button (show password, clear, copy) focused by keyboard draws
 * its own ring, and the field never rings at the same time (DESIGN.md,
 * Field with a trailing action).
 */
export const FIELD_WRAPPER_EDGE = [
  'edge-control inset-ring-control has-aria-invalid:inset-ring-danger has-user-invalid:inset-ring-danger',
  'has-[input:focus-visible,textarea:focus-visible]:focus-ring', // design-ok: a selector, not a value (owner: field with a trailing action)
].join(' ');

/**
 * A one-line field's height: the Button's heights (owner, 24 Nov 2026), so
 * a field and a button of one size line up; the middle one is `md`, the
 * default (owner: not "default"). The text stays the
 * field's 14 at every size (16 on phones, theme.css), so no size makes an
 * iPhone zoom in.
 */
export const FIELD_SIZE = {
  xs: 'h-6',
  sm: 'h-7',
  md: 'h-8',
  lg: 'h-9',
} as const;

export type FieldSize = keyof typeof FIELD_SIZE;

/**
 * A field's box: input, textarea, select trigger. Its height is the
 * caller's (FIELD_SIZE for one line).
 */
// Disabled keeps the field's 2-wide edge, in the border colour.
export const FIELD = `${FIELD_TEXT} rounded-md bg-page transition-shadow ${FIELD_EDGE}`;

/**
 * A field when disabled (the hover fill, the 2-wide border edge, muted
 * text): added only then, by the part that knows (owner, 18 Nov 2026).
 */
export const FIELD_OFF =
  'cursor-not-allowed bg-hover text-muted edge-control inset-ring-border';

/**
 * Popovers, menus and lists that float: page ground, small shadow; an
 * outline in forced colours, where the shadow is gone (`forced-edge`).
 */
export const SURFACE =
  'rounded-lg bg-page p-1 text-sm text-foreground shadow-sm forced-edge';

/** How a floating surface comes and goes. */
export const POP =
  'origin-(--transform-origin) outline-none duration-100 data-open:animate-in data-open:fade-in-0 data-open:zoom-in-95 data-closed:animate-out data-closed:fade-out-0 data-closed:zoom-out-95';

/**
 * A menu row (menus, select and combobox options): 36 tall, an icon slot at
 * the start, the hover fill for the pointer and the keyboard alike. Grows
 * for a two-line row (`OptionText`).
 */
export const ROW =
  "relative flex min-h-9 w-full cursor-default items-center gap-2 rounded-md px-3 py-2 text-sm text-foreground outline-none select-none focus:bg-hover data-highlighted:bg-hover data-disabled:pointer-events-none data-disabled:text-muted [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4";

/**
 * A combobox option: the text first, the tick slot at the end (`TICK_SLOT`,
 * kept when empty, so the rows line up); one or two lines.
 */
export const OPTION_ROW = ROW;

/** An inset row lines its text up with the rows that have an icon. */
export const INSET = 'before:size-4 before:shrink-0';

/** A menu's section label: sentence case, small, muted. */
export const SECTION_LABEL = 'px-3 pt-2 pb-1 text-xs font-medium text-muted';

/** The line between a menu's groups. */
export const MENU_SEPARATOR = 'mx-2 my-1 h-px bg-border';

/** A shortcut at the end of a row: plain text, small, muted. */
export const SHORTCUT = 'ml-auto pl-4 text-xs text-muted';

/** The tick's slot: an icon wide, the accent tick inside when picked. */
export const TICK_SLOT =
  'pointer-events-none flex size-4 shrink-0 items-center justify-center text-accent';

/**
 * A chip in a field (invite emails): small, the hover fill, an `x` to
 * remove it. The field grows to fit the chips.
 */
export const CHIP =
  'inline-flex h-6 w-fit shrink-0 items-center gap-1 rounded-sm bg-hover px-2 text-sm whitespace-nowrap text-foreground';

/**
 * A modal's look: dialogs, alert dialogs (DESIGN.md, section 3, Dialog):
 * `p-6 rounded-xl bg-page shadow-lg gap-4`.
 */
export const MODAL_BOX =
  'grid gap-4 rounded-xl bg-page p-6 text-sm text-foreground shadow-lg forced-edge';

/** A modal: its look, centred, 16 from the window's sides on a phone. */
export const MODAL = `${MODAL_BOX} fixed inset-x-4 top-1/2 z-50 mx-auto w-auto -translate-y-1/2 outline-none duration-100 data-open:animate-in data-open:fade-in-0 data-open:zoom-in-95 data-closed:animate-out data-closed:fade-out-0 data-closed:zoom-out-95`;

/**
 * The veil behind a modal: `bg-scrim`, the one value for dialogs, drawers
 * and sheets (DESIGN.md, section 2; 32% black, 60% in dark).
 */
export const SCRIM =
  'fixed inset-0 isolate z-50 bg-scrim duration-100 data-open:animate-in data-open:fade-in-0 data-closed:animate-out data-closed:fade-out-0';

/** A modal's title and description. */
export const MODAL_TITLE = 'text-lg leading-tight font-semibold';
export const MODAL_DESCRIPTION =
  'text-sm text-muted [&_a]:text-accent [&_a]:underline [&_a]:underline-offset-4';

/**
 * Tooltip (DESIGN.md, section 3): `px-2 py-1 rounded-md bg-primary
 * text-on-primary text-xs`; a shortcut after the text in the outline colour.
 */
export const TOOLTIP =
  'inline-flex w-fit max-w-xs items-center gap-2 rounded-md bg-primary px-2 py-1 text-xs text-on-primary forced-edge [&_kbd]:text-outline';
