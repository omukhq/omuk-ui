import { describe, expect, test } from 'bun:test';
import { buildRegistry, importsOf, itemFor, packageOf } from './registry-lib';

const FILES: Record<string, string> = {
  'button.tsx': `import { cva } from 'class-variance-authority';
import { useState } from 'react';
import { cn } from './utils';
// import { nothing } from './commented-out';
const url = 'https://example.com/x'; // a URL is not a comment start`,
  'utils.ts': `import { clsx } from 'clsx';
export { cn };`,
  'date/field.tsx': `import { cn } from '../utils';`,
  'design/theme.css': `/* @import "tailwindcss"; in a comment */
@utility x {}`,
  'design/fonts.css': `@import "@fontsource/ibm-plex-sans/latin-400.css";`,
};

function read(path: string) {
  return FILES[path] ?? null;
}

const VERSIONS = {
  'class-variance-authority': '^0.7.1',
  clsx: '^2.1.1',
  '@fontsource/ibm-plex-sans': '^5.3.0',
};

describe('importsOf', () => {
  test('finds JS and CSS imports, not ones in comments', () => {
    expect(importsOf(FILES['button.tsx'] ?? '')).toEqual([
      'class-variance-authority',
      'react',
      './utils',
    ]);
    expect(importsOf(FILES['design/theme.css'] ?? '')).toEqual([]);
  });
});

test('packageOf keeps a scope', () => {
  expect(packageOf('@fontsource/ibm-plex-sans/latin-400.css')).toBe(
    '@fontsource/ibm-plex-sans',
  );
  expect(packageOf('lucide-react')).toBe('lucide-react');
});

describe('itemFor', () => {
  test('follows relative imports and lists npm packages, not React', () => {
    const item = itemFor('button', 'button.tsx', read, VERSIONS);
    expect(item.files.map((file) => file.path)).toEqual([
      'button.tsx',
      'utils.ts',
    ]);
    expect(item.dependencies).toEqual({
      'class-variance-authority': '^0.7.1',
      clsx: '^2.1.1',
    });
  });

  test('keeps a file in a folder at its path, and finds its parent', () => {
    const item = itemFor('field', 'date/field.tsx', read, VERSIONS);
    expect(item.files.map((file) => file.path)).toEqual([
      'date/field.tsx',
      'utils.ts',
    ]);
  });

  test('a package missing from package.json fails', () => {
    expect(() => itemFor('button', 'button.tsx', read, {})).toThrow(
      'class-variance-authority',
    );
  });
});

test('buildRegistry: one item per export, and the theme', () => {
  const { index } = buildRegistry(
    {
      version: '1.0.0',
      exports: {
        './button': './src/button.tsx',
        './token-check': './src/token-check.ts',
      },
      dependencies: VERSIONS,
    },
    read,
  );
  expect(index.items.map((item) => item.name)).toEqual(['button', 'theme']);
  expect(index.items[1]).toEqual({
    name: 'theme',
    files: ['design/theme.css', 'design/fonts.css'],
    dependencies: ['@fontsource/ibm-plex-sans'],
  });
});
