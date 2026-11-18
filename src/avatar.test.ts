// The avatar colours (decisions, R3 owner decision; palette shades since
// v3.12): a person keeps the same colour on every render, and white text
// stays readable on every colour.
// Both fail silently: a colour that changes between pages, or a letter that
// drops below 4.5:1 when someone edits a token.
import { describe, expect, test } from 'bun:test';
import { avatarColorClass } from './avatar';

const theme = await Bun.file(
  new URL('./design/theme.css', import.meta.url),
).text();

/** A `--color-<name>: #rrggbb` palette value from theme.css. */
function token(name: string) {
  const match = theme.match(
    new RegExp(`--color-${name}:\\s*#([0-9a-fA-F]{6})\\b`),
  );
  if (!match?.[1]) throw new Error(`no hex token --color-${name}`);
  return match[1];
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
