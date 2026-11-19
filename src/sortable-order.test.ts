import { expect, test } from 'bun:test';
import { landing, move, shifts } from './sortable-order';

const ABCD = ['a', 'b', 'c', 'd'];

test('move takes an item down or up, the others keep their order', () => {
  expect(move(ABCD, 0, 2)).toEqual(['b', 'c', 'a', 'd']);
  expect(move(ABCD, 3, 1)).toEqual(['a', 'd', 'b', 'c']);
  expect(move(ABCD, 1, 1)).toEqual(ABCD);
});

test('move leaves the order as it is for an index outside the list', () => {
  expect(move(ABCD, -1, 2)).toEqual(ABCD);
  expect(move(ABCD, 0, 4)).toEqual(ABCD);
  expect(move([], 0, 0)).toEqual([]);
});

test('move does not change the order it was given', () => {
  const order = [...ABCD];
  move(order, 0, 3);
  expect(order).toEqual(ABCD);
});

// Four rows, 32 tall, 4 apart: tops 0, 36, 72, 108; middles 16, 52, 88, 124.
const ROWS = [0, 36, 72, 108].map((top) => ({ top, height: 32 }));

test('landing: the item lands past the middles it crossed', () => {
  // The first row's middle (16) moves 40 down to 56: past 52, not 88.
  expect(landing(ROWS, 0, 40)).toBe(1);
  expect(landing(ROWS, 0, 80)).toBe(2);
  expect(landing(ROWS, 0, 500)).toBe(3);
  // The last row's middle (124) moves 80 up to 44: before 52, not 16.
  expect(landing(ROWS, 3, -80)).toBe(1);
  expect(landing(ROWS, 3, -500)).toBe(0);
});

test('landing: a small move keeps the item where it was', () => {
  expect(landing(ROWS, 1, 10)).toBe(1);
  expect(landing(ROWS, 1, -10)).toBe(1);
});

test('shifts: the rows passed step aside by a row and its gap', () => {
  expect(shifts(ROWS, 0, 2)).toEqual([0, -36, -36, 0]);
  expect(shifts(ROWS, 3, 1)).toEqual([0, 36, 36, 0]);
  expect(shifts(ROWS, 1, 1)).toEqual([0, 0, 0, 0]);
});

test('shifts: a list of one has nothing to move', () => {
  expect(shifts([{ top: 0, height: 32 }], 0, 0)).toEqual([0]);
});
