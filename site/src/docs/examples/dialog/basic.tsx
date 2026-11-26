import { Button } from 'omuk-ui/button';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from 'omuk-ui/dialog';

export default function DialogBasic() {
  return (
    <Dialog>
      <DialogTrigger render={<Button variant="outline" />}>
        What’s new
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>What’s new in 1.0</DialogTitle>
          <DialogDescription>
            Fields keep their container’s width, and toasts pause while the
            pointer is over them.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <DialogClose render={<Button />}>Got it</DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
