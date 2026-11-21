import { useSyncExternalStore } from 'react';
import { snapshot, subscribe } from './prompt-store';

// Alerts, modals and drawers opened from code, with an answer to await:
//
//   const prompt = usePrompt();
//   const ok = await prompt.open({ type: 'alert', title: 'Delete the team?',
//     description: 'It cannot be undone.', actionLabel: 'Delete', destructive: true });
//   if (!ok) return;
//
//   const name = await prompt.open<string>({ type: 'modal', title: 'Rename',
//     content: (close) => <RenameForm onDone={close} /> });
//   if (name === null) return;
//
// Put one <PromptProvider /> in the app, inside the providers the prompts'
// content needs (a router, a query client). Prompts opened on top of each
// other stack, the newest on top.
//
// This file holds no dialog or drawer code: the provider loads the views
// (./prompt-views.tsx) when the first prompt opens, so a page that never
// opens one never loads them. The prompt waits in the store meanwhile.

export type {
  AlertPromptOptions,
  DrawerDirection,
  DrawerPromptOptions,
  ModalPromptOptions,
  PromptOptions,
} from './prompt-store';

export { prompt, usePrompt } from './prompt-store';

type Views = typeof import('./prompt-views');

let views: Views | null = null;
let loading: Promise<Views> | null = null;
const listeners = new Set<() => void>();

function loadViews(): Promise<Views> {
  loading ??= import('./prompt-views').then((module) => {
    views = module;
    for (const listener of listeners) listener();
    return module;
  });
  return loading;
}

function subscribeViews(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

/** Draws the open prompts. One in the app. */
export function PromptProvider() {
  const entries = useSyncExternalStore(subscribe, snapshot, snapshot);
  const loaded = useSyncExternalStore(subscribeViews, () => views);
  if (!loaded && entries.length > 0) void loadViews();
  return loaded ? <loaded.PromptViews /> : null;
}
