// The theme on <html>, as Omuk UI's tokens read it: `data-theme="dark"` or
// `data-theme="light"`. theme.ts (useTheme) sets it and keeps the choice in
// localStorage under `theme`: "light" or "dark"; nothing kept means the
// system's setting. This file holds no browser code: vite.config.ts puts
// THEME_SCRIPT inline in index.html, so it runs before the first paint.

export const THEME_ATTRIBUTE = 'data-theme';
export const THEME_STORAGE_KEY = 'theme';
export const DARK_QUERY = '(prefers-color-scheme: dark)';

// The settings drawer's other picks, the same way: each one is an attribute
// on <html> (`data-accent="violet"`), kept in localStorage under its name,
// and tokens.css turns it into Omuk UI's tokens. At its first value nothing
// is kept and no attribute is set: the kit's own token.
export const SETTINGS = {
  accent: {
    attribute: 'data-accent',
    values: ['blue', 'violet', 'green', 'amber', 'pink'],
  },
  // "google": the family kept under GOOGLE_FONT_KEY (google-font.ts).
  font: {
    attribute: 'data-font',
    values: ['plex', 'atkinson', 'system', 'google'],
  },
  edge: { attribute: 'data-edge', values: ['regular', 'thin'] },
  density: {
    attribute: 'data-density',
    values: ['regular', 'compact', 'comfortable'],
  },
} as const;

export type SettingName = keyof typeof SETTINGS;
export type SettingValue<Name extends SettingName> =
  (typeof SETTINGS)[Name]['values'][number];

// A Google font (google-font.ts): kept as JSON [family, category, weights]
// under GOOGLE_FONT_KEY, loaded with a <link id=GOOGLE_FONT_LINK>, named in
// the --font-google property on <html>, which tokens.css reads.
export const GOOGLE_FONT_KEY = 'google-font';
export const GOOGLE_FONT_LINK = 'google-font';
export const GOOGLE_FONT_VARIABLE = '--font-google';
const GOOGLE_CSS = 'https://fonts.googleapis.com/css2';

/** One `family=` part of Google's css2 address: "Open+Sans:wght@400;500". */
function familyPart(family: string, weights: string) {
  return `family=${encodeURIComponent(family).replace(/%20/g, '+')}:wght@${weights}`;
}

/**
 * Google's stylesheet for these families, each at its weights. With
 * `text`, only those letters: a preview of the name.
 */
export function googleFontHref(
  fonts: readonly (readonly [family: string, weights: string])[],
  text?: string,
) {
  const families = fonts.map(([family, weights]) =>
    familyPart(family, weights),
  );
  const only = text ? `&text=${encodeURIComponent(text)}` : '';
  return `${GOOGLE_CSS}?${families.join('&')}&display=swap${only}`;
}

/** [storage key, attribute, values] for each setting, for the script. */
const PICKS = JSON.stringify(
  Object.entries(SETTINGS).map(([name, setting]) => [
    name,
    setting.attribute,
    setting.values,
  ]),
);

export const THEME_SCRIPT = `try{var t=localStorage.getItem('${THEME_STORAGE_KEY}'),d=t==='light'||t==='dark'?t:matchMedia('${DARK_QUERY}').matches?'dark':'light',e=document.documentElement;e.setAttribute('${THEME_ATTRIBUTE}',d);e.style.colorScheme=d;${PICKS}.forEach(function(s){var v=localStorage.getItem(s[0]);if(s[2].indexOf(v)>0)e.setAttribute(s[1],v)});if(localStorage.getItem('font')==='google'){var g=JSON.parse(localStorage.getItem('${GOOGLE_FONT_KEY}')),l=document.createElement('link');l.id='${GOOGLE_FONT_LINK}';l.rel='stylesheet';l.href='${GOOGLE_CSS}?family='+encodeURIComponent(g[0]).replace(/%20/g,'+')+':wght@'+g[2]+'&display=swap';document.head.appendChild(l);e.style.setProperty('${GOOGLE_FONT_VARIABLE}','"'+g[0]+'"')}}catch(e){}`;
