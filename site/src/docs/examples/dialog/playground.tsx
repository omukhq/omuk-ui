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
import { Playground } from '../../playground';

type Values = {
  title: string;
  description: string;
  closeLabel: string;
  showCloseButton: boolean;
};

const INITIAL: Values = {
  title: 'What’s new in 1.0',
  description:
    'Fields keep their container’s width, and toasts pause while the pointer is over them.',
  closeLabel: 'Got it',
  showCloseButton: true,
};

function code(values: Values) {
  const close = values.showCloseButton ? '' : ' showCloseButton={false}';
  return `import { Button } from 'omuk-ui/button';
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

<Dialog>
  <DialogTrigger render={<Button variant="outline" />}>
    Open the dialog
  </DialogTrigger>
  <DialogContent${close}>
    <DialogHeader>
      <DialogTitle>${values.title}</DialogTitle>
      <DialogDescription>${values.description}</DialogDescription>
    </DialogHeader>
    <DialogFooter>
      <DialogClose render={<Button />}>${values.closeLabel}</DialogClose>
    </DialogFooter>
  </DialogContent>
</Dialog>`;
}

export default function DialogPlayground() {
  return (
    <Playground
      initial={INITIAL}
      controls={[
        { name: 'title', kind: 'text' },
        { name: 'description', kind: 'text' },
        { name: 'closeLabel', kind: 'text' },
        { name: 'showCloseButton', kind: 'boolean' },
      ]}
      render={(values) => (
        <Dialog>
          <DialogTrigger render={<Button variant="outline" />}>
            Open the dialog
          </DialogTrigger>
          <DialogContent showCloseButton={values.showCloseButton}>
            <DialogHeader>
              <DialogTitle>{values.title}</DialogTitle>
              <DialogDescription>{values.description}</DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <DialogClose render={<Button />}>{values.closeLabel}</DialogClose>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
      code={code}
    />
  );
}
