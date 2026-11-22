# Changelog

The format follows [Keep a Changelog](https://keepachangelog.com/en/1.1.0/). The versions follow [Semantic Versioning](https://semver.org/spec/v2.0.0.html). Until `1.0.0`, any alpha can break the API.

## [Unreleased]

### Changed

- The repository is public, under the MIT license (`LICENSE`). Install it from GitHub with no SSH key:
  `"@omuk/ui": "github:omukhq/omuk-ui#<tag>"`.
- `docs/DESIGN.md` is the Omuk UI design system, no longer Markpad's: the rules for Markpad's own screens (the editor
  toolbar, the document, the library sidebar, reading fonts) are gone, and the field recipe matches the code (2px edge).
- `docs/design-guide.md` is the component guide, no longer the migration notes from Markpad.

## [1.0.0-alpha.21] - 2026-11-21

### Removed

- The `@omuk/ui/prompt-store` entry (added in alpha.19). Since alpha.20, `@omuk/ui/prompt` holds no dialog code, so the second entry has no use. To update: import `usePrompt` and `prompt` from `@omuk/ui/prompt`.

## [1.0.0-alpha.20] - 2026-11-21

### Changed

- `PromptProvider` loads the alert, dialog and drawer code itself when the first prompt opens, so `@omuk/ui/prompt` carries none of it: import `usePrompt` and `PromptProvider` from `@omuk/ui/prompt`, as before alpha.19. A page that never opens a prompt never loads the dialogs. Nothing to update; `@omuk/ui/prompt-store` still exports `usePrompt` and `prompt`, but `@omuk/ui/prompt` is the import to use.

## [1.0.0-alpha.19] - 2026-11-21

### Added

- `@omuk/ui/prompt-store` exports `usePrompt` and `prompt` (and `subscribe`, `snapshot`), without the dialog and drawer code. Code that only opens prompts can import from it, and an app can load `<PromptProvider />` when the first prompt opens (`subscribe` tells it). `@omuk/ui/prompt` re-exports `usePrompt` and `prompt` as before: nothing to update.

## [1.0.0-alpha.18] - 2026-11-20

### Changed

- `Button` with `size="sm"` writes its label in `text-xs` and `font-normal`; it was `text-sm` and `font-medium`. A small button in a table row or a card header (Record payment, Turn all off) is smaller and lighter now.

## [1.0.0-alpha.17] - 2026-11-19

### Added

- `DatePicker` takes `align`: `start` (default) lines the calendar up with the field's left edge, `end` with its right edge. A field near the right edge of the page (a toolbar's date filter) uses `end`, so the calendar opens under it.

## [1.0.0-alpha.16] - 2026-11-19

### Changed

- **Breaking:** `DatePicker` fills the width it gets, like `Input`; it was as wide as its value. `className` now goes on the picker's outer box, so it sets the width. To keep the old look (in a toolbar, say), pass `className="w-fit"`.

## [1.0.0-alpha.15] - 2026-11-19

### Added

- `Sortable`, `SortableItem` and `SortableHandle` (`@omuk/ui/sortable`): a list the person puts in order, by drag (mouse or touch, through the handle) or by Up and Down on the focused handle, with a live-region announcement. `value` is the items' ids in order; `onValueChange` gets the new order. No dependency. The ordering arithmetic is `sortable-order.ts`, tested.

## [1.0.0-alpha.14] - 2026-11-18

### Changed

- A loading `Button` takes the disabled look (a grey fill and muted text, or muted text for ghost and link), with the spinner in the muted colour. A black button with a spinner looked as if it could still be pressed. Its size does not change.

## [1.0.0-alpha.13] - 2026-11-18

### Added

- Toasts in colour (dash-kit design/toasts.html): a plain toast is the raised surface; success, info, warning and error each take a soft fill of their colour with no edge, and the icon in the strong colour. Colour roles `info`, and `success-soft`, `info-soft`, `warning-soft`, `danger-soft` with their `on-*-soft` text, each with a dark value.
- `toast.warning`, `toast.loading`, and `toast.promise(work, { loading, success, error })`: one toast with a spinner that turns into the success or the error toast in place. Info and warning have icons.
- Toasts stack as sonner's: the newest in front, the older ones peeking out 12 above it each, a little smaller. Pointing at the stack, focusing in it, or tapping it on a phone opens it into a list 8 apart and holds the timers.

### Changed

- Every toast in the stack takes its width (up to 384), with 6 vertical padding; the action button is `text-xs` in the toast's own colour.
- The same words of the same kind, still open, show once: a second identical toast updates the first.
- `Toaster`'s `closeButton` is on by default: an error, which stays until closed, has its ×.

## [1.0.0-alpha.12] - 2026-11-18

### Fixed

- `data-horizontal:` and `data-vertical:` now apply. They read `data-orientation`, which the parts set; Tailwind looked for a `data-horizontal` attribute, which none set. A horizontal `Separator` was invisible (0 tall), a horizontal `Tabs` drew its panel beside the list, and the `line` tab list had no underline. `ButtonGroup` and `Field` are fixed too.
- The `destructive` button's edge turns red on hover, not grey.
- A selected tab (`TabsList variant="default"`) and a chosen `Segmented` item keep their raised fill on hover. The grey hover fill covered it; now only the other items take it.
- Toasts sit 16 up from the bottom edge, as from the sides. They touched the edge when no `offset` was given.
- The toaster no longer throws `showPopover` on a node out of the page (a hidden subtree shown again), which crashed the page.
- Tooltips inside a `TooltipProvider` are a group: one shows at a time. Opening one ends the last one at once, with no fade, and for 400 ms after one closes the next opens with no delay. A fast pointer across a row of icons left a trail of fading tooltips.

## [1.0.0-alpha.11] - 2026-11-18

### Added

- Motion: the enter and exit animations (`animate-in`, `fade-*`, `zoom-*`, `slide-*`) are defined in theme.css. The kit used these names, but nothing defined them: popovers, menus, dialogs and sheets now animate. Reduced motion turns them off.
- `PopoverClose`: a × that closes its popover.
- The `no-scrollbar` utility, and the `ease-sheet` token (a native sheet's curve).
- Avatar sizes `lg` 32, `xl` 40, `2xl` 48.
- Avatar colour roles `avatar-1…6` and `on-avatar-1…6`, with dark-mode values.
- `InputGroup` props `stacked` and `disabled`; recipes `FIELD_OFF` and `FIELD_TEXT_OFF`.

### Changed

- Avatar colours are soft washes of six hues (blue, teal, violet, amber, pink, green) with darker text, not saturated fills with white. `sm` shows one letter.
- A popover's phone sheet slides on `ease-sheet` over 400, with a fading scrim, and keeps the usual control sizes (36, not 48).
- A side drawer is three quarters of the width (at most 384).
- Fields are 14 at every width (phones had 16).
- Checkbox, radio and switch have no hover edge.
- DatePicker: the placeholder stays while the calendar is open (the field no longer grows); its buttons sit at the field's end; the end padding is 4.
- Components add a state's classes only when in that state (Button, InputGroup, Checkbox, Radio, Switch, Tabs, Segmented, the fields, calendar days): about a third fewer classes, the same look.

### Breaking

- Avatar `lg` is 32 (was 48): use `2xl` for 48.
- `InputGroup`: a stacked layout (a `block-start` or `block-end` addon, a textarea) needs `stacked`.
- `FIELD` and `FIELD_TEXT` no longer carry the disabled look: add `FIELD_OFF` or `FIELD_TEXT_OFF` when disabled.
- A button disabled only by a `<fieldset disabled>` no longer looks disabled.

## [1.0.0-alpha.10] - 2026-11-18

### Added

- `DatePicker` (`@omuk/ui/date-picker`): one component with a `mode`: `date` (with `granularity="minute"`, a day and a time), `range` (with `presets`) or `time`. The value is ISO text and its type follows the mode. Our own code, no package: React Aria's typed parts (the language's order from `Intl`, digits, arrows, Page Up/Down, Home/End, Backspace, a/p), the calendar button in the field, `minValue`, `maxValue`, `isDateUnavailable`, `visibleMonths`, `validate`, hidden inputs; `placeholder`, `prefix` and `showClear` for filters. Gregorian only.
- `Calendar` (`@omuk/ui/calendar`): one day or a range, the grid keys, today as a light grey fill, the range band and its preview, screen reader names.
- Combobox: `ComboboxButton` (the field as a button, the search in the list), `ComboboxStatus` (a polite live message), `ComboboxChipsMore` ("+3 more"), a `placeholder` on `ComboboxValue`, a `size` on `ComboboxInput`.
- The `on-accent` colour token: text on an accent fill.

### Changed

- Fields and outlined buttons have a 2px edge (React Spectrum's recipe; 1px since alpha.2), and the focus ring's inner edge is 2px (owner, 18 Nov 2026).
- Every control's default size is 36 (buttons were 32); `lg` stays as a name.
- Every icon button in a field is 24 (the combobox's chevron and clear, the date picker's).
- Combobox: the list sits under the whole field (a label before the text no longer pushes it right); the tick is at the end of the option; the clear button is "Clear <label>".

### Breaking

- None for code. Buttons and fields look heavier and taller.

## [1.0.0-alpha.9] - 2026-11-18

### Changed

- Dark mode is a soft slate, not black: the page is `gray-800` (was `gray-900`), the panel `gray-900`, cards and popovers `gray-700` (owner, 18 Nov 2026).
- In dark mode, lines (`border`) and field edges (`control`) are white tints (10% and 16%), not grey shades, so they show on the page and on a card alike.
- The focus ring is grey, not blue: a 1px `outline` edge and a 3px `control` halo (`gray-500` and `gray-200` in light mode), on every control (owner, 18 Nov 2026).
- Fields (input, textarea, select, combobox, input group, OTP) no longer darken their edge on hover (owner, 18 Nov 2026). The focus ring and the danger edge stay; outlined buttons keep their hover edge.
- In dark mode the hover tint is white at 7% (was 4.5%) and the selected tint 12% (was 9%): on the slate page a badge's fill and a hovered row hardly showed.
- In dark mode the hover edge is `gray-400` (5.6:1) and danger `red-300` (`red-400` is 3.6:1 on a card). Text, links and the other status colours stay at 5.7:1 or more.

### Breaking

- None for code. Dark mode looks lighter.

## [1.0.0-alpha.8] - 2026-11-18

### Changed

- In dark mode `shadow-sm` and `shadow-lg` also draw a faint light outline (white at 8%): a black shadow hardly shows on a dark page, so a shadow alone now marks a card, a popover or a dialog in both modes. No `dark:` edge beside it.
- Dark mode is a softer black: the page is `gray-900` (was `gray-950`), and the panel behind cards is `gray-950` (was `gray-900`), one step darker than the page as in light mode. Text, links and status colours keep 4.5:1 or more on it; the hover edge 3.7:1.

### Breaking

- None for code. Dark mode looks lighter.

## [1.0.0-alpha.7] - 2026-11-18

### Changed

- Radius is Tailwind's own scale; `theme.css` sets none. The class names stay, the corners get one step smaller: `rounded-sm` 4, `rounded-md` 6 (was 8: buttons, fields, rows), `rounded-lg` 8 (was 12: menus, popovers, cards), `rounded-xl` 12 (was 16: dialogs, drawers) (owner, 18 Nov 2026).
- `text-base`, `leading-tight` and `leading-normal` are Tailwind's (the same values). The other interface sizes stay (`2xs` 10, `xs` 12 and `sm` 14 at 1.5, `lg` 20, `xl` 24, `2xl` 32); Tailwind's `3xl` and up, `leading-snug` and `leading-loose` are off.
- The display sizes `text-5xl` and `text-6xl` are gone: nothing used them.

### Breaking

- No class changes name. Corners are smaller.
- `text-5xl` and `text-6xl` draw nothing.

## [1.0.0-alpha.6] - 2026-11-18

### Changed

- The palette is Tailwind's own: `theme.css` defines no palette colour, only the roles. Every colour changes a little: greys are cooler, blues, reds and greens brighter. Tailwind's other families stay off.
- Two roles moved one shade darker to keep their contrast: `success` is `green-700` in light mode (4.9:1 on white), the hover edge `outline` is `gray-500` (4.8:1). The hover and selected tints are 4% and 8% of `gray-950` through `color-mix`.
- `tailwindcss` ^4 is a peer dependency: the components' classes and `theme.css` need it.

### Breaking

- Colours look different. Check any screen that pairs palette shades by hand (tags, avatars, charts): the avatar colours were checked (white text at 4.5:1 or more).

## [1.0.0-alpha.5] - 2026-11-18

### Changed

- What Tailwind already has comes from Tailwind: `white`, `black` (the same values), and the built-in `transparent` and `current`. `theme.css` no longer wipes all of Tailwind's colours (`--color-*: initial`); it switches off only the families Omuk does not use (slate, zinc, neutral, stone, mauve, olive, mist, taupe, lime, emerald, cyan, indigo, purple, fuchsia, rose). Omuk's eleven families still replace Tailwind's, shade by shade.
- Colour roles have no middle layer: `--color-page` points at its palette shade (`--color-white`), and dark mode sets `--color-page` again, where it used to go `--color-page` → `--c-page` → `--color-white`. The classes are the same. Shadows keep `--elevation-*`, the one nesting kept on purpose: Tailwind copies a literal shadow into its class, so dark mode could not swap it.

### Breaking

- The `--c-*` variables are gone. Code that read them (`getComputedStyle(…).getPropertyValue('--c-page')`) reads `--color-page` instead.

## [1.0.0-alpha.4] - 2026-11-18

### Changed

- Outlined buttons (`outline`, `secondary`, `destructive`) have the 1-wide edge, the same as fields: filter buttons, pagination, select triggers and fields now match. Checkboxes, radios and the switch keep the 2-wide edge, so a small box stays easy to see. (`src/button.tsx`; DESIGN.md, section 3.)

### Breaking

- None for code. Outlined buttons look thinner.

## [1.0.0-alpha.3] - 2026-11-18

### Added

- `@omuk/ui/prompt`: `usePrompt()` (and `prompt` for code outside React) opens an alert, a modal or a drawer from any handler, and gives its answer as a promise; `<PromptProvider />` draws them. An alert gives `true` or `false`; its `onAction` keeps it open while the work runs, with the button's spinner, and shows a thrown error's message. A modal or a drawer gives what its `content` passes to `close`, or `null`. Prompts stack; a closed one leaves after its closing animation. Made after nextkit's `usePrompt`, with no store library: the store is `src/prompt-store.ts`, read with `useSyncExternalStore` as the toasts are.

### Breaking

- None.

## [1.0.0-alpha.2] - 2026-11-18

### Changed

- Every field has a 1-wide edge at rest: input, textarea, select, combobox, input group, OTP digits. The colour stays `control`, darker (`outline`) on hover; the focus ring is the same. An invalid field keeps its 2-wide danger edge. Checkboxes, radios, switches and outlined buttons keep their 2-wide edge. (`FIELD_EDGE`, `FIELD_WRAPPER_EDGE` in `src/recipes.ts`; DESIGN.md, section 3.)
- `InputGroup`'s `edge="thin"` is now the same as the default. It stays, so callers keep working.

### Breaking

- None for code. Fields look thinner.

## [1.0.0-alpha.1] - 2026-11-17

### Changed

- Omuk UI moved out of the Markpad repository (`packages/omuk-ui`) into its own private repository, `omukhq/omuk-ui`. The Git history of the package came with it.
- Projects install it from GitHub with a tag, not with `workspace:*`.
- The kit version (`v3.13`) is gone from the header of `src/design/theme.css`. The package version is the kit's only version.
- The package has its own lint, type check and test setup. It no longer reads Markpad's root config.
- `docs/DESIGN.md` and `docs/design-guide.md` are copies of Markpad's design rules.

### Breaking

- None for code. The components, exports and tokens are the same as in Markpad's last `packages/omuk-ui`.
