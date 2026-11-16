// Every value in the kit comes from a token: this fails on a literal value
// in one of its files (./token-check.ts). The token file itself
// (./design/theme.css) is where the values are, so it is left out.
import { describe, expect, test } from 'bun:test';
import { Glob } from 'bun';
import { literalsIn } from './token-check';

const root = new URL('.', import.meta.url).pathname;
const files = [...new Glob('**/*.{ts,tsx,css}').scanSync(root)].filter(
  (file) =>
    !file.endsWith('.test.ts') &&
    file !== 'token-check.ts' &&
    file !== 'design/theme.css',
);

describe('the kit uses tokens, not literal values', () => {
  for (const file of files) {
    test(file, async () => {
      expect(literalsIn(await Bun.file(`${root}${file}`).text())).toEqual([]);
    });
  }
});
