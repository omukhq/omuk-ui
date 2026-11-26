# Component guide

How Omuk UI's components are built: the goals, the rules, what the browser does for us, and how each component
behaves with the keyboard. The look (tokens, colours, recipes) is in [DESIGN.md](DESIGN.md).

The components replaced the Base UI wrappers that our apps used before. They keep the same class strings and the
same data attributes, so an app could swap them in without a visible change.

Known differences from Base UI:

- A disabled checkbox looks faded: ours is a `<button>`, so `disabled:opacity-50` applies.
- Enter does not toggle a checkbox (WAI-ARIA); Space does.
- Select: when the list cannot open over its trigger, it opens below rather than shrinking; it opens on click, not on
  press; no `multiple`.
- Drawer: swipe to close works for left and right drawers only.

## Goals

1. **Small.** Each component is as small as possible. The browser's own features do the work where they can.
2. **Accessible.** Each component works with the keyboard and with a screen reader, to the WAI-ARIA Authoring
   Practices pattern for its role.
3. **Stable props.** A component keeps its file name, its exports and its props. A change to them is a breaking
   change (README, Versions).

## Rules

- Every colour, font, font size, radius and spacing value must come from a token. Write no hex, RGB, OKLCH, pixel or
  font-name value in a component.
- Use the Tailwind classes that map to the tokens (`bg-primary`, `text-muted`, `rounded-md`, `text-sm`, `gap-2`). An
  arbitrary value (`[…]`) is allowed only with a token in it: `h-[var(--…)]`.
- A component must not import another package without a size check. `class-variance-authority` and `cn`
  (`./utils`) are allowed. A component must not import from an app.
- A modal or a confirmation goes through `usePrompt`. An app does not use `Dialog` or `AlertDialog` directly in a
  feature.
- Do not use `useEffect`. Use a ref callback, an event handler or `useSyncExternalStore`.

The test `src/tokens.test.ts` fails when a literal value is in a file of the package.

## Tokens

The tokens are in `src/design/theme.css`; the rules for each one are in [DESIGN.md](DESIGN.md). Dark mode:
`data-theme="dark"` on `<html>` (or on an area inside the page) changes the token values. Without it, the page
follows the system's setting. A component uses the same classes in both modes.

## What the browser does for us

| Need | Browser feature | Notes |
|---|---|---|
| Modal with focus trap and Escape | `<dialog>` with `showModal()` | It is in the top layer. Our code adds a Tab loop, because Chrome lets Tab out to its own controls. |
| A popup in the top layer | The `popover` attribute, as `manual` | Our code closes it on an outside press and on Escape. The browser's `auto` mode hides at once, so the exit animation cannot play. |
| Place a popover beside its button | A script (`position.ts`) | CSS anchor positioning cannot tell the page which side the popup took, and the class strings need `data-side`. |
| A button that opens a popover | `popovertarget` | No script for open and close. |
| Disclosure (details) | `<details>` and `<summary>` | |

## State attributes

The components mark their state with data attributes, and the class strings use them:

| Attribute | When |
|---|---|
| `data-open` / `data-closed` | A popover, menu or dialog is open or closed |
| `data-side="top|bottom|left|right"` | The side where a popover opened |
| `data-highlighted` | The menu item that has keyboard focus |
| `data-disabled` | The item is disabled |
| `data-checked` / `data-unchecked` | A checkbox, switch or checkbox item |
| `data-active` | The selected tab |
| `data-slot="…"` | The part's name |

Animations use these attributes and stop under `prefers-reduced-motion`.

## The `render` prop

`render={<a href="…" />}` draws a trigger or an item as another element. The component merges its props and its ref
into that element.

## Components

| Component | File | Built on | Keyboard |
|---|---|---|---|
| Button | `button.tsx` | `<button>` | Native |
| Tooltip | `tooltip.tsx` | `popover="manual"`, `position.ts` | Shows on focus. Escape closes it. |
| Tabs | `tabs.tsx` | `role="tablist"` | Arrow keys move, Home and End. Automatic activation. |
| Separator | `separator.tsx` | `<hr>` or `role="separator"` | None |
| Skeleton | `skeleton.tsx` | `<div>` | None |
| Input, Textarea | `input.tsx`, `textarea.tsx` | Native | Native |
| Dropdown menu | `dropdown-menu.tsx` | `popover` + `role="menu"` | Arrow keys, Home, End, type to find, Enter, Escape, submenus with Right and Left |
| Context menu | `context-menu.tsx` | The same menu, opened at the pointer | As the dropdown menu, plus Shift+F10 |
| Popover | `popover.tsx` | `popover` | Escape closes it, focus goes back to the trigger |
| Dialog | `dialog.tsx` | `<dialog>` | Native |
| Alert dialog | `alert-dialog.tsx` | `<dialog>`, `role="alertdialog"` | Native. Focus starts on the safe action. |
| Checkbox | `checkbox.tsx` | `<button role="checkbox">` | Space |
| Switch | `switch.tsx` | `<button role="switch">` | Space |
| Badge | `badge.tsx` | `<span>` | None |
| Input OTP | `input-otp.tsx` | Native inputs | Native |
| Select | `select.tsx` | `popover` + `role="listbox"` | Arrow keys, type to find |
| Combobox | `combobox.tsx` | `<input>` + `role="listbox"` | Arrow keys, Enter, Escape |
| Drawer | `drawer.tsx` | `<dialog>` at the bottom | Native |
| Date picker, Calendar | `date-picker.tsx`, `calendar.tsx` | Typed segments, a grid | Arrow keys step a part; the calendar's arrow keys move by day and week |
| Sortable | `sortable.tsx` | Pointer events | Up and Down move the item from its handle; Escape ends a drag |
| Table, pagination, card, field, label, button group, input group | Same names | Plain elements | Native |
| Toasts | `sonner.tsx` | A small store and `aria-live` | The action and the close button are buttons. Pointer over the toasts stops their timers. |

The toasts take the place of the `sonner` package, with the same calls (`toast.success(…)`).

## Behaviour shared by all popups

- **Focus.** When a popup opens, focus goes into it. When it closes, focus goes back to the element that opened it.
- **Dismiss.** Escape closes the top popup. A click outside closes popovers and menus, not modal dialogs.
- **Stacking.** The top layer keeps the newest popup on top. Do not use `z-index` for popups.
- **Position.** A popover opens on the side that the code asks for. If there is no space, it opens on the other side
  and sets `data-side`.
- **Hover.** A menu bar opens the next menu when the pointer moves to its button while a menu is open.
- **Load early.** A component that loads on first use starts its import on pointer-over or focus of its trigger.

## How to check a component

1. Look at it in light and dark mode.
2. Use it with the keyboard only. Every action must work.
3. Use it with a screen reader (VoiceOver on macOS). The role, the name and the state must be read correctly.
4. Use it on a phone, with touch.
5. Check that `bun run check` passes (the token test included).
6. Write the component's compressed size in the pull request.

## Technical note

- `package.json` lists one export for each file. Add the export with the file.
- Shared parts: `render.tsx` (the `render` prop), `popup.tsx` (open state, the stack that Escape and an outside press
  act on, the frame that shows, places and animates a popup), `position.ts` (side, flip, shift, the `--anchor-width`,
  `--available-height` and `--transform-origin` variables), `menu.tsx` (one menu for the dropdown and the context
  menu), `modal.tsx` (one `<dialog>` for the dialog and the alert dialog).
- A class string with a literal pixel value uses the equal token class: `rounded-[min(var(--radius-md),8px)]` is
  `rounded-md`, `rounded-[2px]` is `rounded-xs`, `p-[3px]` is `p-[calc(var(--spacing)*0.75)]`.
