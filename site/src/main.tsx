import { StrictMode } from 'react';
import { createRoot, hydrateRoot } from 'react-dom/client';
import { App } from './app';
import { titleFor } from './page-meta';
import { onPathChange } from './router';
import { watchTheme } from './theme';
import './styles.css';

const root = document.getElementById('root');
if (!root) throw new Error('index.html has no #root.');

// The theme follows the system and other tabs from the first paint.
watchTheme();

// The tab's title follows the page: "Button: Omuk UI" on /docs/button.
onPathChange((path) => {
  document.title = titleFor(path);
});

// After a new deploy, a tab that was open asks for page files that are gone,
// and the page goes blank. Load the new version instead.
window.addEventListener('vite:preloadError', () => {
  window.location.reload();
});

const app = (
  <StrictMode>
    <App />
  </StrictMode>
);

/** A path without its last slash: /docs/button/ is /docs/button. */
function plain(path: string) {
  return path.length > 1 ? path.replace(/\/$/, '') : path;
}

// The build writes each page's HTML into its file (scripts/pages.ts), and
// marks the path it drew (data-path): take it over. A server that falls
// back to another page's file (an unknown address), and the dev server's
// empty page: draw the page from scratch.
if (plain(root.dataset.path ?? '') === plain(location.pathname)) {
  hydrateRoot(root, app);
} else {
  root.replaceChildren();
  createRoot(root).render(app);
}
