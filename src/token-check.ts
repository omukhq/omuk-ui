// The values a design-system file must not write in place: every colour,
// font, size, radius and spacing value comes from a token (the root
// DESIGN.md, packages/omuk-ui/src/design/theme.css). A line marked `design-ok` is a
// documented exception (as in check:design), like a team's colour, which is
// data (decisions, R3). The kit's own test and beta's use it.

const LITERALS: [string, RegExp][] = [
  ['hex colour', /#[0-9a-fA-F]{3,8}\b/],
  ['colour function', /\b(rgba?|hsla?|hwb|oklch|oklab|lab|lch|color)\(/],
  // A CSS colour keyword as a value: `color: red`, `background: white`.
  // `currentcolor`, `transparent` and the system colours (forced colours)
  // are not palette values, so they pass.
  [
    'named colour',
    /\b(color|background(-color)?|border(-\w+)*-color|fill|stroke|outline-color)\s*:\s*(white|black|red|green|blue|yellow|orange|purple|pink|gray|grey|silver|navy|teal|maroon|olive|lime|aqua|fuchsia)\b/i,
  ],
  ['pixel value', /\b\d+(\.\d+)?px\b/],
  ['rem value', /(?<![\w-])\d*\.?\d+rem\b/],
  ['font name', /font-family\s*:/],
];

/** The kinds of literal value in a file's text, outside `design-ok` lines. */
export function literalsIn(source: string) {
  const text = source
    .split('\n')
    .filter((line) => !line.includes('design-ok'))
    .join('\n');
  return LITERALS.filter(([, pattern]) => pattern.test(text)).map(
    ([name]) => name,
  );
}
