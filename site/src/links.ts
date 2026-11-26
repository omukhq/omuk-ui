import { version } from '../../package.json';

// The facts the page repeats: one place for each.

export const VERSION = version;
export const TAG = `v${version}`;
export const REPO_URL = 'https://github.com/omukhq/omuk-ui';
export const LICENSE_URL = `${REPO_URL}/blob/main/LICENSE`;
export const CHANGELOG_URL = `${REPO_URL}/blob/main/CHANGELOG.md`;
export const DESIGN_URL = `${REPO_URL}/blob/main/docs/DESIGN.md`;
/** The npm package, installed under the name the imports use (`@omuk/ui`). */
export const NPM_PACKAGE = 'omuk-ui';
export const INSTALL_LINE = `bun add @omuk/ui@npm:${NPM_PACKAGE}@${version}`;

/** A component's source file on GitHub. */
export function sourceUrl(file: string) {
  return `${REPO_URL}/blob/main/src/${file}`;
}

/** The home page's parts, in order: the header links to each. */
export const SECTIONS = [
  { id: 'why', label: 'Why' },
  { id: 'in-use', label: 'In use' },
  { id: 'install', label: 'Install' },
] as const;
