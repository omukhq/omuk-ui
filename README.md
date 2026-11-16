# Omuk UI (`@omuk/ui`)

Omuk UI is the design system's React components. Markpad's beta app and site use them.

The rules for the look are in the root `DESIGN.md`. The rules for each component are in `apps/app/docs/design-guide.md`.

## Use

Import each component from its own path:

```tsx
import { Button } from '@omuk/ui/button';
import { toast } from '@omuk/ui/sonner';
```

The package has no index file. Each component is a separate export (see `package.json`).

## Tokens

The package does not include the tokens. The app that uses the package must load the root `src/design/theme.css` (the tokens) and `src/design/fonts.css` (the fonts). In Markpad, `src/styles/globals.css` imports both.

The app's Tailwind build must also scan the package's files, for example `@source "../../packages/omuk-ui/src";`.

## Rules

- A file in the package must not import from the app (`@/…` or `@beta/…`). The package has its own helpers (`utils.ts` for `cn`, `touch.ts`, `toast-recipe.ts`).
- Every colour, size, radius and spacing value must come from a token. The test `src/tokens.test.ts` fails on a literal value. A line marked `design-ok` is a documented exception.
- Imports inside the package are relative (`./button`).

## Commands

| Command | What it does |
|---|---|
| `bun test` | Runs the package's tests, including the token check. The root `bun test` runs them too. |

## Technical note

The root `package.json` lists `packages/*` as Bun workspaces. `bun install` at the root links the package at `node_modules/@omuk/ui`. beta and site are not workspace members: they resolve `@omuk/ui/*` through their aliases (`apps/app/aliases.ts`, `apps/site/aliases.ts`) and tsconfig paths. A `workspace:*` dependency in their own `package.json` does not resolve, because they are not members. A `file:` dependency installs a second copy of the package's dependencies, at other versions, in their `node_modules`. The root `bunfig.toml` keeps the hoisted install layout.
