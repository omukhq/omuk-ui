import type * as React from 'react';
import { Button } from './button';
import {
  ModalBackdrop,
  ModalClose,
  ModalDescription,
  ModalPopup,
  ModalPortal,
  ModalRoot,
  type ModalRootProps,
  ModalTitle,
  ModalTrigger,
} from './modal';
import { MODAL, MODAL_DESCRIPTION, MODAL_TITLE, SCRIM } from './recipes';
import { cn } from './utils';

function AlertDialog({ ...props }: ModalRootProps) {
  return <ModalRoot role="alertdialog" {...props} />;
}

function AlertDialogTrigger({
  ...props
}: React.ComponentProps<typeof ModalTrigger>) {
  return <ModalTrigger data-slot="alert-dialog-trigger" {...props} />;
}

function AlertDialogPortal({
  ...props
}: React.ComponentProps<typeof ModalPortal>) {
  return <ModalPortal {...props} />;
}

function AlertDialogOverlay({
  className,
  ...props
}: React.ComponentProps<typeof ModalBackdrop>) {
  return (
    <ModalBackdrop
      data-slot="alert-dialog-overlay"
      className={cn(SCRIM, className)}
      {...props}
    />
  );
}

function AlertDialogContent({
  className,
  size = 'md',
  ...props
}: React.ComponentProps<typeof ModalPopup> & {
  size?: 'sm' | 'md';
}) {
  return (
    <AlertDialogPortal>
      <AlertDialogOverlay />
      <ModalPopup
        data-slot="alert-dialog-content"
        data-size={size}
        // A dialog (DESIGN.md, section 3); its actions at the bottom right,
        // the safe one first.
        className={cn(
          MODAL,
          'group/alert-dialog-content max-w-xs',
          size === 'md' && 'sm:max-w-lg',
          className,
        )}
        {...props}
      />
    </AlertDialogPortal>
  );
}

function AlertDialogHeader({
  className,
  ...props
}: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="alert-dialog-header"
      className={cn('flex flex-col items-start gap-2 text-left', className)}
      {...props}
    />
  );
}

function AlertDialogFooter({
  className,
  ...props
}: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="alert-dialog-footer"
      className={cn(
        'flex flex-col-reverse gap-2 sm:flex-row sm:justify-end in-data-[size=sm]:grid in-data-[size=sm]:grid-cols-2',
        className,
      )}
      {...props}
    />
  );
}

function AlertDialogMedia({
  className,
  ...props
}: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="alert-dialog-media"
      className={cn(
        'mb-2 inline-flex size-12 items-center justify-center rounded-lg bg-hover text-muted',
        className,
      )}
      {...props}
    />
  );
}

function AlertDialogTitle({
  className,
  ...props
}: React.ComponentProps<typeof ModalTitle>) {
  return (
    <ModalTitle
      data-slot="alert-dialog-title"
      className={cn(MODAL_TITLE, className)}
      {...props}
    />
  );
}

function AlertDialogDescription({
  className,
  ...props
}: React.ComponentProps<typeof ModalDescription>) {
  return (
    <ModalDescription
      data-slot="alert-dialog-description"
      className={cn(MODAL_DESCRIPTION, 'text-pretty', className)}
      {...props}
    />
  );
}

function AlertDialogAction({
  className,
  ...props
}: React.ComponentProps<typeof Button>) {
  return (
    <Button
      data-slot="alert-dialog-action"
      className={cn(className)}
      {...props}
    />
  );
}

function AlertDialogCancel({
  className,
  variant = 'outline',
  size,
  ...props
}: React.ComponentProps<typeof ModalClose> &
  Pick<React.ComponentProps<typeof Button>, 'variant' | 'size'>) {
  return (
    <ModalClose
      data-slot="alert-dialog-cancel"
      className={cn(className)}
      render={<Button variant={variant} size={size} />}
      {...props}
    />
  );
}

export {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogMedia,
  AlertDialogOverlay,
  AlertDialogPortal,
  AlertDialogTitle,
  AlertDialogTrigger,
};
