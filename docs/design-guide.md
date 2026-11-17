# Beta — component design guide

Status: 26 components and the toasts are built and swapped in. Priority 1
and 2 (button, separator, input, button group, tooltip, tabs, popover,
dropdown menu, context menu, dialog, alert dialog, checkbox, switch, badge)
and the dashboard's (select, combobox, drawer, table, pagination, card,
field, label, input group, textarea, skeleton, spinner). Input OTP came from
the old kit as it was (2026-11-15). The package's `package.json` lists every
export.

Known differences from Base UI:

- A disabled checkbox looks faded. The root's `disabled:opacity-50` never
  matched Base UI's `<span>`; ours is a `<button>`, so it applies.
- Enter does not toggle a checkbox (WAI-ARIA); Space does.
- Select: when the list cannot open over its trigger, it opens below rather
  than shrinking; it opens on click, not on press; no `multiple`.
- Drawer: swipe to close works for left and right drawers only.

Beta has its own UI components, the workspace package `@omuk/ui` in
`packages/omuk-ui/`. They replaced the Base UI wrappers that were in the root
`src/components/ui/` (now deleted). This guide gives the rules for each
component.

## Goals

1. **The same look.** A component in beta looks the same as its root version.
   The user must not see a difference.
2. **The same props.** Each component has the same file name, the same exports
   and the same props as its root version. The shared editor code does not
   change when beta swaps a component in.
3. **Small.** Each component is as small as possible. The browser's own
   features do the work where they can.
4. **Accessible.** Each component works with the keyboard and with a screen
   reader, to the WAI-ARIA Authoring Practices pattern for its role.

## Rules

- Every colour, font, font size, radius and spacing value must come from a
  token. Write no hex, RGB, OKLCH, pixel or font-name value in a component.
- Use the Tailwind classes that map to the tokens (`bg-primary`,
  `text-muted`, `rounded-md`, `text-sm`, `gap-2`). An arbitrary
  value (`[…]`) is allowed only with a token in it: `h-[var(--…)]`.
- Keep the class strings that the components took from the old Base UI kit.
  The old kit's data attributes are mapped to ours (see "State attributes").
- A component must not import another package without a size check.
  `class-variance-authority` and `cn` (the package's `./utils`) are allowed.
  A component must not import from the app (`@/…`, `@beta/…`).
- A modal or a confirmation goes through `usePrompt`. Do not use `Dialog` or
  `AlertDialog` directly in a feature.
- Do not use `useEffect`. Use a ref callback, an event handler or
  `useSyncExternalStore`.

The test `packages/omuk-ui/src/tokens.test.ts` fails when a literal value is
in a file of the package. `apps/app/src/tokens.test.ts` does the same for
`apps/app/src/`.

## Tokens

The tokens are the design system's, in the root `packages/omuk-ui/src/design/theme.css`. The
rules for each one are in the root `DESIGN.md`. Beta loads them through the
root `packages/web/src/styles/globals.css`.

The old names from before the design system (`bg-background`,
`rounded-old-lg`, …) are retired (decisions, R54): every component uses the
theme's names, and `check:design` fails on an old one. The table in
`docs/design/token-map.md` records what each became.

Dark mode: `data-theme="dark"` on `<html>` changes the token values. A
component uses the same classes in both modes.

## What the browser does for us

| Need | Browser feature | Notes |
|---|---|---|
| Modal with focus trap and Escape | `<dialog>` with `showModal()` | It is in the top layer. Our code adds a Tab loop, because Chrome lets Tab out to its own controls. |
| A popup in the top layer | The `popover` attribute, as `manual` | Our code closes it on an outside press and on Escape. The browser's `auto` mode hides at once, so the exit animation cannot play. |
| Place a popover beside its button | A script (`position.ts`) | CSS anchor positioning cannot tell the page which side the popup took, and the class strings need `data-side`. |
| A button that opens a popover | `popovertarget` | No script for open and close. |
| Disclosure (details) | `<details>` and `<summary>` | |

## State attributes

Base UI marks state with data attributes, and the root class strings use them.
Our components set the same attributes:

| Attribute | When |
|---|---|
| `data-open` / `data-closed` | A popover, menu or dialog is open or closed |
| `data-side="top|bottom|left|right"` | The side where a popover opened |
| `data-highlighted` | The menu item that has keyboard focus |
| `data-disabled` | The item is disabled |
| `data-checked` / `data-unchecked` | A checkbox, switch or checkbox item |
| `data-active` | The selected tab |
| `data-slot="…"` | The part's name, as in the root components |

Animations use these attributes and stop under `prefers-reduced-motion`.

## The `render` prop

The root code uses `render={<a href="…" />}` (11 times) to draw a trigger or an
item as another element. Our components accept `render` the same way: the
component merges its props and its ref into that element.

## Components

Priority 1 is on the editor's first screen. Priority 2 is in the editor, but
loads on first use. Priority 3 is in the dashboard and the sign-in pages.

| Component | Root file | Built on | Priority | Keyboard |
|---|---|---|---|---|
| Button | `button.tsx` | `<button>` | 1 | Native |
| Tooltip | `tooltip.tsx` | `popover="manual"`, `position.ts` | 1 | Shows on focus. Escape closes it. |
| Tabs | `tabs.tsx` | `role="tablist"` | 1 | Arrow keys move, Home and End. Automatic activation. |
| Separator | `separator.tsx` | `<hr>` or `role="separator"` | 1 | None |
| Skeleton | `skeleton.tsx` | `<div>` | 1 | None |
| Input, Textarea | `input.tsx`, `textarea.tsx` | Native | 1 | Native |
| Dropdown menu | `dropdown-menu.tsx` | `popover` + `role="menu"` | 2 | Arrow keys, Home, End, type to find, Enter, Escape, submenus with Right and Left |
| Context menu | `context-menu.tsx` | The same menu, opened at the pointer | 2 | As the dropdown menu, plus Shift+F10 |
| Popover | `popover.tsx` | `popover` | 2 | Escape closes it, focus goes back to the trigger |
| Dialog | `dialog.tsx` | `<dialog>` | 2 | Native |
| Alert dialog | `alert-dialog.tsx` | `<dialog>`, `role="alertdialog"` | 2 | Native. Focus starts on the safe action. |
| Checkbox | `checkbox.tsx` | `<button role="checkbox">` | 2 | Space |
| Switch | `switch.tsx` | `<button role="switch">` | 2 | Space |
| Badge | `badge.tsx` | `<span>` | 2 | None |
| Input OTP | `input-otp.tsx` | Native inputs | 3 | Native |
| Select | `select.tsx` | `popover` + `role="listbox"` | 3 | Arrow keys, type to find |
| Combobox | `combobox.tsx` | `<input>` + `role="listbox"` | 3 | Arrow keys, Enter, Escape |
| Drawer | `drawer.tsx` | `<dialog>` at the bottom | 3 | Native |
| Table, pagination, card, field, label, button group, input group | Same names | Plain elements | 3 | Native |
| Toasts | the `sonner` package | `sonner.tsx`, a small store and `aria-live` | 1 | The action and the close button are buttons. Pointer over the toasts stops their timers. |

Build priority 1 first. The editor's first screen then has no Base UI.

The toasts replace a package, not a root component. Shared code imports
`toast` from `@omuk/ui/sonner`, with the same calls as the `sonner` package
(`toast.success(…)`).

## Behaviour shared by all popups

- **Focus.** When a popup opens, focus goes into it. When it closes, focus
  goes back to the element that opened it.
- **Dismiss.** Escape closes the top popup. A click outside closes popovers
  and menus, not modal dialogs.
- **Stacking.** The top layer keeps the newest popup on top. Do not use
  `z-index` for popups.
- **Position.** A popover opens on the side that the code asks for. If there
  is no space, it opens on the other side and sets `data-side`.
- **Hover.** A menu bar opens the next menu when the pointer moves to its
  button while a menu is open, as the root menu bar does.
- **Load early.** A component that loads on first use starts its import on
  pointer-over or focus of its trigger.

## How to check a component

1. Compare it with the board at `/ui`, in light and dark mode.
2. Use it with the keyboard only. Every action must work.
3. Use it with VoiceOver on macOS. The role, the name and the state must be
   read correctly.
4. Use it on a phone (the OnePlus and the vivo), with touch.
5. Check that `tokens.test.ts` passes.
6. Write the component's compressed size in the pull request.

## Technical note

- Package: `packages/omuk-ui/package.json` lists one export for each file.
  Add the export with the file.
- Showcase: `http://localhost:4004/ui` (development only) shows only our
  design system: the components board, then each component in use. Source:
  `apps/app/src/apps/ui/`.
- Shared parts: `render.tsx` (the `render` prop), `popup.tsx` (open state,
  the stack that Escape and an outside press act on, the frame that shows,
  places and animates a popup), `position.ts` (side, flip, shift, the
  `--anchor-width`, `--available-height` and `--transform-origin`
  variables), `menu.tsx` (one menu for the dropdown and the context menu),
  `modal.tsx` (one `<dialog>` for the dialog and the alert dialog).
- Root class strings with a literal pixel value use the equal token class:
  `rounded-[min(var(--radius-md),8px)]` is `rounded-md`, `rounded-[2px]` is
  `rounded-xs`, `p-[3px]` is `p-[calc(var(--spacing)*0.75)]`.
- `biome.json` gives `packages/omuk-ui/**` the lint exceptions that the old
  kit had.
