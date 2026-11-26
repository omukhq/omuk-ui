import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from 'omuk-ui/alert-dialog';
import { Button } from 'omuk-ui/button';
import { useState } from 'react';

function wait(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export default function AlertDialogDelete() {
  const [open, setOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);

  async function deleteProject() {
    setDeleting(true);
    await wait(1200);
    setDeleting(false);
    setOpen(false);
  }

  return (
    <AlertDialog
      open={open}
      onOpenChange={(next) => {
        // Escape does not close it while the delete runs.
        if (!deleting) setOpen(next);
      }}
    >
      <AlertDialogTrigger render={<Button variant="destructive" />}>
        Delete project
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete “Website”?</AlertDialogTitle>
          <AlertDialogDescription>
            Its 3 environments and 42 secrets are deleted too. You cannot undo
            this.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={deleting}>Cancel</AlertDialogCancel>
          <AlertDialogAction
            variant="danger-confirm"
            isLoading={deleting}
            loadingLabel="Deleting"
            onClick={deleteProject}
          >
            Delete project
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
