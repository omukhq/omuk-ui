import { expect, test } from 'bun:test';
import { filterCommands, rank } from './command-filter';

const ITEMS = [
  { id: 'button', label: 'Button', group: 'Components' },
  { id: 'group', label: 'Button group', group: 'Components' },
  {
    id: 'date',
    label: 'Date picker',
    group: 'Components',
    keywords: ['calendar'],
  },
  { id: 'dark', label: 'Dark theme', group: 'Actions' },
  {
    id: 'toast',
    label: 'Toast',
    group: 'Components',
    description: 'A short message',
  },
  { id: 'home', label: 'Home' },
];

function ids(query: string) {
  return filterCommands(ITEMS, query).map((section) => [
    section.group,
    section.items.map((item) => item.id),
  ]);
}

test('an empty query keeps every item, in its group, in order', () => {
  expect(ids('')).toEqual([
    ['Components', ['button', 'group', 'date', 'toast']],
    ['Actions', ['dark']],
    [undefined, ['home']],
  ]);
});

test('a group with no match is left out', () => {
  expect(ids('dark')).toEqual([['Actions', ['dark']]]);
});

test('the search ignores case and the spaces around the query', () => {
  expect(ids('  BUTTON ')).toEqual([['Components', ['button', 'group']]]);
});

test('a match at the start of the label comes before one inside it', () => {
  // "group" starts a word in "Button group"; "p" is only inside "Date picker".
  const items = [
    { id: 'picker', label: 'Date picker' },
    { id: 'popover', label: 'Popover' },
  ];
  expect(filterCommands(items, 'p')[0]?.items.map((item) => item.id)).toEqual([
    'popover',
    'picker',
  ]);
});

test('a keyword and the description match after the label', () => {
  expect(ids('calendar')).toEqual([['Components', ['date']]]);
  expect(ids('message')).toEqual([['Components', ['toast']]]);
  expect(
    rank({ id: 'd', label: 'Date picker', keywords: ['calendar'] }, 'calendar'),
  ).toBe(3);
});

test('no match gives no sections', () => {
  expect(ids('zzz')).toEqual([]);
});
