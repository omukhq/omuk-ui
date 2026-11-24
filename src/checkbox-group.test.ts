import { expect, test } from 'bun:test';
import { parentState } from './checkbox-group';

const ALL = ['comments', 'mentions', 'deploys'];

test('a parent box is checked when every value is', () => {
  expect(parentState(ALL, ALL)).toEqual({ checked: true, mixed: false });
});

test('a parent box shows a dash when only some values are checked', () => {
  expect(parentState(['mentions'], ALL)).toEqual({
    checked: false,
    mixed: true,
  });
});

test('a parent box is empty when no value is checked', () => {
  expect(parentState([], ALL)).toEqual({ checked: false, mixed: false });
});

test('values outside allValues do not count', () => {
  expect(parentState(['other'], ALL)).toEqual({
    checked: false,
    mixed: false,
  });
  expect(parentState([...ALL, 'other'], ALL).checked).toBe(true);
});

test('with no allValues, a parent box is never checked', () => {
  expect(parentState(['comments'], [])).toEqual({
    checked: false,
    mixed: false,
  });
});
