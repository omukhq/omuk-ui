// Rewrites Tailwind classes to the form Tailwind calls canonical (the
// editor's "can be written as …" hint, suggestCanonicalClasses), in every
// class string of the site.
//
//   bun scripts/canonical-classes.ts          rewrite
//   bun scripts/canonical-classes.ts --check  list, exit 1 if any
//
// Only a word in a string literal that Tailwind compiles to CSS is touched,
// and only when its canonical form differs. Copied from Markpad.
import { readFileSync, writeFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { __unstable__loadDesignSystem } from '@tailwindcss/node';
import { Glob } from 'bun';

const ROOT = resolve(import.meta.dir, '..');
const CHECK = process.argv.includes('--check');

const sheet = resolve(ROOT, 'src/styles.css');
const design = await __unstable__loadDesignSystem(readFileSync(sheet, 'utf8'), {
  base: dirname(sheet),
});

// Single, double and back quotes; a template's ${…} parts are left alone.
const STRING = /'(?:[^'\\\n]|\\.)*'|"(?:[^"\\\n]|\\.)*"|`(?:[^`\\]|\\.)*`/g;

const known = new Map<string, string | null>();
function canonical(word: string) {
  if (!known.has(word)) {
    const css = design.candidatesToCss([word])[0];
    const [next] = css ? design.canonicalizeCandidates([word]) : [word];
    known.set(word, next && next !== word ? next : null);
  }
  return known.get(word) ?? null;
}

let changes = 0;
for await (const file of new Glob('src/**/*.{ts,tsx}').scan({ cwd: ROOT })) {
  if (file.includes('.test.')) continue;
  const path = resolve(ROOT, file);
  const source = readFileSync(path, 'utf8');
  let edited = false;
  const next = source.replace(STRING, (literal) => {
    const quote = literal[0];
    const body = literal.slice(1, -1);
    const parts = body.split(/(\s+|\$\{[^}]*\})/);
    let touched = false;
    const out = parts.map((part) => {
      if (!part || /^\s+$/.test(part) || part.startsWith('${')) return part;
      const better = canonical(part);
      if (!better) return part;
      touched = true;
      changes++;
      process.stdout.write(`${file}: ${part} → ${better}\n`);
      return better;
    });
    if (!touched) return literal;
    edited = true;
    return quote + out.join('') + quote;
  });
  if (edited && !CHECK) writeFileSync(path, next);
}
process.stdout.write(`${changes} ${CHECK ? 'to rewrite' : 'rewritten'}\n`);
if (CHECK && changes > 0) process.exit(1);
