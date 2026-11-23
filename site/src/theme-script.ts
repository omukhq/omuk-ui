// The theme on <html>, as Omuk UI's tokens read it: `data-theme="dark"` or
// `data-theme="light"`. theme.ts (useTheme) sets it and keeps the choice in
// localStorage under `theme`: "light" or "dark"; nothing kept means the
// system's setting. This file holds no browser code: vite.config.ts puts
// THEME_SCRIPT inline in index.html, so it runs before the first paint.

export const THEME_ATTRIBUTE = 'data-theme';
export const THEME_STORAGE_KEY = 'theme';
export const DARK_QUERY = '(prefers-color-scheme: dark)';

export const THEME_SCRIPT = `try{var t=localStorage.getItem('${THEME_STORAGE_KEY}'),d=t==='light'||t==='dark'?t:matchMedia('${DARK_QUERY}').matches?'dark':'light',e=document.documentElement;e.setAttribute('${THEME_ATTRIBUTE}',d);e.style.colorScheme=d}catch(e){}`;
