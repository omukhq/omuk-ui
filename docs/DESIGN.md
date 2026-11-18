# Markpad design system

The rules every screen in markpad.md and app.markpad.md follows. The tokens live in
`packages/omuk-ui/src/design/theme.css`. The reference pictures are in `design/boards/` (Tokens, Components,
Editor elements, App and onboarding — light and dark).

**If something you need is not here, stop and ask. Do not invent a value.**

---

## 1. Hard rules

1. **No raw values in components.** No hex, rgb, px, rem or arbitrary Tailwind values (`p-[13px]`,
   `bg-[#eee]`, `shadow-[…]`). Only the theme's classes. `theme.css` is the only file with raw values.
2. **Spacing steps** (padding, margin, gap): `0.5 1 2 3 4 6 8 12 16` (2, 4, 8, 12, 16, 24, 32, 48, 64 px). Never 5, 7, 9, 10, 11, 14.
   Heights and square sizes have their own list (rule 3).
3. **Heights:** Tailwind's own sizes, nothing custom: `h-9` 36 (default buttons, fields, menu rows, tabs, table headers; owner, 15 Nov 2026) · `h-8` 32 (small buttons,
   headers, filter rows, list rows) · `h-7` 28 (formatting toolbar) · `h-6` 24 (row actions and chips in dense lists and tables only).
   Square buttons use `size-*` with the same numbers. Components expose these as `size="lg|default|sm|xs"` (R48, shadcn's names:
   36 / 32 / 28 / 24, icon-only `icon-lg|icon|icon-sm|icon-xs`); only the component maps name → class. A button's default is 32;
   a field's (input group, select, segmented) is lg, 36.
   Never a form or dialog button below md.
   On touch screens an `h-6` control keeps a 32 hit area (padding or a pseudo-element).
4. **Type:** six sizes only (`text-xs sm base lg xl 2xl` = 12 14 16 20 24 32). Interface text is line height 1.5
   (built into xs, sm, base); lg and up are 1.25; doc body is `leading-relaxed` 1.7. Weights: 600 for titles,
   500 for controls, labels and the current item, 400 for body text. Nothing else.
   Fields are 16 on phones and 14 from 640px up (in theme.css base), so iOS never zooms.
5. **Icons:** Lucide only (`lucide-react` in the app, `lucide-preact` in Astro islands), `size-4`
   (16), `strokeWidth={1.5}`, `currentColor`. No unicode glyphs or hand-drawn SVG as icons.
   Keyboard shortcuts stay text: `⌘P`.
6. **Shadows:** `shadow-sm` for everything that floats (cards, menus, popovers, dropdowns, toolbars,
   images in the doc, the chosen segment). `shadow-lg` only for dialogs and toasts.
   Shadows never contain a border.
7. **Edges are Tailwind inset rings; dividers are Tailwind borders.** Inset rings never change a control's size.
   Two weights: 1px `inset-ring inset-ring-border` for things you look at (cards, popovers, table frames);
   2px `inset-ring-2 inset-ring-control` for anything you tick (checkboxes, radios, the switch); 1px `inset-ring inset-ring-control` for fields and outlined buttons (owner, 18 Nov 2026).
   Change only the colour for states: `hover:inset-ring-outline`, `aria-invalid:inset-ring-danger`, picked `inset-ring-accent`.
   Dividers between areas and rows: `border-t` / `border-b` / `border-l` / `border-r` (1px, the border colour is the default).
   Never a full `border` or `border-2` around a control. Selected tab: `border-b-2 border-accent`.
8. **Radius nests:** the outer corner is one size rounder than the inner one. Row `rounded-md` (6) in a menu with `p-1` → menu `rounded-lg` (8). Tailwind's scale: `sm` 4, `md` 6, `lg` 8, `xl` 12 (owner, 18 Nov 2026).
   Card `rounded-lg` in a dialog → dialog `rounded-xl` (16).
9. **Dark mode** is `data-theme="dark"` on `<html>`. App chrome never writes `dark:` colour pairs: roles swap by themselves.
   The one exception is palette colours in tag, badge, label, avatar and chart components, which write both modes
   (`bg-teal-100 text-teal-800 dark:bg-teal-900 dark:text-teal-200`). Otherwise `dark:` only for a change of shape, almost never.
10. **App chrome uses roles only.** Palette shades don't switch in dark mode, roles do: `text-blue-600` where `text-accent` is
   meant breaks in dark mode. Palette classes belong only in tag, badge, label, avatar and chart components;
   `check:design` fails on them anywhere else (it decides by file or folder name).
10. **Labels are sentence case.** No uppercase or letter-spaced section labels.
11. **The root font size stays 16px.** The 14px interface size is on `body`. Never set `font-size` on `html`.

## 2. Colour: palette, then roles

Boards: `design/boards/0-Palette-*.png`.

**Palette.** Tailwind's own (owner, 18 Nov 2026), 11 families × 11 shades (50–950): `gray red orange amber yellow green teal
sky blue violet pink`, plus `white` and `black`: `bg-red-100`, `text-blue-600`, `border-gray-200`, `inset-ring-teal-500`.
Tailwind's other families (slate, zinc, rose …) are off. Omuk defines no palette value: only the roles below. Two roles
take a darker shade than before for contrast: success is `green-700` (4.9:1; Tailwind's `green-600` is 3.2:1), the hover
edge is `gray-500` (4.8:1; `gray-400` is 2.6:1).

**Roles** are what the app's chrome uses, and they point at palette shades (light → dark):
page white → gray-800 · panel gray-50 → gray-900 · raised white → gray-700 · border gray-100 → white 10% · control gray-200 → white 16% ·
outline gray-500 → gray-400 · foreground gray-950 → gray-100 · muted gray-600 → gray-300 · primary gray-950 → gray-100 ·
accent blue-600 → blue-300 · mark blue-100 → blue-950 · danger red-600 → red-300 · success green-700 → green-400 ·
warning amber-700 → amber-400 · chart-1/2/3 blue-600/orange-500/teal-500 (dark: blue-500/orange-500/teal-500).

- Surfaces, text, edges and states → roles (`bg-page`, `text-foreground`, `bg-accent`): they flip in dark mode by themselves.
- Things with no role → palette, with both modes written (the rule 9 exception): tags and labels (`bg-teal-100 text-teal-800 dark:bg-teal-900 dark:text-teal-200`),
  team colours (any family at 600 with `text-white`, never blue or red), illustrations, chart series beyond three.
- Never a hex value outside `theme.css`.

### Roles

| Class | Job |
|---|---|
| `bg-page` | The doc, sidebars and side panels (with a divider), menus, popovers, dialogs |
| `bg-panel` | The ground behind cards: dashboard card grids, auth pages, inline code and code blocks. The only grey surface. Never under list rows. |
| `bg-raised` | Surfaces above the ground: cards, popovers, the chosen segment. Always with `shadow-sm`. In dark mode raised is lighter than panel, which is lighter than page — lighter means closer. |
| `bg-hover` | The row or ghost button under the pointer, and keyboard-highlighted options. A tint, so it works on page and panel. |
| `bg-selected` | Toggles that are on (Bold, side panel open, ghost pressed), applied filters and selected table rows. A neutral 8% tint — twice hover's 4% — so selection is grey, not violet; the ticked checkbox carries the accent. |
| `bg-scrim` | Behind dialogs, drawers and sheets. One value: 32% black, 60% in dark. |
| `border` | 1px lines: `inset-ring inset-ring-border` around cards, popovers and table frames; `border-t/b/l/r` for dividers (default colour) |
| `control` (`inset-ring inset-ring-control` on fields; `inset-ring-2` on checkboxes and radios) | At rest: a light edge, 1px on fields (owner, 18 Nov 2026), 2px on checkboxes and radios. |
| `outline` (`hover:inset-ring-outline`) | The same 2px edge on hover, darker (3:1). |
| `text-foreground` / `text-muted` | Main text / hints, meta, labels, timestamps |
| `bg-primary text-on-primary` | Primary button, tooltip, toast |
| `text-accent` | Links, caret, ticks, picked values, chart series 1 |
| `bg-mark` | Comment highlights, added text in history, plan badges |
| `bg-found` | The words a search found, in its results (sidebar search): yellow, `yellow-200`, `yellow-800` in dark (owner, 16 Nov 2026) |
| `text-danger / success / warning` | Delete and errors / done, live, connected / check this |

**Three states, three treatments — never mix them:**
- **Hover** → `bg-hover`.
- **Where you are** in a list (current page, doc, heading, version) → `bg-selected font-medium`, no shadow, no bar. In a segmented control the chosen segment is `bg-raised shadow-sm`.
- **Picked value** (checkbox, radio, select option, font card, tab) → accent: tick, fill, `inset-ring-2 inset-ring-accent` or a 2px underline.
- **On toggle** → `bg-selected`.

**Focus** is the same on every control: `focus-visible:focus-ring` (1px `outline` edge + 3px `control` halo: grey, not the accent; owner, 18 Nov 2026).

## 3. Components (omuk-ui)

The components are the workspace package `@omuk/ui`, in `packages/omuk-ui/` (its README says how to use it). The app that uses it loads `packages/omuk-ui/src/design/theme.css` for the tokens.

Restyle the existing omuk-ui components to these recipes. Keep their APIs and behaviour.
Recipes are Tailwind classes; `{}` marks a variant.

### Button
- Base: `inline-flex items-center gap-2 rounded-md font-medium focus-visible:focus-ring`
- Size prop → classes: lg `h-9 px-4` · default `h-8 px-3` · sm `h-7 px-2 rounded-sm` · xs `h-6 px-2 text-xs`. Icon-only: `icon-lg/icon/icon-sm/icon-xs`,
  `size-9/8/7/6 p-0`, so the 16 icon stays 16. The formatting toolbar's controls are `sm` / `icon-sm` (no class of their own).
  With a leading icon, the left padding drops one step (`pl-3` / `pl-2`).
- Variant:
  - primary `bg-primary text-on-primary` — one per surface
  - secondary `bg-page inset-ring inset-ring-control hover:inset-ring-outline text-foreground` — dialogs and forms (1px edge)
  - ghost `bg-transparent text-foreground hover:bg-hover` — toolbars, headers, menus; pressed: `bg-selected` + `aria-pressed`
  - danger `bg-page inset-ring inset-ring-control hover:inset-ring-outline text-danger` — destructive action offered (1px edge)
  - danger-confirm `bg-danger text-on-primary` — only the last step of a destructive dialog
- Disabled: primary, secondary and danger → `bg-hover inset-ring inset-ring-border text-muted`, never just faded.
  Ghost and icon buttons stay text-only → `text-muted`, no fill, no edge.
- xs (`h-6`) is for row actions and chips only.
- omuk-ui and the old root kit use the same names (R48); every call site was renamed with the scale, so nothing changed size.

### Formatting toolbar (owner, 14 Nov 2026; R32, R38)
- Bar `h-9 px-3 flex flex-nowrap items-center gap-0.5 border-b` (36 tall, the border included). One row, never wraps.
- Buttons and the text-style button are `h-7` (28), `rounded-sm`; labels stay `text-sm`, icons 16.
- The text style (Text, Heading 1–3, Quote) is a ghost dropdown like More (R39): no edge, transparent, the label then a muted
  `chevron-down`, `h-7 px-2 gap-1 rounded-md hover:bg-hover`, fits its label like More (owner, 15 Nov: no `min-w-24` gap). Its menu is
  More's: the same container and width, rows with a Lucide icon, the name over a muted line, the shortcut at the end, and the
  tick at the start on the current style.
  In code: `size="xs"` / `icon-xs` with `TOOL_BUTTON` / `TOOL_ICON`, which set `h-7` / `size-7`.
- Too narrow: the insert buttons move into "More" from the right — never a second row. Phones keep the format bar (§9).
- It holds only the text-style button, formats, lists, inserts and More (and the Markdown help). From md up beside a
  sidebar the page's controls are in the doc header above it; on phones and in the edit-link editor they end this row.
- The side panel's tab row is `h-9 px-2 border-b`; its tabs fill the height, so the 2px underline sits on the divider,
  and it lines up with this row under the doc header.

### Doc header (owner, 15 Nov 2026; boards 11 and 3)
- From md up beside a sidebar, over the editor column and the side panel: `h-14 px-4 gap-4 border-b`.
- Left: where the doc is — folder `text-muted` ` / ` title `font-medium text-foreground` (`text-sm`), then the save state
  as its icon (saved, saving, offline, failed, changed elsewhere). No folder (or a draft in this browser): the title alone.
- Right, `gap-2` (R43, amended): the page width (`move-horizontal`, Live only), Live ↔ Split, Aa, Focus (`scan`), the side
  panel — ghost `size-8` — then Share as the primary `h-8` button. Live ↔ Split is one button whose icon is the view a press
  gives, no pressed state: `columns-2` "Split view" in Live, `file-text` (one page) "Live view" in Split. The page width is a menu like More (Narrow, Normal, Full width, the current one ticked), drawn in Live
  only. The controls end at the header's right edge, so in Split, without the width, no button moves. The side panel is pressed
  (`bg-selected`) while open. Copy markdown is not in the header: it is in Share → Export (Clipboard) and the command palette.
  Below md and in the edit-link editor the toolbar's end holds the same buttons; below md there is no Split and no page
  width (only Live fits). The sidebar header beside it is `h-14` with `border-b` on the same line.
- Phones keep their own top bar; no second bar.
- Loading: the label stays, a 16 spinner replaces the leading icon, in the button's text colour.

### Focus mode (owner, 15 Nov 2026, R44)
- The doc alone: the sidebar, the formatting toolbar, the status bar and the side panel are not drawn.
- The doc header stays at `opacity-25`, back to full on hover and with keyboard focus inside it (`hover:opacity-100
  has-focus-visible:opacity-100`: keyboard focus, not a click; a short opacity transition, none with reduced motion).
- The Focus button keeps its `scan` icon and its place, pressed (`bg-selected`); no "Exit focus" label.
- Entering shows the toast "Focus mode · press Esc to leave"; Esc leaves, after closing any open popover or menu first.
  The tab title is "Focus · Markpad" meanwhile. Phones keep their own behaviour.

### Empty editor (board 12; owner, 15 Nov 2026, R45)
- An empty doc shows the title placeholder "Untitled", the body hint "Start writing, or press / for blocks" and the starters
  (templates, Import a file, Paste Markdown). Empty means no characters at all, title included; spaces and blank lines count
  as empty. Any doc, saved or not.
- Typing hides the starters; emptying the doc again brings them back (this overrides board 12's "they don't come back").
  A starter fills this doc, saved as typing is; Undo returns to the empty doc.

### Field (input, select trigger, search)
- Input: `h-9 px-3 rounded-md bg-page inset-ring inset-ring-control focus:focus-ring aria-invalid:inset-ring-2 aria-invalid:inset-ring-danger` (1px; no hover edge; owner, 18 Nov 2026)
- Wrapper fields (prefix, search with icon): the same on the wrapper, with `focus-within` and `has-aria-invalid`:
  `inset-ring inset-ring-control focus-within:focus-ring has-aria-invalid:inset-ring-2 has-aria-invalid:inset-ring-danger`
- Result (tested in Chromium): hover darkens the edge; focus wins over hover; an error stays red on hover,
  and when focused keeps the red edge and adds the mark ring. Mark errors with `aria-invalid="true"`, not a class.
- Label above: `font-medium`, gap `1`. Hint below: `text-xs text-muted`. Error: `aria-invalid="true"` → `inset-ring-2 inset-ring-danger` (2px), hint `text-danger`.
- Disabled: `bg-hover inset-ring inset-ring-border text-muted`.
- Prefix (e.g. `markpad.md/t/`) sits inside the same field, `text-muted`, in `font-mono`.
- Select: chevron-down `text-muted` at the end; chevron-up while open; the trigger keeps the focus ring while open.
- **Trailing action inside a field** (password eye, clear ×, copy): a ghost icon button, `size-8 rounded-sm -mr-2`
  so it sits 4 from the field's end and 2 from its top and bottom (36 − 32 = 4 → 2 each). No edge, no fill;
  icon `size-4 text-muted`, hover `bg-hover text-foreground`.
  Focus: the wrapper gets `has-[input:focus-visible]:focus-ring` (only when the input is focused, never `focus-within`);
  the button shows its own `focus-visible:focus-ring` only when it's focused by keyboard. Never both at once.
  Password eye: `aria-label` "Show password" / "Hide password", `aria-pressed`, icon `eye` ↔ `eye-off`;
  clicking keeps focus and caret in the input.
  In omuk-ui: `InputGroupButton size="icon-sm"` in an `InputGroupAddon align="inline-end"` (the addon's `pr-1` does the `-mr-2`).
  In a 32 field (a table's search) the same recipe is `icon-xs`: 24, still 4 from the edge.
- Chips in a field (invite emails): `h-6 px-2 rounded-sm bg-hover`, × is Lucide `x`. Field grows in height.

### Checkbox · radio · switch
- Box `size-4 rounded-sm bg-page inset-ring-2 inset-ring-control` (2px, light). Hover `hover:inset-ring-outline`.
  Focus `focus-visible:focus-ring` (1px grey edge + 3px grey halo), like every other control.
- Checked `bg-accent`, no edge, Lucide `check` (12px, stroke 3 on the 24 grid) in `text-on-primary`; some → `minus`.
- Radio: same edges, `rounded-full`; selected = `bg-on-primary` with a 5px accent inset.
- Disabled: `bg-hover inset-ring inset-ring-border` (1px border), label `text-muted`; checked-disabled keeps the tick in `text-muted`.
- With a description: box aligned to the first line (`mt-0.5`), title `font-medium`, description `text-xs text-muted`,
  rows 12 apart; group title above in `font-medium`. The whole row is the click target.
- Switch: track `w-11 h-6 rounded-full flex items-center` (44 × 24).
  Off: `bg-page inset-ring-2 inset-ring-control px-1` (`hover:inset-ring-outline`), knob `size-4 rounded-full bg-control` — it reads like an empty checkbox.
  On: `bg-accent px-0.5 justify-end`, knob `size-5 rounded-full bg-on-primary` holding a Lucide `check` (12px, stroke 3.5) in `text-accent`.
  The knob grows and slides over `--motion-fast`. Disabled: `bg-hover inset-ring inset-ring-border`, knob `bg-border`, check `text-muted`.
- The light edge is 1.5:1 on white — below WCAG's 3:1 for control edges, chosen for looks. The 2px weight,
  the hover darkening and the always-visible label keep it findable. Revisit if testing shows people miss it.

### Segmented control
- Track `inline-flex gap-0.5 p-1 rounded-lg bg-hover`
- Segment `px-3 rounded-md font-medium`; chosen `bg-raised shadow-sm`. Height: track = control size.
- Use when a setting picks one of a few (Live/Split, theme, width, text size).

### Tabs
- List `flex gap-1 border-b`; tab `h-9 px-3 font-medium text-muted`; selected `text-foreground border-b-2 border-accent`.

### Popover · menu
- Container `p-1 rounded-lg bg-page shadow-sm`, width a multiple of 64.
- Section label `px-3 pt-2 pb-1 text-xs font-medium text-muted`.
- Menu row `h-9 px-3 gap-2 rounded-md`; Lucide icon at the start; shortcut at the end as
  `text-xs text-muted`; submenu chevron-right `text-muted`; danger row `text-danger`. Hover/keyboard: `bg-hover`.
- Two-line row (select options, versions): `py-2 pl-2 pr-3 gap-2 rounded-md`, title `font-medium`, description `text-xs text-muted`.
- The / menu is compact (R47): a plain 16 icon (`text-muted`, no tile) and the name; rows `py-1 px-2 gap-2 text-sm`, sections `text-xs text-muted`, shortcut at the end.
- Separator `h-px mx-2 my-1 bg-border`.
- Ticks mark the current value (`check`, `text-accent`) in a 16 column at the **start** of the row. No fill on the chosen option.

### Floating toolbar (selection bar, block toolbars, link peek)
- `inline-flex gap-0.5 p-1 rounded-lg bg-page shadow-sm`; buttons are ghost `h-7`; groups split by a 1×16 `bg-border` separator with `mx-1`.
- The selection bar: Bold, Italic, Strikethrough, Link, the separator, then Comment as a ghost button with `message-square`. Never a filled button.

### Link popover
Board: Design system → Editor → Link popover. (The older "Image and link editing" board now shows the same thing.)
- **Caret in a link → peek**, not the editor: a floating toolbar under the link with globe icon + the address without protocol
  (`text-accent`, max 192, ellipsis), separator, ghost `size-7` icon buttons Open in new tab, Copy, Edit, Remove link.
  ⌘-click on the link opens it. Esc closes.
- **Edit, ⌘K or the toolbar Link button → editor popover**: `w-88 p-3 flex flex-col gap-2 rounded-lg bg-page inset-ring inset-ring-border shadow-lg`.
  - **Link** field first (`h-9`, `link` icon, placeholder "Paste a link or search your docs"), focused on open with `focus-ring`,
    existing address selected. Never prefill "https://"; add it on save when there's no protocol.
  - Typing words lists up to 5 of your docs under an xs "Your docs" label (option rows `h-8`, `file-text` icon, folder name xs muted
    at the end, ↵ on the highlighted one). A URL shows no list. ↑/↓ move, Enter picks.
  - **Text** field second (`h-9`): the link's words, prefilled from the selection. Empty + a doc picked → the doc's title.
  - Footer `pt-2 border-t`: Remove link (ghost `h-7`, `unlink`, muted; only for an existing link) left; "Esc to cancel" (xs muted)
    and Save (primary `h-7`) right. Enter saves; Esc cancels and puts the caret back. No Cancel button.

### Image popover
Board: Design system → Editor → Image popover (also on "Image and link editing").
- **Click an image → selected**: 2px accent outline with a 2px page gap, and a toolbar above the picture, 8 over its top edge and as wide as it (owner, 15 Nov 2026; R42 had it inside the bottom edge)
  (`p-1 rounded-lg bg-page shadow-lg`): an ALT tag (xs semibold; `bg-selected text-muted`, or warning at 16% with `text-warning`
  when empty), the alt text as an inline borderless input (placeholder "Describe the image"), separator, Replace (ghost `h-7`,
  `image` icon), View full size, Delete. ⌫ deletes the selected image.
- **Replace → popover**, same shape as the link popover (`w-88 p-3 gap-3`, `inset-ring inset-ring-border shadow-lg`):
  - Segmented Upload | Link; opens on Link when the image came from a URL, else Upload.
  - Link: "Image address" field focused with the address selected, checked as you type. Under it a status row (`bg-panel rounded-md p-2`):
    thumbnail + "Loads" (`text-success`) + "PNG · 1600 × 900 · 214 KB", or an alert icon + "Can’t load this address" (`text-danger`) +
    "Check the link, or upload the file instead". Save is disabled until it loads.
  - Upload: a drop area (`h-32 rounded-md inset-ring-2 inset-ring-control`, centred): upload icon, "Drop an image, paste one, or browse",
    "PNG, JPG, GIF, WebP or SVG · up to 10 MB" (xs muted).
  - "Alt text" field (not "Description"), with the hint "Read aloud by screen readers, and shown if the image can’t load."
  - Footer: "Esc to cancel" and Save. No Cancel button.

### List row (sidebar, outline, history versions, folder picker)
- `h-8 px-3 gap-2 rounded-md`; hover `bg-hover`; current `bg-selected font-medium` + `aria-current`. Sidebars sit on `bg-page` with `border-r`, not on `bg-panel`: on grey, the 4% and 8% tints look the same.
- Children indent by `4` per level, on a 1px `border` guide line (the library sidebar's own rule is below).
- AI author mark: 16 app avatar at the end of the row (logo in the slot).

### Library sidebar (R50: the designer's update after v3.13)
- `bg-page` with `border-r`, 288 wide (resizable). Header `h-14 border-b`: the logo, then ghost icon buttons New doc
  (`square-pen`) and Hide sidebar (`panel-left`; `x` in the phone drawer).
- Search: `h-8`, `search` icon, "Search docs", ⌘P at the end; 12 above, 8 to the sides. Its edge is the thin one
  (`inset-ring inset-ring-control`, the owner's choice for the sidebar), not the 2px control edge.
- Group labels (Pinned, Folders, Recent): `h-6 px-3 text-xs font-medium text-muted`, sentence case, no letter-spacing;
  16 above (`mt-4`), 8 above the first. An add button at the end: ghost `icon-xs` (24), the icon muted until hovered
  (`folder-plus` on Folders, `file-plus` on Recent).
- Rows: the list row, with a 16 icon in `text-muted` (`folder`, `folder-open` while open, `file-text`); current: the icon in
  `text-foreground`. Folders have no chevron: a click opens or closes them (`aria-expanded`), and → / ← too; an open folder
  ends in its doc count (`text-xs text-muted`). Children step in 24 per level, so their icons sit under the folder's name;
  no guide line. No `/` after a folder's name, no accent text, no bold rows except the current one.
- Marks at a row's end, `gap-1.5`, each with a tooltip: `globe` (muted) published as a site (no mark for shared by link: owner, 15 Nov 2026),
  the 16 app mark (the app avatar: thin edge, the app's logo) written by an AI app. They stay on hover; the ⋯ shows after them.
- Foot `border-t p-2`: Trash and AI apps as rows (`trash-2`, `bot`), then the account button `h-12`: a 32 avatar, the name
  (600) over the workspace (`text-xs text-muted`), `chevrons-up-down`; its menu opens above it and switches workspaces.
  Signed out: Trash, Docs, the "saved in this browser" note and Sign in.
- Row menus (R52; ⋯ and right-click are the same menu), compact (`COMPACT_MENU`: rows 32, as wide as the longest item),
  an icon on every item, groups split by a separator:
  - doc: Rename (F2) · Pin · Duplicate · Copy Markdown | Share… · Move to › · Export › (Markdown, Web page; PDF only for
    the open doc) | Move to Trash (⌘⌫);
  - folder: Rename (F2) · New doc here · New folder here · New from template › | Pin · Share… · Publish as site… (Site
    settings… once published) · Move to › · Export folder (.zip) | Move to Trash (⌘⌫);
  - several rows: Pin · Move to › | Move N to Trash (⌘⌫).
  - Move to ›: a "Find a folder" box (`InputGroup size="default"`, ↓ into the list), "No folder" (the Recent list), the
    folders in the sidebar's order with their icons, the current place greyed with "current", a separator, "New folder…".
  - A shortcut shows only where it works on the row: F2 and ⌘⌫ (Delete on other keyboards). No ⌘N: Chrome keeps it.

### Card
- `p-3` or `p-4`, `rounded-lg bg-raised shadow-sm`. Settings groups: 600 title, rows split by `border-t`.
- Cards sit on `bg-panel` (dashboards) or `bg-page` (side panel); `bg-raised` works on both in light and dark.
- Comments and history changes are cards. A quoted passage has a 2px accent bar on the left.
- The side panel (R49): every tab starts with a `text-xs text-muted` line, its count at the start and a note at the end
  ("2 open · In page order", "6 headings · 52% read", "Today · 4 versions"). Text is `text-xs` / `text-sm`, never `text-base`.
  - Comments: the thread being read is a `bg-hover` card with `border-l-2 border-accent`, its words on top in `bg-mark`;
    each comment a 16 avatar, the name `text-xs font-semibold`, the age `text-xs text-muted` at the end, the words
    `text-sm` under the name; a one-line Reply (`InputGroup size="default"`) with an outline Resolve or Reopen beside it.
    Other threads are plain rows. Resolved threads wait behind a full-width outline "Show N resolved".
  - Outline: `h-7 text-xs` rows, a level steps in by 4, the doc's title semibold; the current section `bg-selected`
    with a 2px accent bar at the panel's edge; what the doc holds besides words as Badges at the bottom.
  - History: a row is the writer's 16 tile (a person round and filled, an app square), the version (`Current version`,
    `Edited`, `Restored`, `Created`) in `text-xs font-semibold`, who and what changed under it, the time at the end;
    the version shown `bg-selected` with the accent bar down its left edge.

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
  The 16 (`sm`) avatar's letter is `text-2xs` (10), the one size below `xs`, for avatar letters only (owner, 15 Nov 2026).
  An app's tile holds the app's logo (Claude, OpenAI, Gemini; a robot for others), not its letter.
  **People colours are palette shades; a team's colour is data** (decisions, R3 owner decision, updated for v3.12).
  A person without a photo gets `bg-teal-700`, `bg-violet-600`, `bg-orange-700` or `bg-blue-700` with `text-white`,
  chosen from a hash of their user ID, so it stays stable — inside the avatar component only (rule 10).
  A team's colour is picked by its owner and saved in the team's settings; the Avatar takes it as `color`
  and applies it inline (`design-ok`), letter in `text-white`. Every avatar colour must keep white text at 4.5:1.
  Small 16 (`size-4`) for in-row marks; 48 for the invite page. Stacks overlap by 4 with a 2px ring in the ground colour.
  Every person in a stack is a filled avatar; the last item may be an overflow count (`+3`): `bg-hover text-muted`, round.

## 4. The document

The editor content uses the same tokens. Reading settings (Aa) scale the doc only, never the interface.

| Element | Recipe |
|---|---|
| Body | `text-base leading-relaxed` |
| H1 / H2 / H3 | `text-2xl` / `text-xl` / `text-lg`, `font-semibold leading-tight`; space above 8 / 6 |
| Inline code | `font-mono text-sm px-1 py-0.5 rounded-sm bg-panel` |
| Link | `text-accent underline underline-offset-4` |
| Comment highlight | resting: `bg-mark`; the comment being viewed or hovered: `bg-mark` + 2px accent underline. No amber. |
| Quote | `text-lg italic` in the reading font, 2px `foreground`-coloured bar, `pl-4` |
| Emphasis | real italics in the reading font (Plex Sans italic, Plex Serif italic) — never synthesised |
| Checklist | the checkbox component; done items `text-muted line-through` |
| Table | `text-sm`; head `text-xs font-semibold text-muted` with a 2px `foreground` rule; rows split by `border-b` |
| Code block | `rounded-lg bg-panel`, never dark; header `h-10 border-b` with the file name edited in place (`font-mono text-xs`, no edge), then a ghost language picker (`text-muted` + chevron) and a ghost icon Copy. Syntax below; the highlighted line uses `bg-mark`. |
| Image | `rounded-lg shadow-sm`; caption `text-sm text-muted` centred |
| Math (display) | centred, `font-serif text-lg italic`, number on the right in `text-muted` |
| Diagram (Mermaid theme) | nodes `bg-page` + outline edge + `rounded-md`; decisions `rounded-full`; key path `bg-mark` + accent edge; lines `outline` 1px; labels `text-xs text-muted` |
| Divider / details | `border-t`; details summary `h-10 font-medium` with a chevron |

## 5. Code syntax colours

Only roles; no syntax-only colours. No italics in code (Plex Mono italic isn't loaded).

| Token kind | Colour |
|---|---|
| keyword, tag name, type, class | `text-accent` |
| string, attribute value, regex | `text-success` |
| number, boolean, constant, attribute name | `text-warning` |
| function and method names | `text-foreground font-medium` |
| comment, punctuation, operators | `text-muted` |
| variable, property, plain text | `text-foreground` |
| deleted / inserted (diff blocks) | `text-danger` / `bg-mark` |
| line numbers | `text-outline` |

## 6. Reading fonts

The Aa menu offers four doc fonts: **Sans** (Plex Sans), **Serif** (Plex Serif), **Mono** (Plex Mono) and
**Easy read** (`font-readable`, Atkinson Hyperlegible). They change the doc only, never the interface.
Load per face: regular, italic, 600 and 600 italic where the face has them; fonts download only when used.

## 7. Charts

Boards: `design/boards/8-Charts-*.png`.
- Series colours are `chart-1`, `chart-2`, `chart-3`, in that order, and nothing else. Max three series per chart;
  more becomes "Other" or small multiples. Status colours never mark a series. Colour follows the series, not its rank.
- Validated (dataviz checker, all pairs, light on white and dark on page/raised): worst colour-blind ΔE 13, normal-vision ΔE 19, all ≥ 3:1.
- Lines 2px, round joins; one series may have an 8% area fill. Bars: 2px surface gap between stacked segments; round only the bar's outer end (4px on the top corners of the top segment) — never the bottom corners, never inner segments.
- Gridlines in the `border` colour, 1px; axis text `text-xs text-muted`. One y-axis, always.
- One series: no legend, the title names it. Two or three: legend above plus the name at the line's end.
- Hover: crosshair (`outline` 1px), ringed points (2px `raised` ring), tooltip card (`bg-raised inset-ring inset-ring-border shadow-sm`, date xs muted, rows: dot, name, mono value).
- Text is never in a series colour. Every chart has a table view. Empty charts explain why; loading keeps the card and axes.
- Stat cards: `bg-raised shadow-sm p-4`, label `text-sm text-muted` with icon, value `text-2xl font-semibold tabular-nums`,
  change `text-xs` with a trending icon + the comparison in words.

## 8. Dashboard: page layout and tables

Boards: `design/boards/10-Dashboard-*.png` (layout, page header, search and filters), `7-Tables-*.png` (table details).

**Layout.** Sidebar 224 on `bg-page` + `border-r`, then a column with a top bar and the page.
- Sidebar, top to bottom: logo, workspace switcher (`h-10`, `inset-ring-2 inset-ring-control`), nav rows, Settings pinned at the bottom.
  Nav rows are list rows (below): `h-8 px-2 gap-2 rounded-md`, icon `text-muted`; hover `bg-hover`;
  current `bg-selected font-medium`, icon `text-foreground`, `aria-current="page"`. Counts `text-xs text-muted tabular-nums`.
- Top bar: `h-14 px-6 border-b`. Left: breadcrumb (`text-muted`, last item `text-foreground font-medium`). Right: the ⌘K
  search-or-command button (`h-8`, 256 wide, `inset-ring-2 inset-ring-control`), Help and Notifications (ghost icon buttons; unread =
  an 8px `bg-accent` dot with a 2px `page` ring), then the account button (avatar + name + chevron).
- Page: `p-8`, page header, `gap-6`, then the content. The page scrolls; the table header row sticks.

**Page header** (`<PageHeader title description? actions? breadcrumb?>`, renders the page's only `h1`).
- Title `text-2xl font-semibold`, one line, line box 40 so it centres with md buttons. Description optional: `text-base text-muted`,
  max 640 wide, two lines at most; say what the page holds. Breadcrumb optional and only when nested: `text-sm text-muted`, 8 above.
- Actions optional, top right, aligned to the title row: at most one primary, on the far right; secondary (outlined) to its left;
  more than three → a ⋯ secondary icon button ("More actions"). Under 640 wide the actions wrap below the description, full width.

**Search and filters** (the row above the table, `p-3 gap-2 border-b`).
- Search: `h-8`, 256 wide, search icon, placeholder "Search docs", `/` hint as a `kbd`; with a value, a ghost xs × clears it.
  Filters as you type (150 ms), matches titles and body text, `/` focuses, Esc clears.
- Filter buttons: `h-8 inset-ring-2 inset-ring-control` + chevron. Open = a popover with its own search (when more than 7 options), a
  checkbox list with counts (`menuitemcheckbox`), and Clear / Apply. Applied = `bg-selected`, no edge, "Status: Live" + ×.
  AND across filters, OR within one. "Clear all" (ghost) appears once anything is applied.
- With anything applied, a count line under the row: `text-xs text-muted`, "3 of 134 docs".
- Nothing found: say what was searched and which filters are on, one "Clear search and filters" button.
- Search and filters live in the URL. Columns and Export sit at the right end of the row.

**Tables**
- On the page fill the table sits in a frame: `rounded-lg inset-ring inset-ring-border overflow-hidden`, no shadow. On a panel ground it is a raised card. Header `text-xs font-semibold text-muted`, 40 tall, `border-b`.
  Sortable headers are buttons: muted ⇅ when unsorted; sorted = text colour + direction arrow + `aria-sort`.
- Pagination: previous, first, current ± 1, …, last, next. Current page = `inset-ring-2 inset-ring-control font-semibold` + `aria-current="page"`; others ghost; arrows disabled at the ends. Left: rows-per-page select, then the range ("21–40 of 134"); right: the page numbers only.
- Rows 48, `border-b`, hover `bg-hover`, selected `bg-selected` with a checked box; the header box shows "some".
- Numbers right-aligned in mono xs. Row actions: `xs` ghost icon buttons, visible on row hover and focus.
- Filters in one row above: search, filter buttons (applied = `bg-selected` + clear ×), Clear, then date range and Export at the right.
- Selection swaps the filter row for a selection row in the same place and style (padding 12, `border-b`): "2 selected" (600) + ghost Clear on the left;
  sm secondary actions on the right, Delete last with `text-danger`. Esc or Clear deselects. No dark bar.
- Loading = skeleton rows in real columns; empty = which filters + Clear filters.

## 9. Sign-in, states, toasts, phones

Boards: `5-SignIn`, `6-States`, `9-Phone`.
- **Auth pages:** one `bg-raised rounded-xl shadow-sm p-6` card, max 384 wide, on `bg-panel`, logo above. Groups 24 apart, 12 inside.
  **Email first:** step 1 is Google + GitHub side by side, "or", Email + Continue — nothing else. Passkeys come through the email
  field's autofill (`autocomplete="username webauthn"`, WebAuthn conditional UI), so there is no passkey button. Step 2 (password)
  shows the address with Change, the password field with Forgot?, Sign in, and "Email me a sign-in link instead".
  Sign up uses the same step 1; name and password come next. Errors on blur, never while typing.
  Consent shows both logos, allowed scopes (ticks), not-asked scopes (muted ×), then one quiet line: account, change folders.
- **Provider and AI-app logos:** use each provider's official SVG (Google's sign-in branding kit, GitHub's logo page,
  each AI app's press kit), unmodified, at 16px in buttons and in the 24/48 app-avatar slot elsewhere. Keep them in
  `packages/web/src/brand/` — the only files allowed non-token colours (mark `design-ok`). Never redraw or recolour a logo.
- **Loading:** skeleton bars `bg-hover rounded-sm` (the `Skeleton` component, the loading skeletons included), no shimmer, after 300 ms. Spinner = Lucide `loader-circle`, muted, only in a known spot
  (button, save state, block). Full-page spinner only with a sentence.
- **Empty:** icon tile (`bg-hover rounded-lg` 40), 600 title, one muted sentence, at most one button. Never "No data".
- **Errors:** say what happened, whether work is safe, what to do. Inline stays inline; full page only for a lost page (404/403/500 with a mono reference).
  A crash inside one part (a side panel tab, the preview, a drawn block, the comments) stays in that part (`ErrorBoundary`,
  blocks/error-boundary.tsx): "Something went wrong here." muted, and a ghost "Try again"; the rest of the page keeps working.
- **Notice bar** over the doc (drafts to import, taken down, a conflict, editing by link, a revoked link): one component,
  `NoticeBar` (workspace/shell/notice-bar.tsx): `border-b px-4 py-2 text-sm`, info `bg-primary/5`, danger `bg-danger/10`, the
  title in 500, a muted detail line hidden on a phone, the buttons at the end.
  Offline is a banner under the header (warning icon), not a toast.
- **Toasts:** bottom right on desktop, bottom centre on phones, 16 from the edges, max 400 wide, two lines then cut.
  Icons only for done (`circle-check`), working (`loader-circle`) and error (`circle-alert`). Plain toasts leave after 5 s (paused on hover/focus);
  errors stay until closed. Stack newest at the bottom, 3 visible, 8 apart.
- **Phone width (< 640):** top bar 56 with `size-12` buttons; the sidebar is a drawer at 85% over the scrim; popovers become bottom sheets;
  the format bar is fixed to the bottom and rides on the keyboard (visualViewport); tables scroll inside the page margins;
  dashboard: stat cards 2 × 2, one chart, tables become lists.

## 10. Before you finish any UI change

- [ ] `bun run check:design` passes (no raw values, no old icons)
- [ ] Looks right in light and dark (`data-theme="dark"`)
- [ ] Every interactive element has hover, focus-visible, and disabled where it applies
- [ ] Compared side by side with the matching board PNG in `design/boards/`
