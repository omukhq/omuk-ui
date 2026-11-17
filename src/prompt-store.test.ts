// The prompt store under the <PromptProvider>: each prompt's promise gives
// the answer once, and a closed prompt waits for its closing animation.
import { afterEach, expect, test } from 'bun:test';
import {
  type AlertEntry,
  type ContentEntry,
  closeAllPrompts,
  openPrompt,
  removePrompt,
  snapshot,
} from './prompt-store';

afterEach(() => {
  closeAllPrompts();
  for (const entry of snapshot()) removePrompt(entry.id);
});

function lastAlert(): AlertEntry {
  const entry = snapshot().at(-1);
  if (entry?.type !== 'alert') throw new Error('No open alert.');
  return entry;
}

function lastContent(): ContentEntry {
  const entry = snapshot().at(-1);
  if (!entry || entry.type === 'alert')
    throw new Error('No open modal or drawer.');
  return entry;
}

test('an alert gives true for its action, and stays until removed', async () => {
  const answer = openPrompt({
    type: 'alert',
    title: 'Delete?',
    actionLabel: 'Delete',
  });
  lastAlert().confirm();
  expect(await answer).toBe(true);
  // Closing, not gone: the provider removes it after the animation.
  expect(snapshot()).toHaveLength(1);
  expect(snapshot()[0]?.open).toBe(false);
});

test('an alert gives false when dismissed; the first answer wins', async () => {
  const answer = openPrompt({
    type: 'alert',
    title: 'Leave?',
    actionLabel: 'Leave',
  });
  const alert = lastAlert();
  alert.dismiss();
  alert.confirm();
  expect(await answer).toBe(false);
});

test('a modal gives what its content passes to close, or null', async () => {
  const named = openPrompt<string>({
    type: 'modal',
    title: 'Rename',
    content: (close) => {
      queueMicrotask(() => close('Acme'));
      return null;
    },
  });
  expect(await named).toBe('Acme');

  const dismissed = openPrompt<string>({ type: 'drawer', content: () => null });
  const drawer = lastContent();
  expect(drawer.direction).toBe('right');
  drawer.dismiss();
  expect(await dismissed).toBeNull();
});

test('closeAll closes every open prompt', async () => {
  const alert = openPrompt({ type: 'alert', title: 'One', actionLabel: 'OK' });
  const modal = openPrompt<number>({ type: 'modal', content: () => null });
  closeAllPrompts();
  expect(await alert).toBe(false);
  expect(await modal).toBeNull();
  expect(snapshot().every((entry) => !entry.open)).toBe(true);
});
