# Omuk UI (`@omuk/ui`)

Omuk UI is the design system's React components, tokens and fonts. Markpad and the dashboard boilerplate use it.

The rules for the look are in `docs/DESIGN.md`. The rules for each component are in `docs/design-guide.md`. Both came from Markpad, so some paths in them point to Markpad's files.

## Install

The repository is private. Install it from GitHub with an exact tag:

```json
"@omuk/ui": "git+ssh://git@github.com/omukhq/omuk-ui.git#v1.0.0-alpha.1"
```

- A developer needs an SSH key and membership of the `omukhq` GitHub organization.
- Never install `@omuk/ui` by name from npm. The `@omuk` npm scope is not ours.

## Use

Import each component from its own path:

```tsx
import { Button } from '@omuk/ui/button';
import { toast } from '@omuk/ui/sonner';
```

The package has no index file. Each component is a separate export (see `package.json`).

### Prompts: alerts, modals and drawers from code

`@omuk/ui/prompt` opens a prompt from any handler and gives its answer as a promise. Put one `<PromptProvider />` in the app, inside the providers that the prompts' content needs.

```tsx
import { PromptProvider, usePrompt } from '@omuk/ui/prompt';

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

The package ships TypeScript source with no build step. The app's bundler (Vite, Astro) compiles it.

### Dates: `DatePicker` and `Calendar`

One component for a day, a day and a time, a range or a time. The value is ISO text, and its type follows `mode`:

```tsx
import { DatePicker } from '@omuk/ui/date-picker';

<DatePicker value={day} onChange={setDay} />                                 // "2026-11-18"
<DatePicker granularity="minute" value={at} onChange={setAt} />              // "2026-11-18T14:30"
<DatePicker mode="range" value={range} onChange={setRange} presets={…} />    // { start, end }
<DatePicker mode="time" value={time} onChange={setTime} />                   // "14:30"
```

- The parts are typed (the language's order, from `Intl`); the arrows step them. The calendar button in the field opens a `Calendar`.
- Options: `minValue`, `maxValue`, `isDateUnavailable`, `visibleMonths`, `firstDayOfWeek`, `timeZone` (for "today"), `locale`, `hourCycle`, `validate`, `name` (`startName`, `endName` for a range), `size`.
- For a filter: `placeholder` (shown until the field is used), `prefix` ("Updated:") and `showClear`.
- `@omuk/ui/calendar` is the calendar alone, for one day or a range.
- Gregorian only; no time zone in the value; no seconds.

## Tokens and fonts

The app must load the tokens and the fonts in its main stylesheet, and its Tailwind build must scan the package's files. The paths are relative to the stylesheet:

```css
@import "tailwindcss";
@import "../node_modules/@omuk/ui/src/design/theme.css";
@import "../node_modules/@omuk/ui/src/design/fonts.css";
@source "../node_modules/@omuk/ui/src";
```

## Rules

- A file in the package must not import from an app or from a Markpad package (`biome.json` enforces it). The package has its own helpers (`utils.ts` for `cn`, `touch.ts`, `toast-recipe.ts`).
- Every colour, size, radius and spacing value must come from a token. The test `src/tokens.test.ts` fails on a literal value. A line marked `design-ok` is a documented exception.
- Imports inside the package are relative (`./button`).
- A new component needs its line in the `exports` of `package.json`.

## Versions

Each release is a Git tag. The version in `package.json` must be the same as the tag.

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

## Commands

| Command | What it does |
|---|---|
| `bun run check` | Runs the lint, the type check and the tests. |
| `bun test` | Runs the tests, including the token check. |
| `bun run typecheck` | Checks the types. |
| `bun run lint` | Runs Biome. |
