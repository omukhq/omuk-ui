import { version } from '../../package.json';

// The facts the page repeats: one place for each.

export const VERSION = version;
export const TAG = `v${version}`;
export const REPO_URL = 'https://github.com/omukhq/omuk-ui';
export const LICENSE_URL = `${REPO_URL}/blob/main/LICENSE`;
export const CHANGELOG_URL = `${REPO_URL}/blob/main/CHANGELOG.md`;
export const DESIGN_URL = `${REPO_URL}/blob/main/docs/DESIGN.md`;
export const INSTALL_LINE = `bun add github:omukhq/omuk-ui#${TAG}`;

/** The page's sections, in order: the header links to each. */
export const SECTIONS = [
  { id: 'why', label: 'Why' },
  { id: 'components', label: 'Components' },
  { id: 'tokens', label: 'Tokens' },
  { id: 'install', label: 'Install' },
] as const;
