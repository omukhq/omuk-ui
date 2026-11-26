// Every exported component that runs only in the browser (hooks, context,
// event handlers) starts with 'use client', so a Next.js server component
// can import it: Next.js renders a page on the server by default, and React's
// hooks are not there. A file without them (Card, Label) stays a server
// component. Vite ignores the line.
import { describe, expect, test } from 'bun:test';
import pkg from '../package.json';

const CLIENT_ONLY =
  /\buse[A-Z]\w*\(|createContext|\bon[A-Z]\w*=\{|from '\.\/(render|popup|menu|modal|field-context|form-value|tooltip)'/;

const files = Object.values(pkg.exports as Record<string, string>)
  .filter((path) => path.startsWith('./src/') && path.endsWith('.tsx'))
  .map((path) => path.slice('./src/'.length));

describe("exported components that run in the browser start with 'use client'", () => {
  test('there are files to check', () => {
    expect(files.length).toBeGreaterThan(0);
  });
  for (const file of files) {
    test(file, async () => {
      const text = await Bun.file(new URL(file, import.meta.url)).text();
      if (!CLIENT_ONLY.test(text)) return;
      expect(text.startsWith("'use client';")).toBe(true);
    });
  }
});
