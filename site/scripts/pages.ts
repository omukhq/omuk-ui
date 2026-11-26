// After `vite build` and the server build (dist-ssr): one HTML file for
// each page, and the sitemap.
//
// The site is one app, but a link preview, a search engine or a visitor
// with JavaScript off reads the HTML first. So dist/docs/<slug>/index.html
// is the built index.html with that page's title, description and address.
// Vercel serves a file before it applies a rewrite, so /docs/button gets its
// own file, and the app takes over from there.
//
// Each file also holds the page itself, rendered (entry-server.tsx): the
// browser draws it with the HTML and the CSS, before the script has loaded
// (a slow phone: about a second sooner), and the script takes it over.

import { join } from 'node:path';
import { DOCS, FIRST_DOC } from '../src/docs/registry';
import { HOME_DESCRIPTION, HOME_TITLE } from '../src/page-meta';

const SITE = 'https://ui.omuk.dev';
const dist = join(import.meta.dirname, '../dist');
const home = await Bun.file(join(dist, 'index.html')).text();
const { render } = (await import(
  join(import.meta.dirname, '../dist-ssr/entry-server.js')
)) as { render: (path: string) => Promise<string> };

const ROOT = '<div id="root"></div>';
if (!home.includes(ROOT)) throw new Error(`pages: index.html has no ${ROOT}`);

/**
 * The page's HTML, with the app rendered for `path` in its root. The root
 * says which path (data-path): the app takes the HTML over only on that
 * page, not where a server falls back to another page's file.
 */
async function withApp(html: string, path: string) {
  const app = await render(path);
  return html.replace(
    ROOT,
    `<div id="root" data-path="${escapeHtml(path)}">${app}</div>`,
  );
}

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
  await Bun.write(
    join(dist, 'docs', entry.slug, 'index.html'),
    await withApp(html, `/docs/${entry.slug}`),
  );
}

// /docs alone is the first page.
await Bun.write(
  join(dist, 'docs', 'index.html'),
  await withApp(
    pageHtml(
      `${FIRST_DOC.name}: Omuk UI`,
      FIRST_DOC.description,
      `${SITE}/docs/${FIRST_DOC.slug}`,
    ),
    '/docs',
  ),
);

// The home page last: the others were made from its HTML before.
await Bun.write(join(dist, 'index.html'), await withApp(home, '/'));

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
