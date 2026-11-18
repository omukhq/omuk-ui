# Changelog

The format follows [Keep a Changelog](https://keepachangelog.com/en/1.1.0/). The versions follow [Semantic Versioning](https://semver.org/spec/v2.0.0.html). Until `1.0.0`, any alpha can break the API.

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
