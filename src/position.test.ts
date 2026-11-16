import { afterEach, beforeEach, expect, test } from 'bun:test';
import { place } from './position';

// A popup as the browser sizes it: as tall as its content, but never taller
// than --available-height (the root classes' `max-h-(--available-height)`).
function popup(natural: { w: number; h: number }) {
  const vars = new Map<string, string>();
  const style = {
    left: '',
    top: '',
    setProperty: (name: string, value: string) => vars.set(name, value),
  };
  const available = () =>
    Number.parseFloat(vars.get('--available-height') ?? 'Infinity');
  return {
    style,
    get offsetWidth() {
      return natural.w;
    },
    get offsetHeight() {
      return Math.min(natural.h, available());
    },
    querySelectorAll: () => [],
    available,
  };
}

const saved = globalThis.document;
const savedWindow = globalThis.window;

beforeEach(() => {
  // A window 800 tall, 1200 wide.
  globalThis.document = {
    documentElement: { clientWidth: 1200, clientHeight: 800, dir: 'ltr' },
  } as unknown as Document;
  globalThis.window = { devicePixelRatio: 1 } as unknown as Window &
    typeof globalThis;
});

afterEach(() => {
  globalThis.document = saved;
  globalThis.window = savedWindow;
});

const BELOW = {
  side: 'bottom',
  align: 'start',
  sideOffset: 4,
  alignOffset: 0,
} as const;

test('a list near the bottom opens above, at its full height', () => {
  // A button 80 from the bottom; the list is 160 tall.
  const box = popup({ w: 100, h: 160 });
  place(
    box as unknown as HTMLElement,
    { top: 690, left: 100, width: 60, height: 30 },
    BELOW,
  );
  expect(Number.parseFloat(box.style.top)).toBe(690 - 4 - 160);
  expect(box.available()).toBe(690 - 5 - 4);
});

test('a list with room below opens below', () => {
  const box = popup({ w: 100, h: 160 });
  place(
    box as unknown as HTMLElement,
    { top: 100, left: 100, width: 60, height: 30 },
    BELOW,
  );
  expect(Number.parseFloat(box.style.top)).toBe(134);
});

test('with too little room either way, it takes the roomier side, shrunk', () => {
  // A window 800 tall; a 900 list; the button at 300: more room below.
  const box = popup({ w: 100, h: 900 });
  place(
    box as unknown as HTMLElement,
    { top: 300, left: 100, width: 60, height: 30 },
    BELOW,
  );
  expect(Number.parseFloat(box.style.top)).toBe(334);
  expect(box.available()).toBe(800 - 330 - 5 - 4);
});
