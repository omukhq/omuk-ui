# Changelog

The format follows [Keep a Changelog](https://keepachangelog.com/en/1.1.0/). The versions follow [Semantic Versioning](https://semver.org/spec/v2.0.0.html). Until `1.0.0`, any alpha can break the API.

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
