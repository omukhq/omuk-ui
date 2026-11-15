// The values a design-system file must not write in place: every colour,
// font, size, radius and spacing value comes from a token (the root
// DESIGN.md, src/design/theme.css). A line marked `design-ok` is a
// documented exception (as in check:design), like a team's colour, which is
// data (decisions, R3). The kit's own test and beta's use it.

const LITERALS: [string, RegExp][] = [
  ['hex colour', /#[0-9a-fA-F]{3,8}\b/],
  ['colour function', /\b(rgba?|hsla?|oklch|oklab|lab|lch)\(/],
  ['pixel value', /\b\d+(\.\d+)?px\b/],
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
