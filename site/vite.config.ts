import { join } from 'node:path';
import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import { defineConfig, type Plugin, type Rolldown } from 'vite';
import { THEME_SCRIPT } from './src/theme-script.ts';

type OutputBundle = Rolldown.OutputBundle;

// ui.omuk.dev: the home page of Omuk UI. It shows the kit from this repo's
// own src/, not from a release, so the page always shows what the next tag
// will hold. `omuk-ui/button` is ../src/button.tsx, as the package's
// "exports" map says.

const KIT = join(import.meta.dirname, '../src');

/**
 * The packages the kit's files import. They live in site/node_modules (the
 * kit's own node_modules may not be installed, as on Vercel): `dedupe`
 * resolves them from here, for the kit's files too. One React for all.
 */
const SHARED = [
  'react',
  'react-dom',
  'react/jsx-runtime',
  'react/jsx-dev-runtime',
  'react-dom/client',
  'lucide-react',
  'class-variance-authority',
  'clsx',
  'tailwind-merge',
  'input-otp',
];

/** Puts the theme script inline at the top of <head>: no flash of the wrong theme. */
function themeBeforePaint(): Plugin {
  return {
    name: 'theme-before-paint',
    transformIndexHtml: () => [
      { tag: 'script', children: THEME_SCRIPT, injectTo: 'head-prepend' },
    ],
  };
}

/**
 * The main face: IBM Plex Sans 400, most of the text. The browser finds it
 * only after the CSS; a preload starts it with the HTML. The other faces
 * (500, 600, Mono) come from the CSS: preloaded too, their 60 KB took the
 * slow line from the main script, which draws the page (a 4G phone: first
 * paint after the script, not after the fonts, which swap in).
 */
const FIRST_SCREEN_FONTS = ['ibm-plex-sans-latin-400-normal'];

/** A preload for each first-screen face in the built index.html. */
function preloadFonts(): Plugin {
  return {
    name: 'preload-fonts',
    apply: 'build',
    transformIndexHtml: {
      order: 'post',
      handler(_html, { bundle }) {
        const files = Object.keys(bundle ?? {});
        return FIRST_SCREEN_FONTS.map((face) => {
          const file = files.find(
            (name) =>
              name.startsWith(`assets/${face}-`) && name.endsWith('.woff2'),
          );
          // A renamed face in @fontsource fails the build, not the preload.
          if (!file) throw new Error(`preload-fonts: no ${face}.woff2`);
          return {
            tag: 'link',
            attrs: {
              rel: 'preload',
              as: 'font',
              type: 'font/woff2',
              href: `/${file}`,
              // A font is fetched in CORS mode: without this, it downloads twice.
              crossorigin: '',
            },
            injectTo: 'head',
          };
        });
      },
    },
  };
}

/** A built chunk's own file and every chunk it imports, not those in `skip`. */
function chunkFiles(
  bundle: OutputBundle,
  file: string,
  skip: Set<string>,
  out = new Set<string>(),
) {
  if (skip.has(file) || out.has(file)) return out;
  const chunk = bundle[file];
  if (chunk?.type !== 'chunk') return out;
  out.add(file);
  for (const imported of chunk.imports) chunkFiles(bundle, imported, skip, out);
  return out;
}

/**
 * The docs' code, fetched with the HTML. The docs layout and each page are
 * chunks the main script loads (lazy, so the home page never loads them);
 * found only after that script runs, they came one after another, each a
 * round trip on a slow line. A script in <head> adds a modulepreload for
 * the layout and for the page in the address (/docs/<slug>), so they load
 * beside the main script. The map holds each page's own chunks only.
 */
function preloadDocs(): Plugin {
  return {
    name: 'preload-docs',
    apply: 'build',
    transformIndexHtml: {
      order: 'post',
      handler(_html, { bundle }) {
        if (!bundle) return [];
        const chunks = Object.values(bundle).filter(
          (output) => output.type === 'chunk',
        );
        const entry = chunks.find((chunk) => chunk.isEntry);
        if (!entry) throw new Error('preload-docs: no entry chunk');
        // The main script and what it imports load already.
        const skip = chunkFiles(bundle, entry.fileName, new Set());
        const facade = (pattern: RegExp) =>
          chunks.filter((chunk) => pattern.test(chunk.facadeModuleId ?? ''));
        const layout = facade(/\/src\/docs\/layout\.tsx$/)[0];
        if (!layout) throw new Error('preload-docs: no docs layout chunk');
        const layoutFiles = chunkFiles(bundle, layout.fileName, skip);
        const pages: Record<string, string[]> = {};
        for (const page of facade(/\/src\/docs\/pages\/[^/]+\.tsx$/)) {
          const slug = (page.facadeModuleId ?? '')
            .replace(/^.*\/pages\//, '')
            .replace(/\.tsx$/, '');
          const own = chunkFiles(
            bundle,
            page.fileName,
            new Set([...skip, ...layoutFiles]),
          );
          pages[slug] = [...own].map((file) => file.replace(/^assets\//, ''));
        }
        const map = {
          layout: [...layoutFiles].map((file) => file.replace(/^assets\//, '')),
          pages,
        };
        const script = `(function(){var p=location.pathname;if(!/^\\/docs(\\/|$)/.test(p))return;var m=${JSON.stringify(map)},s=p.replace(/^\\/docs\\/?/,'').replace(/\\/$/,'');m.layout.concat(m.pages[s]||[]).forEach(function(f){var l=document.createElement('link');l.rel='modulepreload';l.crossOrigin='';l.href='/assets/'+f;document.head.appendChild(l)})})()`;
        // At the top of <head>: an inline script after a stylesheet waits
        // for that stylesheet, and the preloads with it.
        return [{ tag: 'script', children: script, injectTo: 'head-prepend' }];
      },
    },
  };
}

/**
 * `<meta charset>` first in <head>: the browser looks for it in the first
 * 1024 bytes, and the scripts put at the top of <head> (theme, docs) pushed
 * it past them.
 */
function charsetFirst(): Plugin {
  const CHARSET = '<meta charset="utf-8" />';
  return {
    name: 'charset-first',
    transformIndexHtml: {
      order: 'post',
      handler(html) {
        return html
          .replace(CHARSET, '')
          .replace('<head>', `<head>\n    ${CHARSET}`);
      },
    },
  };
}

export default defineConfig({
  server: { port: 4100, fs: { allow: [join(import.meta.dirname, '..')] } },
  preview: { port: 4100 },
  plugins: [
    themeBeforePaint(),
    preloadFonts(),
    preloadDocs(),
    react(),
    tailwindcss(),
    charsetFirst(),
  ],
  resolve: {
    alias: [{ find: /^omuk-ui\/(.*)$/, replacement: `${KIT}/$1` }],
    dedupe: SHARED,
  },
});
