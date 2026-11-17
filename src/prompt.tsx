import { useState, useSyncExternalStore } from 'react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from './alert-dialog';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from './dialog';
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
} from './drawer';
import {
  type AlertEntry,
  type ContentEntry,
  closeAllPrompts,
  openPrompt,
  removePrompt,
  snapshot,
  subscribe,
} from './prompt-store';
import { cn } from './utils';

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

export type {
  AlertPromptOptions,
  DrawerDirection,
  DrawerPromptOptions,
  ModalPromptOptions,
  PromptOptions,
} from './prompt-store';

const PROMPT = { open: openPrompt, closeAll: closeAllPrompts };

/**
 * `open(options)` shows an alert (gives `true` or `false`), a modal or a
 * drawer (gives what its content passes to `close`, or `null`).
 * `closeAll()` closes every open prompt. The same object outside React:
 * `prompt`.
 */
export function usePrompt() {
  return PROMPT;
}

/** `usePrompt()` for code outside a component. */
export const prompt = PROMPT;

/** Draws the open prompts. One in the app. */
export function PromptProvider() {
  const entries = useSyncExternalStore(subscribe, snapshot, snapshot);
  return (
    <>
      {entries.map((entry) =>
        entry.type === 'alert' ? (
          <AlertPrompt key={entry.id} entry={entry} />
        ) : entry.type === 'modal' ? (
          <ModalPrompt key={entry.id} entry={entry} />
        ) : (
          <DrawerPrompt key={entry.id} entry={entry} />
        ),
      )}
    </>
  );
}

/** Drops the entry once the closing animation is done. */
function removeOnExit(id: number) {
  return (open: boolean) => {
    if (!open) removePrompt(id);
  };
}

function AlertPrompt({ entry }: { entry: AlertEntry }) {
  const { options } = entry;
  const [running, setRunning] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function act() {
    if (!options.onAction) {
      entry.confirm();
      return;
    }
    setRunning(true);
    setError(null);
    try {
      await options.onAction();
      entry.confirm();
    } catch (thrown) {
      setError(
        thrown instanceof Error && thrown.message
          ? thrown.message
          : 'Something went wrong. Try again.',
      );
    } finally {
      setRunning(false);
    }
  }

  return (
    <AlertDialog
      open={entry.open}
      onOpenChange={(open) => {
        // No way out while the action runs.
        if (!open && !running) entry.dismiss();
      }}
      onOpenChangeComplete={removeOnExit(entry.id)}
    >
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{options.title}</AlertDialogTitle>
          {options.description && (
            <AlertDialogDescription>
              {options.description}
            </AlertDialogDescription>
          )}
        </AlertDialogHeader>
        {error && (
          <p role="alert" className="text-sm text-danger">
            {error}
          </p>
        )}
        <AlertDialogFooter>
          <AlertDialogCancel disabled={running}>
            {options.cancelLabel ?? 'Cancel'}
          </AlertDialogCancel>
          <AlertDialogAction
            variant={options.destructive ? 'danger-confirm' : 'default'}
            isLoading={running}
            loadingLabel={options.loadingLabel ?? 'Working'}
            onClick={() => void act()}
          >
            {options.actionLabel}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

function ModalPrompt({ entry }: { entry: ContentEntry }) {
  return (
    <Dialog
      open={entry.open}
      onOpenChange={(open) => {
        if (!open) entry.dismiss();
      }}
      onOpenChangeComplete={removeOnExit(entry.id)}
    >
      {/* Taller than the window, it scrolls inside: the popup is centred
          with a -50% move, so it would run off both edges and hide its
          own buttons. */}
      <DialogContent
        className={cn('max-h-11/12 overflow-y-auto', entry.className)}
      >
        {(entry.title || entry.description) && (
          <DialogHeader>
            {entry.title && <DialogTitle>{entry.title}</DialogTitle>}
            {entry.description && (
              <DialogDescription>{entry.description}</DialogDescription>
            )}
          </DialogHeader>
        )}
        {entry.body}
      </DialogContent>
    </Dialog>
  );
}

function DrawerPrompt({ entry }: { entry: ContentEntry }) {
  return (
    <Drawer
      direction={entry.direction}
      open={entry.open}
      onOpenChange={(open) => {
        if (!open) entry.dismiss();
      }}
      onOpenChangeComplete={removeOnExit(entry.id)}
    >
      <DrawerContent className={entry.className}>
        {(entry.title || entry.description) && (
          <DrawerHeader>
            {entry.title && <DrawerTitle>{entry.title}</DrawerTitle>}
            {entry.description && (
              <DrawerDescription>{entry.description}</DrawerDescription>
            )}
          </DrawerHeader>
        )}
        {entry.body}
      </DrawerContent>
    </Drawer>
  );
}
