import { prerender } from 'react-dom/static';
import { App } from './app';
import { setRenderedPath } from './router';

// The build's renderer (scripts/pages.ts): the HTML of one page, for its
// file in dist/. The browser shows it before the script has loaded, and the
// script takes it over (hydrateRoot, main.tsx). `prerender` waits for the
// lazy parts (the docs layout and the page), so their HTML is in it too.

export async function render(path: string) {
  setRenderedPath(path);
  const { prelude } = await prerender(<App />);
  return await new Response(prelude).text();
}
