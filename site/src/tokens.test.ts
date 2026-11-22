// Every value on the site comes from Omuk UI's tokens (src/design/theme.css
// in the kit). This fails on a literal value in a file of site/src: the
// kit's own check (hex, colour functions, px, font-family), plus rem and
// arbitrary Tailwind values (`p-[13px]`; only `[var(--…)]` is allowed).
import { describe, expect, test } from 'bun:test';
import { literalsIn } from '@omuk/ui/token-check';
import { Glob } from 'bun';

const SITE_LITERALS: [string, RegExp][] = [
  ['rem value', /\b\d+(\.\d+)?rem\b/],
  ['arbitrary Tailwind value', /[a-z0-9]-\[(?!var\()[^\]\s]+\]/],
];

function siteLiteralsIn(source: string) {
  const text = source
    .split('\n')
    .filter((line) => !line.includes('design-ok'))
    .join('\n');
  return [
    ...literalsIn(source),
    ...SITE_LITERALS.filter(([, pattern]) => pattern.test(text)).map(
      ([name]) => name,
    ),
  ];
}

const root = new URL('.', import.meta.url).pathname;
const files = [...new Glob('**/*.{ts,tsx,css}').scanSync(root)].filter(
  (file) => !file.endsWith('.test.ts'),
);

describe('the check finds literal values', () => {
  test.each([
    ['p-[13px]'],
    ['bg-[#eee]'],
    ['gap-[3rem]'],
    ['w-[42%]'],
    ['color: rgb(0 0 0)'],
  ])('%s', (sample) => {
    expect(siteLiteralsIn(sample)).not.toEqual([]);
  });

  test('a token in an arbitrary value is fine', () => {
    expect(siteLiteralsIn('h-[var(--available-height)]')).toEqual([]);
  });
});

describe('the site uses tokens, not literal values', () => {
  test('there are files to check', () => {
    expect(files.length).toBeGreaterThan(0);
  });
  for (const file of files) {
    test(file, async () => {
      expect(siteLiteralsIn(await Bun.file(`${root}${file}`).text())).toEqual(
        [],
      );
    });
  }
});
