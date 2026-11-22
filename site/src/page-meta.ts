import { DOCS, FIRST_DOC } from './docs/registry';

// Each page's title and description, in one place: the browser tab reads
// the title, and the build writes both into each page's own HTML file
// (scripts/pages.ts), so a link preview or a search result shows the page.

export const HOME_TITLE =
  'Omuk UI: React 19 components and design tokens for Tailwind CSS 4';

export const HOME_DESCRIPTION =
  'Omuk UI is a personal React 19 component kit for Tailwind CSS 4, built for speed: nothing moves while it loads, every size is a token, and each component is its own import. MIT.';

/** The page's title for a path. */
export function titleFor(path: string) {
  const slug = path.replace(/^\/docs\/?/, '').replace(/\/$/, '');
  if (!path.startsWith('/docs')) return HOME_TITLE;
  const entry = DOCS.find((each) => each.slug === (slug || FIRST_DOC.slug));
  return entry ? `${entry.name}: Omuk UI` : 'Not found: Omuk UI';
}
