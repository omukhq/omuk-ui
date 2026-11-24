# Omuk UI design system

The rules every Omuk UI component follows, and that an app built with it should follow too. The tokens live in
`src/design/theme.css`; the fonts in `src/design/fonts.css`. Each component's behaviour is in
[design-guide.md](design-guide.md).

**If something you need is not here, stop and ask. Do not invent a value.**

---

## 1. Hard rules

1. **No raw values in components.** No hex, rgb, px, rem or arbitrary Tailwind values (`p-[13px]`,
   `bg-[#eee]`, `shadow-[…]`). Only the theme's classes. `theme.css` is the only file with raw values.
2. **Spacing steps** (padding, margin, gap): `0.5 1 2 3 4 6 8 12 16` (2, 4, 8, 12, 16, 24, 32, 48, 64 px). Never 5, 7, 9, 10, 11, 14.
   Heights and square sizes have their own list (rule 3).
3. **Heights:** Tailwind's own sizes, nothing custom: `h-9` 36 (large buttons, menu rows, table headers) ·
   `h-8` 32 (default buttons and every field: input, select, combobox, the date picker, input group; segmented
   controls, tabs, dialog buttons, icon buttons, OTP digits; headers, filter rows, list rows) · `h-7` 28 (toolbars) ·
   `h-6` 24 (row actions and chips in dense lists and tables only). Square buttons use `size-*` with the same
   numbers. Components expose these as `size="lg|md|sm|xs"` (36 / 32 / 28 / 24, icon-only
   `icon-lg|icon|icon-sm|icon-xs`); only the component maps name → class. Every component's default size is `md`;
   no size is named `default` (owner, 24 Nov 2026). A
   default button and a field are the same height, so they line up side by side (owner, 24 Nov 2026). 32 is also
   the height of list rows and calendar days.
   Never a form or dialog button below md.
   On touch screens an `h-6` control keeps a 32 hit area (padding or a pseudo-element).
4. **Type:** six sizes only (`text-xs sm base lg xl 2xl` = 12 14 16 20 24 32). Interface text is line height 1.5
   (built into xs, sm, base); lg and up are 1.25. Weights: 600 for titles, 500 for controls, labels and the current
   item, 400 for body text. Nothing else.
   Fields are 14 (`text-sm`) at every width. An iPhone zooms in when such a field takes the focus.
5. **Icons:** Lucide only (`lucide-react`), `size-4` (16), `strokeWidth={1.5}`, `currentColor`. No unicode glyphs or
   hand-drawn SVG as icons. Keyboard shortcuts stay text: `⌘P`.
6. **Shadows:** `shadow-sm` for everything that floats (cards, menus, popovers, dropdowns, toolbars, the chosen
   segment). `shadow-lg` only for dialogs and toasts. Shadows never contain a border.
7. **Edges are Tailwind inset rings; dividers are Tailwind borders.** Inset rings never change a control's size.
   Two weights: 1px `inset-ring inset-ring-border` for things you look at (cards, popovers, table frames);
   2px `edge-control inset-ring-control` for fields, outlined buttons and anything you tick (checkboxes, radios,
   the switch). `edge-control` is `inset-ring-2` with its width from the `--edge-control` token (2px): set it to
   1px in the app's stylesheet and every control's edge thins at once (owner, 24 Nov 2026).
   Change only the colour for states: `hover:inset-ring-outline`, `aria-invalid:inset-ring-danger`, picked `inset-ring-accent`.
   Dividers between areas and rows: `border-t` / `border-b` / `border-l` / `border-r` (1px, the border colour is the default).
   Never a full `border` or `border-2` around a control. Selected tab: `border-b-2 border-accent`.
8. **Radius nests:** the outer corner is one size rounder than the inner one. Row `rounded-md` (6) in a menu with
   `p-1` → menu `rounded-lg` (8). Tailwind's scale: `sm` 4, `md` 6, `lg` 8, `xl` 12.
   Card `rounded-lg` in a dialog → dialog `rounded-xl`.
9. **Dark mode** is `data-theme="dark"` on `<html>`. App chrome never writes `dark:` colour pairs: roles swap by themselves.
   The one exception is palette colours in tag, badge, label, avatar and chart components, which write both modes
   (`bg-teal-100 text-teal-800 dark:bg-teal-900 dark:text-teal-200`). Otherwise `dark:` only for a change of shape, almost never.
10. **App chrome uses roles only.** Palette shades don't switch in dark mode, roles do: `text-blue-600` where
    `text-accent` is meant breaks in dark mode. Palette classes belong only in tag, badge, label, avatar and chart
    components.
11. **Labels are sentence case.** No uppercase or letter-spaced section labels.
12. **The root font size stays 16px.** The 14px interface size is on `body`. Never set `font-size` on `html`.

## 2. Colour: palette, then roles

**Palette.** Tailwind's own, 11 families × 11 shades (50–950): `gray red orange amber yellow green teal sky blue violet
pink`, plus `white` and `black`: `bg-red-100`, `text-blue-600`, `border-gray-200`, `inset-ring-teal-500`.
Tailwind's other families (slate, zinc, rose …) are off. Omuk UI defines no palette value: only the roles below. Two
roles take a darker shade than Tailwind's usual one, for contrast: success is `green-700` (4.9:1; `green-600` is 3.2:1),
the hover edge is `gray-500` (4.8:1; `gray-400` is 2.6:1).

**Roles** are what an app's chrome uses, and they point at palette shades (light → dark):
page white → gray-800 · panel gray-50 → gray-900 · raised white → gray-700 · border gray-100 → white 10% · control gray-200 → white 16% ·
outline gray-500 → gray-400 · foreground gray-950 → gray-100 · muted gray-600 → gray-300 · primary gray-950 → gray-100 ·
accent blue-600 → blue-300 · mark blue-100 → blue-950 · danger red-600 → red-300 · success green-700 → green-400 ·
warning amber-700 → amber-400 · chart-1/2/3 blue-600/orange-500/teal-500 (dark: blue-500/orange-500/teal-500).

- Surfaces, text, edges and states → roles (`bg-page`, `text-foreground`, `bg-accent`): they flip in dark mode by themselves.
- Things with no role → palette, with both modes written (the rule 9 exception): tags and labels
  (`bg-teal-100 text-teal-800 dark:bg-teal-900 dark:text-teal-200`), team colours (any family at 600 with
  `text-white`, never blue or red), illustrations, chart series beyond three.
- Never a hex value outside `theme.css`.

### Roles

| Class | Job |
|---|---|
| `bg-page` | The main surface, sidebars and side panels (with a divider), menus, popovers, dialogs |
| `bg-panel` | The ground behind cards: dashboard card grids, auth pages, inline code and code blocks. The only grey surface. Never under list rows. |
| `bg-raised` | Surfaces above the ground: cards, popovers, the chosen segment. Always with `shadow-sm`. In dark mode raised is lighter than panel, which is lighter than page: lighter means closer. |
| `bg-hover` | The row or ghost button under the pointer, and keyboard-highlighted options. A tint, so it works on page and panel. |
| `bg-selected` | Toggles that are on, applied filters and selected table rows. A neutral 8% tint (twice hover's 4%), so selection is grey; the ticked checkbox carries the accent. |
| `bg-scrim` | Behind dialogs, drawers and sheets. One value: 32% black, 60% in dark. |
| `border` | 1px lines: `inset-ring inset-ring-border` around cards, popovers and table frames; `border-t/b/l/r` for dividers (default colour) |
| `control` (`edge-control inset-ring-control`) | At rest: a light 2px edge on fields, outlined buttons, checkboxes and radios. |
| `outline` (`hover:inset-ring-outline`) | The same 2px edge on hover, darker (3:1): fields, checkboxes, radios. An outlined button takes `bg-hover` instead. |
| `text-foreground` / `text-muted` | Main text / hints, meta, labels, timestamps |
| `bg-primary text-on-primary` | Primary button, tooltip, toast |
| `text-accent` | Links, caret, ticks, picked values, chart series 1 |
| `bg-mark` | Highlights, added text in a history, plan badges |
| `bg-found` | The words a search found, in its results: yellow (`yellow-200`, `yellow-800` in dark) |
| `text-danger / success / warning` | Delete and errors / done, live, connected / check this |

**Four states, four treatments. Never mix them:**
- **Hover** → `bg-hover`.
- **Where you are** in a list (the current page or item) → `bg-selected font-medium`, no shadow, no bar. In a segmented
  control the chosen segment is `bg-raised shadow-sm`.
- **Picked value** (checkbox, radio, select option, tab) → accent: tick, fill, `edge-control inset-ring-accent` or a 2px underline.
- **On toggle** → `bg-selected`.

**Focus** is the same on every control: `focus-visible:focus-ring` (an `outline` edge as wide as `--edge-control`, 2px or 1px when edges are thin, + 3px `control` halo: grey, not the accent).
**Fixed sizes** (owner, 24 Nov 2026): an app may change Tailwind's `--spacing` for a tighter or looser layout. Icons
(every SVG, by a base rule), checkboxes, radios and switches (`fixed-size`) keep their size: they measure with
`--grid-unit`, Tailwind's own 4px unit (theme.css).

An invalid field (`aria-invalid`) keeps red when focused: a `danger` edge and a `danger-ring` halo (owner, 24 Nov 2026).
## 3. Components

Recipes are Tailwind classes; `{}` marks a variant. The components already follow them: change a recipe here and in
the component together.

### Button
- Base: `inline-flex items-center gap-2 rounded-md font-medium focus-visible:focus-ring`
- Size prop → classes: lg `h-9 px-4` · md, the default, `h-8 px-3` (32; Tailwind's own heights, no custom one; named md as the fields' sizes, owner 24 Nov 2026) · sm `h-7 px-2 text-xs` (the base `rounded-md`, owner 23 Nov 2026) · xs `h-6 px-2 text-xs`.
  Icon-only: `icon-lg/icon/icon-sm/icon-xs`, `size-9/8/7/6 p-0`, so the 16 icon stays 16.
  With a leading icon, the left padding drops one step (`pl-3` / `pl-2`).
- Variant:
  - primary `bg-primary text-on-primary`: one per surface
  - secondary `bg-page edge-control inset-ring-control hover:bg-hover text-foreground`: dialogs and forms (2px edge).
    On hover the edge stays and a light grey fill comes in (owner, 24 Nov 2026).
  - ghost `bg-transparent text-foreground hover:bg-hover`: toolbars, headers, menus; pressed: `bg-selected` + `aria-pressed`
  - danger `bg-danger-tint text-danger hover:bg-danger-tint-hover`, no edge (owner, 24 Nov 2026): a destructive
    action offered; red text on a solid red tint (red-100, red-200 on hover; red-950 and red-900 in dark mode)
  - danger-confirm `bg-danger text-on-primary`: only the last step of a destructive dialog
- Disabled: primary, secondary and danger → `bg-hover inset-ring inset-ring-border text-muted`, never just faded.
  Ghost and icon buttons stay text-only → `text-muted`, no fill, no edge.
- xs (`h-6`) is for row actions and chips only.
- Loading (`isLoading`, `loadingLabel`): the label stays in the layout, hidden, and a 16 spinner takes its place. The
  button never changes size.

### Field (input, select trigger, search)
- Input: `h-8 px-3 rounded-md bg-page edge-control inset-ring-control focus:focus-ring aria-invalid:inset-ring-danger`
  (`FIELD` in `src/recipes.ts`)
- Size prop (owner, 24 Nov 2026), the Button's heights: xs `h-6` · sm `h-7` · md `h-8` (the default) · lg `h-9`
  (`FIELD_SIZE`). Input, select trigger, combobox, date picker and input group take it. The text stays 14 at every size.
- Wrapper fields (prefix, search with icon): the same on the wrapper, with `focus-within` and `has-aria-invalid`:
  `edge-control inset-ring-control focus-within:focus-ring has-aria-invalid:inset-ring-danger` (`FIELD_WRAPPER_EDGE`)
- Focus wins over hover; an error stays red on hover, and when focused keeps the red edge and adds the ring. Mark
  errors with `aria-invalid="true"`, not a class.
- Label above: `font-medium`, gap `1`. Hint below: `text-xs text-muted`. Error: `aria-invalid="true"` → the edge turns
  `danger`, hint `text-danger`.
- Disabled: `bg-hover edge-control inset-ring-border text-muted`.
- Prefix (for example `example.com/t/`) sits inside the same field, `text-muted`, in `font-mono`.
- Select: chevron-down `text-muted` at the end; chevron-up while open; the trigger keeps the focus ring while open.
- **Trailing action inside a field** (password eye, clear ×, copy): a ghost icon button, `size-6 rounded-sm`
  (every icon button in a field is 24), so it sits 4 from the field's top and bottom (32 − 24 = 8 → 4 each). No edge, no fill;
  icon `size-4 text-muted`, hover `bg-hover text-foreground`.
  Focus: the wrapper gets `has-[input:focus-visible]:focus-ring` (only when the input is focused, never `focus-within`);
  the button shows its own `focus-visible:focus-ring` only when it's focused by keyboard. Never both at once.
  Password eye: `aria-label` "Show password" / "Hide password", `aria-pressed`, icon `eye` ↔ `eye-off`;
  clicking keeps focus and caret in the input.
  In code: `InputGroupButton size="icon-sm"` in an `InputGroupAddon align="inline-end"` (the addon's `pr-1` does the `-mr-2`).
  In a 32 field (a table's search) the same recipe is `icon-xs`: 24, still 4 from the edge.
- Chips in a field (invite emails): `h-6 px-2 rounded-sm bg-hover`, × is Lucide `x`. The field grows in height.

### Checkbox · radio · switch
- Box `size-4 rounded-sm bg-page edge-control inset-ring-control` (2px, light). Hover `hover:inset-ring-outline`.
  Focus `focus-visible:focus-ring`, like every other control.
- Checked `bg-accent`, no edge, Lucide `check` (12px, stroke 3 on the 24 grid) in `text-on-primary`; some → `minus`.
- Radio: same edges, `rounded-full`; selected = `bg-on-primary` with a 5px accent inset.
- Disabled: `bg-hover inset-ring inset-ring-border` (1px border), label `text-muted`; checked-disabled keeps the tick in `text-muted`.
- With a description: box aligned to the first line (`mt-0.5`), title `font-medium`, description `text-xs text-muted`,
  rows 12 apart; group title above in `font-medium`. The whole row is the click target.
- Switch: track `w-11 h-6 rounded-full flex items-center` (44 × 24).
  Off: `bg-page edge-control inset-ring-control px-1` (`hover:inset-ring-outline`), knob `size-4 rounded-full bg-control`: it reads like an empty checkbox.
  On: `bg-accent px-0.5 justify-end`, knob `size-5 rounded-full bg-on-primary` holding a Lucide `check` (12px, stroke 3.5) in `text-accent`.
  The knob grows and slides over `--motion-fast`. Disabled: `bg-hover inset-ring inset-ring-border`, knob `bg-border`, check `text-muted`.
- The light edge is 1.5:1 on white, below WCAG's 3:1 for control edges, chosen for looks. The 2px weight, the hover
  darkening and the always-visible label keep it findable.

### Segmented control
- Track `inline-flex gap-0.5 p-1 rounded-lg bg-hover`
- Segment `px-3 rounded-md`, normal weight (owner, 24 Nov 2026: medium read heavy beside field text); chosen
  `bg-raised shadow-sm`, so the fill alone marks it and no label changes width. Height: track = control size,
  `size` sm 28 (track `p-0.5`, segments `px-2 text-xs`) · md 32, the default · lg 36.
- Use when a setting picks one of a few (a view, the theme, a width, a text size).

### Tabs
- List `flex gap-1 border-b`; tab `h-8 px-3 font-medium text-muted`; selected `text-foreground border-b-2 border-accent`.

### Popover · menu
- Container `p-1 rounded-lg bg-page shadow-sm`, width a multiple of 64.
- Section label `px-3 pt-2 pb-1 text-xs font-medium text-muted`.
- Menu row `h-9 px-3 gap-2 rounded-md`; Lucide icon at the start; shortcut at the end as
  `text-xs text-muted`; submenu chevron-right `text-muted`; danger row `text-danger`. Hover/keyboard: `bg-hover`.
- Two-line row (select options, versions): `py-2 pl-2 pr-3 gap-2 rounded-md`, title `font-medium`, description `text-xs text-muted`.
- Separator `h-px mx-2 my-1 bg-border`.
- Ticks mark the current value (`check`, `text-accent`) in a 16 column at the **start** of the row. No fill on the chosen option.

### Toolbar
- `inline-flex gap-0.5 p-1 rounded-lg bg-page shadow-sm`; buttons are ghost `h-7`; groups split by a 1×16 `bg-border`
  separator with `mx-1`.

### List row
- `h-8 px-3 gap-2 rounded-md`; hover `bg-hover`; current `bg-selected font-medium` + `aria-current`. Sidebars sit on
  `bg-page` with `border-r`, not on `bg-panel`: on grey, the 4% and 8% tints look the same.
- Children indent by `4` per level, on a 1px `border` guide line.

### Sortable
- A list the person puts in order: `Sortable`, `SortableItem` (with a `label`), `SortableHandle`. Short lists in one
  direction; no drag between lists, no tree, no scroll while dragging.
- The handle: a `size-7` button, `text-muted`, grip icon at 16; hover `bg-hover`; `cursor-grab`, `cursor-grabbing`
  while dragging; `touch-none`, so the list still scrolls by touch outside it.
- Dragged item: follows the pointer, `bg-raised shadow-md rounded-md`, above the rest. The items it passes slide aside,
  `duration-200 ease-sheet`; reduced motion turns the slide off. The drop draws the new order at once, with no slide.
- Keyboard: with the handle in focus, Up and Down move the item; the focus stays on the handle. Escape ends a drag. A
  live region says where the item went ("Email moved to position 3 of 8").

### Card
- `p-3` or `p-4`, `rounded-lg bg-raised shadow-sm`. Settings groups: 600 title, rows split by `border-t`.
- Cards sit on `bg-panel` (dashboards) or `bg-page` (side panel); `bg-raised` works on both in light and dark.
- A quoted passage in a card has a 2px accent bar on the left.

### Dialog
- `p-6 rounded-xl bg-page shadow-lg gap-4`; title `text-lg font-semibold leading-tight`; actions at the
  bottom right, secondary then primary.

### Tooltip · toast
- Tooltip `px-2 py-1 rounded-md bg-primary text-on-primary text-xs`; shortcut after it in `text-outline`.
- Toast `flex items-start gap-3 p-2 pl-4 rounded-lg bg-primary text-on-primary shadow-lg`; text `text-sm py-1.5 line-clamp-2`.
  Action: outlined sm button (2px `muted` edge), `self-center`, so it sits 8 from the edges. Icon in an `h-8` box, so it centres
  on the first line. No action → `pr-4`. 12 between icon, text and action.
  Up to two lines of text, then truncate; the action stays vertically centred. Max width 400.
  Stacked toasts: newest at the bottom, up to 3 visible, 8 apart; older ones leave after 5s, errors stay until closed.

### Badge · avatar
- Badge `px-2 rounded-full text-xs font-medium`; plan (PRO) `bg-mark text-accent`; everything else `bg-hover text-muted`.
- Status dot: `size-2 rounded-full` + text in the same colour (Live = success).
- Avatar 24 (`size-6`): people `rounded-full`, apps `rounded-sm bg-page inset-ring inset-ring-border`, teams `rounded-sm`.
  The 16 (`sm`) avatar's letter is `text-2xs` (10), the one size below `xs`, for avatar letters only.
  An app's tile holds the app's logo, not its letter.
  **People colours are palette shades; a team's colour is data.**
  A person without a photo gets `bg-teal-700`, `bg-violet-600`, `bg-orange-700` or `bg-blue-700` with `text-white`,
  chosen from a hash of their user ID, so it stays stable, inside the avatar component only (rule 10).
  A team's colour is picked by its owner and saved in the team's settings; the Avatar takes it as `color`
  and applies it inline (`design-ok`), letter in `text-white`. Every avatar colour must keep white text at 4.5:1.
  Small 16 (`size-4`) for in-row marks; 48 for an invite page. Stacks overlap by 4 with a 2px ring in the ground colour.
  Every person in a stack is a filled avatar; the last item may be an overflow count (`+3`): `bg-hover text-muted`, round.

## 4. Charts

- Series colours are `chart-1`, `chart-2`, `chart-3`, in that order, and nothing else. Max three series per chart;
  more becomes "Other" or small multiples. Status colours never mark a series. Colour follows the series, not its rank.
- Checked for colour blindness (all pairs, light on white and dark on page and raised): worst colour-blind ΔE 13,
  normal-vision ΔE 19, all ≥ 3:1.
- Lines 2px, round joins; one series may have an 8% area fill. Bars: 2px surface gap between stacked segments; round
  only the bar's outer end (4px on the top corners of the top segment), never the bottom corners, never inner segments.
- Gridlines in the `border` colour, 1px; axis text `text-xs text-muted`. One y-axis, always.
- One series: no legend, the title names it. Two or three: legend above plus the name at the line's end.
- Hover: crosshair (`outline` 1px), ringed points (2px `raised` ring), tooltip card
  (`bg-raised inset-ring inset-ring-border shadow-sm`, date xs muted, rows: dot, name, mono value).
- Text is never in a series colour. Every chart has a table view. Empty charts explain why; loading keeps the card and axes.
- Stat cards: `bg-raised shadow-sm p-4`, label `text-sm text-muted` with icon, value `text-2xl font-semibold tabular-nums`,
  change `text-xs` with a trending icon + the comparison in words.

## 5. Dashboard: page layout and tables

**Layout.** Sidebar 224 on `bg-page` + `border-r`, then a column with a top bar and the page.
- Sidebar, top to bottom: logo, workspace switcher (`h-10`, `edge-control inset-ring-control`), nav rows, Settings pinned at the bottom.
  Nav rows are list rows: `h-8 px-2 gap-2 rounded-md`, icon `text-muted`; hover `bg-hover`;
  current `bg-selected font-medium`, icon `text-foreground`, `aria-current="page"`. Counts `text-xs text-muted tabular-nums`.
- Top bar: `h-14 px-6 border-b`. Left: breadcrumb (`text-muted`, last item `text-foreground font-medium`). Right: the ⌘K
  search-or-command button (`h-8`, 256 wide, `edge-control inset-ring-control`), Help and Notifications (ghost icon
  buttons; unread = an 8px `bg-accent` dot with a 2px `page` ring), then the account button (avatar + name + chevron).
- Page: `p-8`, page header, `gap-6`, then the content. The page scrolls; the table header row sticks.

**Page header** (title, description, actions, breadcrumb; the page's only `h1`).
- Title `text-2xl font-semibold`, one line, line box 40 so it centres with md buttons. Description optional:
  `text-base text-muted`, max 640 wide, two lines at most; say what the page holds. Breadcrumb optional and only when
  nested: `text-sm text-muted`, 8 above.
- Actions optional, top right, aligned to the title row: at most one primary, on the far right; secondary (outlined)
  to its left; more than three → a ⋯ secondary icon button ("More actions"). Under 640 wide the actions wrap below the
  description, full width.

**Search and filters** (the row above the table, `p-3 gap-2 border-b`).
- Search: `h-8`, 256 wide, search icon, a placeholder that says what it searches, `/` hint as a `kbd`; with a value, a
  ghost xs × clears it. Filters as you type (150 ms), `/` focuses, Esc clears.
- Filter buttons: `h-8 edge-control inset-ring-control` + chevron. Open = a popover with its own search (when more than
  7 options), a checkbox list with counts (`menuitemcheckbox`), and Clear / Apply. Applied = `bg-selected`, no edge,
  "Status: Live" + ×. AND across filters, OR within one. "Clear all" (ghost) appears once anything is applied.
- With anything applied, a count line under the row: `text-xs text-muted`, "3 of 134 items".
- Nothing found: say what was searched and which filters are on, one "Clear search and filters" button.
- Search and filters live in the URL. Columns and Export sit at the right end of the row.

**Tables**
- On the page fill the table sits in a frame: `rounded-lg inset-ring inset-ring-border overflow-hidden`, no shadow. On
  a panel ground it is a raised card. Header `text-xs font-semibold text-muted`, 40 tall, `border-b`.
  Sortable headers are buttons: muted ⇅ when unsorted; sorted = text colour + direction arrow + `aria-sort`.
- Pagination: previous, first, current ± 1, …, last, next. Current page = `edge-control inset-ring-control font-semibold`
  + `aria-current="page"`; others ghost; arrows disabled at the ends. Left: rows-per-page select, then the range
  ("21–40 of 134"); right: the page numbers only.
- Rows 48, `border-b`, hover `bg-hover`, selected `bg-selected` with a checked box; the header box shows "some".
- Numbers right-aligned in mono xs. Row actions: `xs` ghost icon buttons, visible on row hover and focus.
- Selection swaps the filter row for a selection row in the same place and style (padding 12, `border-b`):
  "2 selected" (600) + ghost Clear on the left; sm secondary actions on the right, Delete last with `text-danger`. Esc
  or Clear deselects. No dark bar.
- Loading = skeleton rows in real columns; empty = which filters + Clear filters.

## 6. Sign-in, states, toasts, phones

- **Auth pages:** one `bg-raised rounded-xl shadow-sm p-6` card, max 384 wide, on `bg-panel`, logo above. Groups 24
  apart, 12 inside. Errors on blur, never while typing.
- **Provider and app logos:** use each provider's official SVG, unmodified, at 16px in buttons and in the 24/48
  app-avatar slot elsewhere. Keep them in one folder of the app, the only files allowed non-token colours (mark
  `design-ok`). Never redraw or recolour a logo.
- **Loading:** skeleton bars `bg-hover rounded-sm` (the `Skeleton` component), no shimmer, after 300 ms. Spinner =
  Lucide `loader-circle`, muted, only in a known spot (button, save state, block). Full-page spinner only with a sentence.
- **Empty:** icon tile (`bg-hover rounded-lg` 40), 600 title, one muted sentence, at most one button. Never "No data".
- **Errors:** say what happened, whether work is safe, what to do. Inline stays inline; full page only for a lost page
  (404/403/500 with a mono reference). A crash inside one part of a page stays in that part: "Something went wrong
  here." muted, and a ghost "Try again"; the rest of the page keeps working.
- **Notice bar** (a sync conflict, a read-only view): `border-b px-4 py-2 text-sm`, info `bg-primary/5`, danger
  `bg-danger/10`, the title in 500, a muted detail line hidden on a phone, the buttons at the end.
  Offline is a banner under the header (warning icon), not a toast.
- **Toasts:** bottom right on desktop, bottom centre on phones, 16 from the edges, max 400 wide, two lines then cut.
  Icons only for done (`circle-check`), working (`loader-circle`) and error (`circle-alert`). Plain toasts leave after
  5 s (paused on hover/focus); errors stay until closed. Stack newest at the bottom, 3 visible, 8 apart.
- **Phone width (< 640):** top bar 56 with `size-12` buttons; the sidebar is a drawer at 85% over the scrim; popovers
  become bottom sheets, their controls at the usual 32; tables scroll inside the page margins; dashboard: stat cards
  2 × 2, one chart, tables become lists.

## 7. Before you finish any UI change

- [ ] `bun run check` passes (the token test finds no raw value)
- [ ] Looks right in light and dark (`data-theme="dark"`)
- [ ] Every interactive element has hover, focus-visible, and disabled where it applies
- [ ] Nothing changes size while it loads
