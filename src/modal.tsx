// The modal dialog both dialog.tsx and alert-dialog.tsx draw, on the native
// <dialog>: showModal() puts it in the top layer, makes the page behind it
// inert and traps the focus; close() gives the focus back.
//
// The <dialog> is a transparent box over the whole window, and the parts
// inside it (the backdrop, the popup) are the same elements, with the same
// root class strings, as Base UI's.
import {
  type ComponentPropsWithRef,
  createContext,
  type ReactNode,
  use,
  useId,
} from 'react';
import { createPortal } from 'react-dom';
import {
  addLayer,
  animationsDone,
  namePopup,
  type PopupRoot,
  type PopupRootProps,
  popupState,
  tabbables,
  triggerState,
  usePopupRoot,
} from './popup';
import { mergeProps, type RenderProp, useMergedRef, useRender } from './render';

type ModalState = PopupRoot & {
  id: string;
  role: 'dialog' | 'alertdialog';
  /** A press on the backdrop closes it (not an alert dialog's). */
  dismissible: boolean;
};

const ModalContext = createContext<ModalState | null>(null);

function useModal() {
  const modal = use(ModalContext);
  if (!modal) throw new Error('A dialog part must be inside its dialog.');
  return modal;
}

export type ModalRootProps = PopupRootProps & {
  modal?: boolean | 'trap-focus';
  disablePointerDismissal?: boolean;
  children?: ReactNode;
};

export function ModalRoot({
  role,
  modal: _modal,
  disablePointerDismissal = false,
  children,
  ...props
}: ModalRootProps & { role: ModalState['role'] }) {
  const root = usePopupRoot(props);
  const id = useId();
  const dismissible = role === 'dialog' && !disablePointerDismissal;
  return (
    <ModalContext value={{ ...root, id, role, dismissible }}>
      {children}
    </ModalContext>
  );
}

type ButtonPartProps = ComponentPropsWithRef<'button'> & {
  render?: RenderProp;
  nativeButton?: boolean;
};

export function ModalTrigger({
  render,
  nativeButton: _nativeButton,
  ref,
  ...props
}: ButtonPartProps) {
  const modal = useModal();
  const merged = useMergedRef(ref, modal.setTrigger);
  return useRender(
    'button',
    mergeProps(
      {
        type: 'button',
        ref: merged,
        'aria-haspopup': 'dialog',
        'aria-expanded': modal.open,
        ...triggerState(modal.open),
        onClick(event: React.MouseEvent) {
          modal.setOpen(true, 'trigger-press', event);
        },
      },
      props,
    ),
    render,
  );
}

export function ModalClose({
  render,
  nativeButton: _nativeButton,
  ...props
}: ButtonPartProps) {
  const modal = useModal();
  return useRender(
    'button',
    mergeProps(
      {
        type: 'button',
        onClick(event: React.MouseEvent) {
          modal.setOpen(false, 'close-press', event);
        },
      },
      props,
    ),
    render,
  );
}

// Opens the dialog before its contents mount: an `autoFocus` inside can
// then take the focus (see showNext in popup.tsx).
function showModalNext(marker: HTMLElement | null) {
  const next = marker?.nextElementSibling;
  if (next instanceof HTMLDialogElement) show(next);
}

/**
 * Opens `dialog` in the top layer. The toaster (sonner.tsx) hears of it and
 * moves above it: an event, not an import, so the toaster in every first
 * load and the dialogs loaded on first use stay apart.
 */
function show(dialog: HTMLDialogElement) {
  if (dialog.open) return;
  dialog.showModal();
  document.dispatchEvent(new Event('modalopen'));
}

const BOX =
  'fixed inset-0 m-0 size-full max-h-none max-w-none overflow-visible border-0 bg-transparent p-0 text-inherit outline-none backdrop:bg-transparent';

/** Base UI's Portal: here the <dialog> in the top layer. */
export function ModalPortal({
  children,
}: {
  children?: ReactNode;
  container?: unknown;
  keepMounted?: boolean;
}) {
  const modal = useModal();
  const { status } = modal;

  // Runs again on each render while mounted, so it must be idempotent.
  function frame(node: HTMLDialogElement | null) {
    if (!node) return;
    const dialog = node;
    namePopup(dialog, modal.id);
    let alive = true;
    if (status === 'closing') {
      delete dialog.dataset.entered;
      void animationsDone(dialog).then(() => {
        if (!alive) return;
        if (dialog.open) dialog.close();
        modal.exited();
      });
      return () => {
        alive = false;
      };
    }
    show(dialog);
    const removeLayer = addLayer({
      element: dialog,
      passive: false,
      close: (event) => modal.setOpen(false, 'escape-key', event),
    });
    if (dialog.dataset.entered === undefined) {
      dialog.dataset.entered = '';
      void animationsDone(dialog).then(() => {
        if (alive) modal.entered();
      });
    }
    return () => {
      alive = false;
      removeLayer();
    };
  }

  if (status === 'closed') return null;
  return createPortal(
    <>
      <span hidden ref={showModalNext} />
      <dialog
        ref={frame}
        role={modal.role === 'alertdialog' ? 'alertdialog' : undefined}
        className={BOX}
        // Escape is handled with the other popups (popup.tsx); this is the
        // browser's other ways to ask, like Android's back gesture.
        onCancel={(event) => {
          event.preventDefault();
          modal.setOpen(false, 'escape-key', event);
        }}
        // Tab goes round inside, as Base UI's focus trap does: a <dialog>
        // alone lets it out to the browser's own controls.
        onKeyDown={(event) => {
          if (event.key !== 'Tab' || event.defaultPrevented) return;
          const all = tabbables(event.currentTarget);
          const edge = event.shiftKey ? all[0] : all.at(-1);
          if (all.length && document.activeElement !== edge) return;
          event.preventDefault();
          (event.shiftKey ? all.at(-1) : all[0])?.focus();
        }}
        // Closed by the browser without asking: follow it.
        onClose={(event) => {
          if (modal.open) modal.setOpen(false, 'escape-key', event);
        }}
      >
        {children}
      </dialog>
    </>,
    document.body,
  );
}

export function ModalBackdrop({
  render,
  onClick,
  ...props
}: ComponentPropsWithRef<'div'> & { render?: RenderProp }) {
  const modal = useModal();
  return useRender(
    'div',
    {
      role: 'presentation',
      ...popupState(modal.open),
      ...props,
      onClick(event: React.MouseEvent<HTMLDivElement>) {
        onClick?.(event);
        if (modal.dismissible) modal.setOpen(false, 'outside-press', event);
      },
    },
    render,
  );
}

export function ModalPopup({
  render,
  initialFocus: _initialFocus,
  finalFocus: _finalFocus,
  ...props
}: ComponentPropsWithRef<'div'> & {
  render?: RenderProp;
  /** Accepted for Base UI's props; the <dialog> moves the focus itself. */
  initialFocus?: unknown;
  finalFocus?: unknown;
}) {
  const modal = useModal();
  return useRender('div', { ...popupState(modal.open), ...props }, render);
}

export function ModalTitle({
  render,
  ...props
}: ComponentPropsWithRef<'h2'> & { render?: RenderProp }) {
  const modal = useModal();
  return useRender('h2', { id: `${modal.id}-title`, ...props }, render);
}

export function ModalDescription({
  render,
  ...props
}: ComponentPropsWithRef<'p'> & { render?: RenderProp }) {
  const modal = useModal();
  return useRender('p', { id: `${modal.id}-description`, ...props }, render);
}
