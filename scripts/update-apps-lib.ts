// The parts of update-apps.ts that touch no file and run no command, so a
// test can check them: an Omuk UI version in a package.json, and the
// changelog between two versions.

/** The package names an app can install Omuk UI under. */
export const PACKAGE_NAMES = ['@omuk/ui', '@omukhq/ui'] as const;

const DEPENDENCY = new RegExp(
  `("(?:${PACKAGE_NAMES.join('|')})"\\s*:\\s*")([^"]*)(")`,
  'g',
);

/**
 * The version an install spec points at, or null for one it does not pin:
 * `github:omukhq/omuk-ui#v1.0.0-alpha.27`, `git+ssh://…/omuk-ui.git#v1.0.0-alpha.18`
 * or `1.0.0-alpha.27` from npm.
 */
export function versionOf(spec: string): string | null {
  const tag = spec.match(/#v(\d[\w.-]*)$/);
  if (tag?.[1]) return tag[1];
  const exact = spec.match(/^(\d+\.\d+\.\d+[\w.-]*)$/);
  return exact?.[1] ?? null;
}

/** The same spec at `version`, in its own form; null when it pins none. */
export function bumpSpec(spec: string, version: string): string | null {
  if (/#v\d[\w.-]*$/.test(spec))
    return spec.replace(/#v[\w.-]+$/, `#v${version}`);
  if (/^\d+\.\d+\.\d+[\w.-]*$/.test(spec)) return version;
  return null;
}

/** The Omuk UI specs in a package.json's text. */
export function specsIn(text: string): string[] {
  return [...text.matchAll(DEPENDENCY)].map((match) => match[2] ?? '');
}

/**
 * The package.json text with every Omuk UI spec at `version`, its own
 * formatting kept. Unchanged when nothing needs a change.
 */
export function bumpPackageJson(text: string, version: string): string {
  return text.replace(
    DEPENDENCY,
    (whole, before: string, spec: string, after: string) => {
      const next = bumpSpec(spec, version);
      return next === null ? whole : `${before}${next}${after}`;
    },
  );
}

/** A version's parts, numbers as numbers: 1.0.0-alpha.9 → 1, 0, 0, alpha, 9. */
function versionParts(version: string) {
  return version
    .split(/[.-]/)
    .map((part) => (/^\d+$/.test(part) ? Number(part) : part));
}

/** Version a is older than b (prerelease numbers compared as numbers). */
export function isOlder(a: string, b: string): boolean {
  const left = versionParts(a);
  const right = versionParts(b);
  for (let at = 0; at < Math.max(left.length, right.length); at++) {
    const x = left[at];
    const y = right[at];
    if (x === y) continue;
    if (x === undefined) return false;
    if (y === undefined) return true;
    if (typeof x === 'number' && typeof y === 'number') return x < y;
    return String(x) < String(y);
  }
  return false;
}

/**
 * The changelog's sections after `from` up to and including `to`: what an
 * app on `from` must read before it moves to `to`. Empty when `to` has no
 * section.
 */
export function changelogBetween(changelog: string, from: string, to: string) {
  const sections = changelog.split(/^(?=## \[)/m);
  const picked = sections.filter((section) => {
    const version = section.match(/^## \[([^\]]+)\]/)?.[1];
    if (!version || version === 'Unreleased') return false;
    return isOlder(from, version) && !isOlder(to, version);
  });
  return picked.join('').trim();
}
