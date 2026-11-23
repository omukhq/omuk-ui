<div align="center">

# Omuk UI

**React 19 components and design tokens for Tailwind CSS 4.**

Forms, dialogs, menus, tables, date pickers and toasts, in light and dark mode. Each component is its own import, so
your app loads only what it uses.

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![React](https://img.shields.io/badge/React-19-149ECA?logo=react&logoColor=white)](https://react.dev)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4-06B6D4?logo=tailwindcss&logoColor=white)](https://tailwindcss.com)
[![TypeScript](https://img.shields.io/badge/TypeScript-source-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org)

[Website](https://ui.omuk.dev) · [Why we built it](#why-we-built-it) · [Install](#install) · [Components](#components) ·
[Tokens and fonts](#tokens-and-fonts) · [Changelog](CHANGELOG.md)

</div>

---

## Why we built it

You press **Save**. The label turns into "Saving…", the button gets wider, and the row next to it shifts by a few
pixels. Nobody files a bug about it. But you feel it, every time.

We kept finding small moments like that in our own apps ([Markpad](https://markpad.md), a secrets manager, a few
dashboards). Each one was easy to fix once. The trouble was fixing it again in the next app, and the next. So we
stopped fixing apps and built one place where the fix lives. That place is Omuk UI.

It follows five promises. Every component keeps them, and a test checks most of them.

1. **Nothing jumps.** A loading button keeps its exact size: the spinner sits where the label was. A dialog stays
   open while its action runs, and shows the error there if it fails.
2. **No number by hand.** Every colour, size, radius and space is a named token. A test fails the moment a component
   writes `13px` or `#eee`. Dark mode, or a new brand colour, is one file.
3. **A page pays only for what it shows.** There is no index file. `@omukhq/ui/button` is the button and nothing else,
   so a sign-in page never downloads a date picker.
4. **Ours all the way down.** No headless library underneath and no second layer of class names. We started on
   wrappers around one, and every fix waited on code we did not own. Now, when something is wrong, it is our bug, and
   we can fix it the same day.
5. **Your build, not ours.** The package is TypeScript source. Your bundler (Vite, Astro, Next.js) compiles it with
   your app. There is no second build to keep in step, and you can read every line you ship.

It runs our apps in production. We made it public, under the MIT license, so that your buttons stop jumping too.


## Install

Install from npm with an exact version:

```bash
bun add @omukhq/ui@1.0.0-alpha.23
```

- Pin the exact version: until `1.0.0`, any alpha can break the API. See [Versions](#versions).
- The name is `@omukhq/ui`. The `@omuk` scope on npm is not ours: do not install `@omuk/ui`.
- Peer dependencies: `react` 19, `react-dom` 19 and `tailwindcss` 4.
- The package is TypeScript source. Vite and Astro compile it as is. In Next.js, add it to `transpilePackages`.
- A GitHub tag works too: `bun add github:omukhq/omuk-ui#v1.0.0-alpha.23`.

Then load the tokens and fonts in your stylesheet ([Tokens and fonts](#tokens-and-fonts)).

## Use

Import each component from its own path:

```tsx
import { Button } from '@omukhq/ui/button';
import { toast } from '@omukhq/ui/sonner';

<Button isLoading={saving} loadingLabel="Saving" onClick={save}>
  Save
</Button>;
```

There is no index file. Each component is a separate export (see `package.json`).

## Components

| Group | Components |
|---|---|
| Actions | Button, Button group, Segmented control, Chip |
| Forms | Field, Input, Input group, Textarea, Select, Combobox, Checkbox, Radio group, Switch, One-time code input, Label |
| Dates | Date picker (a day, a day and a time, a range, a time), Calendar |
| Overlays | Dialog, Alert dialog, Modal, Drawer, Popover, Tooltip, Dropdown menu, Context menu, Prompt |
| Feedback | Toast (Sonner), Spinner, Skeleton, Status |
| Data | Table, Pagination, List row, Sortable list, Badge, Avatar |
| Layout | Card, Tabs, Separator |

### Prompts: alerts, modals and drawers from code

`@omukhq/ui/prompt` opens a prompt from any handler and gives its answer as a promise. Put one `<PromptProvider />` in
the app, inside the providers that the prompts' content needs.

```tsx
import { PromptProvider, usePrompt } from '@omukhq/ui/prompt';

const prompt = usePrompt();

// An alert gives true (the action) or false (Cancel, Escape).
const ok = await prompt.open({
  type: 'alert',
  title: 'Delete the team?',
  description: 'It cannot be undone.',
  actionLabel: 'Delete',
  destructive: true,
});

// With onAction, the alert stays open while the work runs (the button keeps
// its size and shows a spinner). A throw keeps it open with the message.
await prompt.open({
  type: 'alert',
  title: 'Remove Ada?',
  actionLabel: 'Remove',
  loadingLabel: 'Removing',
  onAction: () => removeMember(id),
});

// A modal or a drawer gives what its content passes to close(), or null.
const name = await prompt.open<string>({
  type: 'modal',
  title: 'Rename the team',
  content: (close) => <RenameForm onDone={close} />,
});
```

`prompt.closeAll()` closes every open prompt. Outside a component, import `prompt` instead of the hook.

### Dates: `DatePicker` and `Calendar`

One component for a day, a day and a time, a range or a time. The value is ISO text, and its type follows `mode`:

```tsx
import { DatePicker } from '@omukhq/ui/date-picker';

<DatePicker value={day} onChange={setDay} />                                 // "2026-11-18"
<DatePicker granularity="minute" value={at} onChange={setAt} />              // "2026-11-18T14:30"
<DatePicker mode="range" value={range} onChange={setRange} presets={…} />    // { start, end }
<DatePicker mode="time" value={time} onChange={setTime} />                   // "14:30"
```

- The parts are typed (the language's order, from `Intl`); the arrows step them. The calendar button in the field
  opens a `Calendar`.
- Options: `minValue`, `maxValue`, `isDateUnavailable`, `visibleMonths`, `firstDayOfWeek`, `timeZone` (for "today"),
  `locale`, `hourCycle`, `validate`, `name` (`startName`, `endName` for a range), `size`.
- For a filter: `placeholder` (shown until the field is used), `prefix` ("Updated:") and `showClear`.
- `@omukhq/ui/calendar` is the calendar alone, for one day or a range.
- Gregorian only; no time zone in the value; no seconds.

## Tokens and fonts

Load the tokens and the fonts in your app's main stylesheet, and let Tailwind scan the package's files. The paths are
relative to the stylesheet:

```css
@import "tailwindcss";
@import "../node_modules/@omukhq/ui/src/design/theme.css";
@import "../node_modules/@omukhq/ui/src/design/fonts.css";
@source "../node_modules/@omukhq/ui/src";
```

- `theme.css` holds every token: colours for light and dark mode, sizes, radii, shadows.
- `fonts.css` loads IBM Plex Sans, Mono and Serif, and Atkinson Hyperlegible, from your own domain (Latin only). A
  browser downloads a face only when text on the page uses it.

The look and the rules for each component are in [`docs/DESIGN.md`](docs/DESIGN.md) and
[`docs/design-guide.md`](docs/design-guide.md).

## Rules for contributors

- A file in the package must not import from an app (`biome.json` enforces it). The package has its own helpers
  (`utils.ts` for `cn`, `touch.ts`, `toast-recipe.ts`).
- Every colour, size, radius and spacing value must come from a token. The test `src/tokens.test.ts` fails on a
  literal value. A line marked `design-ok` is a documented exception.
- Imports inside the package are relative (`./button`).
- A new component needs its line in the `exports` of `package.json`.

## Versions

Each release is a Git tag and the same version on npm. The version in `package.json` must be the same as the tag.

| Stage | Versions | What can change |
|---|---|---|
| Alpha (now) | `1.0.0-alpha.1`, `1.0.0-alpha.2`, … | Anything. |
| Beta | `1.0.0-beta.1`, … | Bug fixes. Small API changes only for real problems. |
| Release candidate | `1.0.0-rc.1`, … | Only fixes for serious bugs. |
| Stable | `1.0.0`, then normal semantic versions | Breaking changes need a new major version. |

- A tag must not move or be deleted after its release.
- The changelog must name each breaking change and tell how to update.

To release:

1. Run `bun run check`.
2. Set the new version in `package.json` and add its section to `CHANGELOG.md`.
3. Commit, then tag the commit `v<version>`.
4. Push the commit and the tag.
5. Run `bun publish`. It publishes with the `alpha` dist-tag (`publishConfig` in `package.json`), so `latest` stays
   free for `1.0.0`.

## Commands

| Command | What it does |
|---|---|
| `bun run check` | Runs the lint, the type check and the tests. |
| `bun test` | Runs the tests, including the token check. |
| `bun run typecheck` | Checks the types. |
| `bun run lint` | Runs Biome. |

## License

[MIT](LICENSE) © Omuk
