import { describe, expect, test } from 'bun:test';
import {
  bumpPackageJson,
  bumpSpec,
  changelogBetween,
  isOlder,
  specsIn,
  versionOf,
} from './update-apps-lib';

describe('an install spec', () => {
  test.each([
    ['github:omukhq/omuk-ui#v1.0.0-alpha.27', '1.0.0-alpha.27'],
    [
      'git+ssh://git@github.com/omukhq/omuk-ui.git#v1.0.0-alpha.18',
      '1.0.0-alpha.18',
    ],
    ['1.0.0-alpha.27', '1.0.0-alpha.27'],
    ['npm:@omukhq/ui@1.0.0-alpha.30', '1.0.0-alpha.30'],
    ['github:omukhq/omuk-ui', null],
    ['workspace:*', null],
  ])('%s pins %s', (spec, version) => {
    expect(versionOf(spec)).toBe(version);
  });

  test('keeps its own form when it moves', () => {
    expect(
      bumpSpec('github:omukhq/omuk-ui#v1.0.0-alpha.27', '1.0.0-alpha.30'),
    ).toBe('github:omukhq/omuk-ui#v1.0.0-alpha.30');
    expect(
      bumpSpec(
        'git+ssh://git@github.com/omukhq/omuk-ui.git#v1.0.0-alpha.18',
        '1.0.0-alpha.30',
      ),
    ).toBe('git+ssh://git@github.com/omukhq/omuk-ui.git#v1.0.0-alpha.30');
    expect(bumpSpec('1.0.0-alpha.27', '1.0.0-alpha.30')).toBe('1.0.0-alpha.30');
    expect(bumpSpec('workspace:*', '1.0.0-alpha.30')).toBeNull();
    expect(bumpSpec('npm:@omukhq/ui@1.0.0-alpha.30', '1.0.0-alpha.31')).toBe(
      'npm:@omukhq/ui@1.0.0-alpha.31',
    );
  });

  test('a GitHub spec becomes the npm alias with --to-npm', () => {
    expect(
      bumpSpec(
        'git+ssh://git@github.com/omukhq/omuk-ui.git#v1.0.0-alpha.30',
        '1.0.0-alpha.30',
        true,
      ),
    ).toBe('npm:@omukhq/ui@1.0.0-alpha.30');
    // An npm version or the alias stays as it is.
    expect(bumpSpec('1.0.0-alpha.30', '1.0.0-alpha.31', true)).toBe(
      '1.0.0-alpha.31',
    );
  });
});

describe('a package.json', () => {
  const text = `{
  "dependencies": {
    "@omuk/ui": "github:omukhq/omuk-ui#v1.0.0-alpha.22",
    "react": "19.3.0"
  },
  "devDependencies": { "@omukhq/ui": "1.0.0-alpha.22" }
}
`;

  test('finds both package names', () => {
    expect(specsIn(text)).toEqual([
      'github:omukhq/omuk-ui#v1.0.0-alpha.22',
      '1.0.0-alpha.22',
    ]);
  });

  test('moves every spec and keeps the rest as it was', () => {
    expect(bumpPackageJson(text, '1.0.0-alpha.30')).toBe(
      text
        .replace('#v1.0.0-alpha.22', '#v1.0.0-alpha.30')
        .replace('"1.0.0-alpha.22"', '"1.0.0-alpha.30"'),
    );
  });
});

test('versions compare by their numbers', () => {
  expect(isOlder('1.0.0-alpha.9', '1.0.0-alpha.10')).toBe(true);
  expect(isOlder('1.0.0-alpha.30', '1.0.0-alpha.30')).toBe(false);
  expect(isOlder('1.0.0-alpha.30', '1.0.0')).toBe(true);
  expect(isOlder('1.0.0', '1.0.0-alpha.30')).toBe(false);
});

test('the changelog between two versions', () => {
  const changelog = `# Changelog

## [Unreleased]

## [1.0.0-alpha.30] - 2026-11-26

Thirty.

## [1.0.0-alpha.29] - 2026-11-26

Twenty-nine.

## [1.0.0-alpha.28] - 2026-11-26

Twenty-eight.
`;
  const between = changelogBetween(
    changelog,
    '1.0.0-alpha.28',
    '1.0.0-alpha.30',
  );
  expect(between).toContain('Thirty.');
  expect(between).toContain('Twenty-nine.');
  expect(between).not.toContain('Twenty-eight.');
  expect(between).not.toContain('Unreleased');
});
