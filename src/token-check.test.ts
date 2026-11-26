// The literal check (token-check.ts) finds each kind of raw value, and
// leaves token classes, system colours and `design-ok` lines alone.
import { describe, expect, test } from 'bun:test';
import { literalsIn } from './token-check';

describe('literalsIn', () => {
  test.each([
    ['color: #fff', 'hex colour'],
    ['color: hwb(0 0% 0%)', 'colour function'],
    ['color: color(display-p3 1 0 0)', 'colour function'],
    ['background: white', 'named colour'],
    ['border-top-color: red', 'named colour'],
    ['width: 12px', 'pixel value'],
    ['margin: 1.5rem', 'rem value'],
    ['margin: .5rem', 'rem value'],
    ['font-family: Inter', 'font name'],
  ])('%s is a %s', (source, kind) => {
    expect(literalsIn(source)).toContain(kind);
  });

  test.each([
    'bg-red-100 text-white',
    'color: currentcolor',
    'outline-color: CanvasText',
    'h-[var(--spacing-control)]',
    'max-h-[calc(100dvh-(--spacing(8)))]',
    'color: #fff; // design-ok: a team colour',
  ])('%s passes', (source) => {
    expect(literalsIn(source)).toEqual([]);
  });
});
