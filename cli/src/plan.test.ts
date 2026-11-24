import { describe, expect, test } from 'bun:test';
import { closest, type Item, plan } from './plan';

const BUTTON: Item = {
  name: 'button',
  files: [
    { path: 'button.tsx', content: 'button v2' },
    { path: 'utils.ts', content: 'utils' },
  ],
  dependencies: { clsx: '^2.1.1', 'class-variance-authority': '^0.7.1' },
};
const INPUT: Item = {
  name: 'input',
  files: [
    { path: 'input.tsx', content: 'input' },
    { path: 'utils.ts', content: 'utils' },
  ],
  dependencies: { clsx: '^2.1.1' },
};

function paths(files: { path: string }[]) {
  return files.map((file) => file.path);
}

function never() {
  return false;
}

describe('plan', () => {
  test('a new app: every file is written once, every package installed', () => {
    const result = plan([BUTTON, INPUT], () => null, never, new Set(), false);
    expect(paths(result.write)).toEqual([
      'button.tsx',
      'input.tsx',
      'utils.ts',
    ]);
    expect(result.install).toEqual([
      'class-variance-authority@^0.7.1',
      'clsx@^2.1.1',
    ]);
  });

  test('same text is left; an old copy the app never changed is updated', () => {
    const disk: Record<string, string> = {
      'utils.ts': 'utils',
      'button.tsx': 'button v1',
    };
    const result = plan(
      [BUTTON],
      (path) => disk[path] ?? null,
      (_, current) => current === 'button v1',
      new Set(['clsx']),
      false,
    );
    expect(result.write).toEqual([]);
    expect(paths(result.update)).toEqual(['button.tsx']);
    expect(result.same).toEqual(['utils.ts']);
    expect(result.install).toEqual(['class-variance-authority@^0.7.1']);
  });

  test('a file the app changed is kept, unless overwriting', () => {
    function onDisk(path: string) {
      return path === 'button.tsx' ? 'my own button' : null;
    }
    const kept = plan([BUTTON], onDisk, never, new Set(), false);
    expect(kept.kept).toEqual(['button.tsx']);
    expect(kept.update).toEqual([]);
    const replaced = plan([BUTTON], onDisk, never, new Set(), true);
    expect(paths(replaced.update)).toEqual(['button.tsx']);
    expect(replaced.kept).toEqual([]);
  });
});

test('closest suggests near names', () => {
  expect(closest('buton', ['button', 'badge', 'input'])).toEqual(['button']);
  expect(closest('zzzzzz', ['button'])).toEqual([]);
});
