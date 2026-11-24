import { expect, test } from 'bun:test';
import { cn } from './utils';

test('edge-control is a ring width: it and inset-ring-2 replace each other', () => {
  expect(cn('edge-control', 'inset-ring-2')).toBe('inset-ring-2');
  expect(cn('inset-ring-2', 'edge-control')).toBe('edge-control');
  expect(cn('edge-control', 'inset-ring')).toBe('inset-ring');
});

test('edge-control keeps the ring colour beside it', () => {
  expect(
    cn('edge-control inset-ring-control', 'hover:inset-ring-outline'),
  ).toBe('edge-control inset-ring-control hover:inset-ring-outline');
});

test('squircle and rounded-* replace each other', () => {
  expect(cn('squircle', 'rounded-md')).toBe('rounded-md');
  expect(cn('rounded-md', 'squircle')).toBe('squircle');
});
