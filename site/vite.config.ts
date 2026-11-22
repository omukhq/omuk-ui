import { join } from 'node:path';
import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import { defineConfig, type Plugin } from 'vite';
import { THEME_SCRIPT } from './src/theme-script.ts';

// ui.omuk.dev: the home page of Omuk UI. It shows the kit from this repo's
// own src/, not from a release, so the page always shows what the next tag
// will hold. `@omuk/ui/button` is ../src/button.tsx, as the package's
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
 * The faces the first screen sets text in: IBM Plex Sans 400 (text), 500
 * (buttons) and 600 (the title), and Mono 400 (the install line). The
 * browser finds them only after the CSS; a preload starts them with the HTML.
 */
const FIRST_SCREEN_FONTS = [
  'ibm-plex-sans-latin-400-normal',
  'ibm-plex-sans-latin-500-normal',
  'ibm-plex-sans-latin-600-normal',
  'ibm-plex-mono-latin-400-normal',
];

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

export default defineConfig({
  server: { port: 4100, fs: { allow: [join(import.meta.dirname, '..')] } },
  preview: { port: 4100 },
  plugins: [themeBeforePaint(), preloadFonts(), react(), tailwindcss()],
  resolve: {
    alias: [{ find: /^@omuk\/ui\/(.*)$/, replacement: `${KIT}/$1` }],
    dedupe: SHARED,
  },
});
