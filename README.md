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

The package ships TypeScript source with no build step. The app's bundler (Vite, Astro) compiles it.

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
