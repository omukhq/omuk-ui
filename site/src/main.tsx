import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
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

createRoot(root).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
