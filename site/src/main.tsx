import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { App } from './app';
import { titleFor } from './page-meta';
import { onPathChange } from './router';
import './styles.css';

const root = document.getElementById('root');
if (!root) throw new Error('index.html has no #root.');

// The tab's title follows the page: "Button: Omuk UI" on /docs/button.
onPathChange((path) => {
  document.title = titleFor(path);
});

createRoot(root).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
