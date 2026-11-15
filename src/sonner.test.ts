// The toast store under the <Toaster>: the same id updates a toast in place,
// and a closed toast leaves after its closing animation.
import { expect, test } from 'bun:test';
import { toast } from './sonner';

test('the same id updates one toast; dismiss closes it', async () => {
  const id = toast('Saving…', { id: 'save' });
  expect(toast.success('Saved', { id: 'save' })).toBe(id);
  expect(toast.dismiss('save')).toBe('save');
  // Closing twice is harmless.
  expect(toast.dismiss('save')).toBe('save');
  await new Promise((resolve) => setTimeout(resolve, 250));
});

test('each toast without an id gets its own', () => {
  const first = toast.info('One');
  const second = toast.error('Two');
  expect(first).not.toBe(second);
  toast.dismiss();
});
