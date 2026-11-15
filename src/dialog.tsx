import { XIcon } from 'lucide-react';
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

function Dialog({ ...props }: ModalRootProps) {
  return <ModalRoot role="dialog" {...props} />;
}

function DialogTrigger({
  ...props
}: React.ComponentProps<typeof ModalTrigger>) {
  return <ModalTrigger data-slot="dialog-trigger" {...props} />;
}

function DialogPortal({ ...props }: React.ComponentProps<typeof ModalPortal>) {
  return <ModalPortal {...props} />;
}

function DialogClose({ ...props }: React.ComponentProps<typeof ModalClose>) {
  return <ModalClose data-slot="dialog-close" {...props} />;
}

function DialogOverlay({
  className,
  ...props
}: React.ComponentProps<typeof ModalBackdrop>) {
  return (
    <ModalBackdrop
      data-slot="dialog-overlay"
      className={cn(SCRIM, className)}
      {...props}
    />
  );
}

function DialogContent({
  className,
  children,
  showCloseButton = true,
  ...props
}: React.ComponentProps<typeof ModalPopup> & {
  showCloseButton?: boolean;
}) {
  return (
    <DialogPortal>
      <DialogOverlay />
      <ModalPopup
        data-slot="dialog-content"
        className={cn(MODAL, 'max-w-md', className)}
        {...props}
      >
        {children}
        {showCloseButton && (
          <ModalClose
            data-slot="dialog-close"
            render={
              <Button
                variant="ghost"
                className="absolute top-4 right-4"
                size="icon"
              />
            }
          >
            <XIcon strokeWidth={1.5} />
            <span className="sr-only">Close</span>
          </ModalClose>
        )}
      </ModalPopup>
    </DialogPortal>
  );
}

function DialogHeader({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="dialog-header"
      className={cn('flex flex-col gap-2', className)}
      {...props}
    />
  );
}

function DialogFooter({
  className,
  showCloseButton = false,
  children,
  ...props
}: React.ComponentProps<'div'> & {
  showCloseButton?: boolean;
}) {
  return (
    <div
      data-slot="dialog-footer"
      className={cn(
        'flex flex-col-reverse gap-2 sm:flex-row sm:justify-end',
        className,
      )}
      {...props}
    >
      {children}
      {showCloseButton && (
        <ModalClose render={<Button size="lg" variant="outline" />}>
          Close
        </ModalClose>
      )}
    </div>
  );
}

function DialogTitle({
  className,
  ...props
}: React.ComponentProps<typeof ModalTitle>) {
  return (
    <ModalTitle
      data-slot="dialog-title"
      className={cn(MODAL_TITLE, className)}
      {...props}
    />
  );
}

function DialogDescription({
  className,
  ...props
}: React.ComponentProps<typeof ModalDescription>) {
  return (
    <ModalDescription
      data-slot="dialog-description"
      className={cn(MODAL_DESCRIPTION, className)}
      {...props}
    />
  );
}

export {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogOverlay,
  DialogPortal,
  DialogTitle,
  DialogTrigger,
};
