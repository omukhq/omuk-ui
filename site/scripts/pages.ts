// After `vite build`: one HTML file for each docs page, and the sitemap.
//
// The site is one app, but a link preview, a search engine or a visitor
// with JavaScript off reads the HTML first. So dist/docs/<slug>/index.html
// is the built index.html with that page's title, description and address.
// Vercel serves a file before it applies a rewrite, so /docs/button gets its
// own file, and the app takes over from there.

import { join } from 'node:path';
import { DOCS, FIRST_DOC } from '../src/docs/registry';
import { HOME_DESCRIPTION, HOME_TITLE } from '../src/page-meta';

const SITE = 'https://ui.omuk.dev';
const dist = join(import.meta.dirname, '../dist');
const home = await Bun.file(join(dist, 'index.html')).text();

/** Text for an HTML attribute or element. */
function escapeHtml(text: string) {
  return text
    .replaceAll('&', '&amp;')
    .replaceAll('"', '&quot;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;');
}

/** The home page's HTML with another page's title, description and address. */
function pageHtml(title: string, description: string, url: string) {
  const replacements: [string, string][] = [
    [escapeHtml(HOME_TITLE), escapeHtml(title)],
    [escapeHtml(HOME_DESCRIPTION), escapeHtml(description)],
    [`${SITE}/"`, `${url}"`],
  ];
  let html = home;
  for (const [from, to] of replacements) {
    if (!html.includes(from)) {
      throw new Error(`pages: index.html has no "${from.slice(0, 40)}…"`);
    }
    html = html.replaceAll(from, to);
  }
  return html;
}

for (const entry of DOCS) {
  const url = `${SITE}/docs/${entry.slug}`;
  const html = pageHtml(`${entry.name}: Omuk UI`, entry.description, url);
  await Bun.write(join(dist, 'docs', entry.slug, 'index.html'), html);
}

// /docs alone is the first page.
await Bun.write(
  join(dist, 'docs', 'index.html'),
  pageHtml(
    `${FIRST_DOC.name}: Omuk UI`,
    FIRST_DOC.description,
    `${SITE}/docs/${FIRST_DOC.slug}`,
  ),
);

const today = new Date().toISOString().slice(0, 10);
const urls = [`${SITE}/`, ...DOCS.map((entry) => `${SITE}/docs/${entry.slug}`)];
await Bun.write(
  join(dist, 'sitemap.xml'),
  `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map((url) => `  <url><loc>${url}</loc><lastmod>${today}</lastmod></url>`).join('\n')}
</urlset>
`,
);

console.log(`pages: ${DOCS.length + 1} docs pages and the sitemap`);
