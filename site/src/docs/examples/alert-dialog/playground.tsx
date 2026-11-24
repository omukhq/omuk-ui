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
} from '@omuk/ui/alert-dialog';
import { Button } from '@omuk/ui/button';
import { useState } from 'react';
import { Playground } from '../../playground';

const SIZES = ['md', 'sm'] as const;
const VARIANTS = ['default', 'danger-confirm'] as const;

type Values = {
  title: string;
  description: string;
  actionLabel: string;
  cancelLabel: string;
  size: (typeof SIZES)[number];
  variant: (typeof VARIANTS)[number];
};

const INITIAL: Values = {
  title: 'Delete the project?',
  description: 'Its environments and secrets go too. You cannot undo this.',
  actionLabel: 'Delete',
  cancelLabel: 'Cancel',
  size: 'md',
  variant: 'danger-confirm',
};

function Preview({ values }: { values: Values }) {
  const [open, setOpen] = useState(false);
  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger render={<Button variant="outline" />}>
        Open the alert
      </AlertDialogTrigger>
      <AlertDialogContent size={values.size}>
        <AlertDialogHeader>
          <AlertDialogTitle>{values.title}</AlertDialogTitle>
          <AlertDialogDescription>{values.description}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>{values.cancelLabel}</AlertDialogCancel>
          <AlertDialogAction
            variant={values.variant}
            onClick={() => setOpen(false)}
          >
            {values.actionLabel}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

function code(values: Values) {
  const size = values.size === INITIAL.size ? '' : ` size="${values.size}"`;
  const variant =
    values.variant === 'default' ? '' : ` variant="${values.variant}"`;
  return `import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@omuk/ui/alert-dialog';
import { Button } from '@omuk/ui/button';

<AlertDialog open={open} onOpenChange={setOpen}>
  <AlertDialogTrigger render={<Button variant="outline" />}>
    Open the alert
  </AlertDialogTrigger>
  <AlertDialogContent${size}>
    <AlertDialogHeader>
      <AlertDialogTitle>${values.title}</AlertDialogTitle>
      <AlertDialogDescription>${values.description}</AlertDialogDescription>
    </AlertDialogHeader>
    <AlertDialogFooter>
      <AlertDialogCancel>${values.cancelLabel}</AlertDialogCancel>
      <AlertDialogAction${variant} onClick={() => setOpen(false)}>
        ${values.actionLabel}
      </AlertDialogAction>
    </AlertDialogFooter>
  </AlertDialogContent>
</AlertDialog>`;
}

export default function AlertDialogPlayground() {
  return (
    <Playground
      initial={INITIAL}
      controls={[
        { name: 'title', kind: 'text' },
        { name: 'description', kind: 'text' },
        { name: 'actionLabel', kind: 'text' },
        { name: 'cancelLabel', kind: 'text' },
        { name: 'size', kind: 'choice', options: SIZES },
        { name: 'variant', kind: 'choice', options: VARIANTS },
      ]}
      render={(values) => <Preview values={values} />}
      code={code}
    />
  );
}
