// The avatar colours (decisions, R3 owner decision; palette shades since
// v3.12): a person keeps the same colour on every render, and white text
// stays readable on every colour.
// Both fail silently: a colour that changes between pages, or a letter that
// drops below 4.5:1 when someone edits a token.
import { describe, expect, test } from 'bun:test';
import { avatarColorClass } from './avatar';

// The palette is Tailwind's (theme.css): its values come from Tailwind's own
// theme file, in OKLCH.
const tailwindTheme = await Bun.file(
  Bun.resolveSync('tailwindcss/theme.css', import.meta.dir),
).text();

/** OKLCH (Tailwind's notation) → `rrggbb`, the CSS Color 4 formulas. */
function oklchToHex(lightness: number, chroma: number, hue: number) {
  const angle = (hue * Math.PI) / 180;
  const a = chroma * Math.cos(angle);
  const b = chroma * Math.sin(angle);
  const l = (lightness + 0.3963377774 * a + 0.2158037573 * b) ** 3;
  const m = (lightness - 0.1055613458 * a - 0.0638541728 * b) ** 3;
  const s = (lightness - 0.0894841775 * a - 1.291485548 * b) ** 3;
  const linear = [
    4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s,
    -1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s,
    -0.0041960863 * l - 0.7034186147 * m + 1.707614701 * s,
  ];
  return linear
    .map((c) => {
      const srgb = c <= 0.0031308 ? 12.92 * c : 1.055 * c ** (1 / 2.4) - 0.055;
      const byte = Math.round(Math.min(1, Math.max(0, srgb)) * 255);
      return byte.toString(16).padStart(2, '0');
    })
    .join('');
}

/** A `--color-<name>` palette value from Tailwind's theme, as `rrggbb`. */
function token(name: string) {
  const match = tailwindTheme.match(
    new RegExp(
      `--color-${name}:\\s*oklch\\(([\\d.]+)%\\s+([\\d.]+)\\s+([\\d.]+)\\)`,
    ),
  );
  if (!match?.[1] || !match[2] || !match[3]) {
    throw new Error(`no OKLCH token --color-${name} in tailwindcss/theme.css`);
  }
  return oklchToHex(Number(match[1]) / 100, Number(match[2]), Number(match[3]));
}

/** WCAG relative luminance of `rrggbb`. */
function luminance(hex: string) {
  const [r = 0, g = 0, b = 0] = [0, 2, 4].map((at) => {
    const c = Number.parseInt(hex.slice(at, at + 2), 16) / 255;
    return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

function contrast(a: string, b: string) {
  const [hi, lo] = [luminance(a), luminance(b)].sort((x, y) => y - x);
  return (hi + 0.05) / ((lo ?? 0) + 0.05);
}

/** The palette shades the avatar picks from (`bg-teal-700 text-white` → `teal-700`). */
const AVATAR_COLOR_NAMES = [
  ...new Set(
    Array.from(
      { length: 200 },
      (_, at) => /bg-([a-z]+-\d+)/.exec(avatarColorClass(`user-${at}`))?.[1],
    ),
  ),
].filter((name): name is string => name !== undefined);

describe('avatar colours', () => {
  test('the same user ID gives the same colour', () => {
    expect(avatarColorClass('ckuser123')).toBe(avatarColorClass('ckuser123'));
  });

  test('user IDs spread over the whole palette', () => {
    const seen = new Set(
      Array.from({ length: 200 }, (_, at) => avatarColorClass(`user-${at}`)),
    );
    expect(seen.size).toBe(4);
  });

  // White is Tailwind's own (#fff): theme.css does not define it.
  const WHITE = 'ffffff';
  for (const name of AVATAR_COLOR_NAMES) {
    test(`white text on ${name} is at least 4.5:1`, () => {
      expect(contrast(token(name), WHITE)).toBeGreaterThanOrEqual(4.5);
    });
  }
});
