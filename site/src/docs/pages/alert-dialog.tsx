import { DocSection, Example, KeysTable, Notes, PropsTable } from '../blocks';
import Delete from '../examples/alert-dialog/delete';
import deleteSource from '../examples/alert-dialog/delete.tsx?raw';
import Discard from '../examples/alert-dialog/discard';
import discardSource from '../examples/alert-dialog/discard.tsx?raw';
import AlertDialogPlayground from '../examples/alert-dialog/playground';

export default function AlertDialogPage() {
  return (
    <>
      <DocSection
        title="Playground"
        description="Change the props on the right, then open the alert. variant is the action button's."
      >
        <AlertDialogPlayground />
      </DocSection>
      <DocSection
        title="A delete"
        description="The safe answer comes first and takes the focus. The action is a Button: while the work runs, it shows a spinner and keeps its size, and the parent closes the dialog when the work is done."
      >
        <Example source={deleteSource}>
          <Delete />
        </Example>
      </DocSection>
      <DocSection
        title="Small, with an icon"
        description="size: 'sm' is a narrow dialog whose two buttons share the width. AlertDialogMedia holds an icon above the title."
      >
        <Example source={discardSource}>
          <Discard />
        </Example>
      </DocSection>
      <DocSection title="Props">
        <PropsTable
          rows={[
            {
              name: 'open',
              type: 'boolean',
              description:
                'AlertDialog: whether it is open, when the parent keeps it; with onOpenChange.',
            },
            {
              name: 'defaultOpen',
              type: 'boolean',
              default: 'false',
              description:
                'AlertDialog: open at first, when it keeps its own state.',
            },
            {
              name: 'onOpenChange',
              type: '(open: boolean, details) => void',
              description:
                'AlertDialog: called when it opens or closes, and why.',
            },
            {
              name: 'render',
              type: 'ReactElement',
              description:
                'AlertDialogTrigger: the element that opens it, usually a Button.',
            },
            {
              name: 'size',
              type: "'default' | 'sm'",
              default: "'default'",
              description:
                'AlertDialogContent: sm is narrow, and its footer puts the two buttons side by side.',
            },
            {
              name: 'variant',
              type: 'Button variant',
              default: "'outline'",
              description:
                'AlertDialogCancel: the look of the button that closes it. AlertDialogAction takes any Button prop, with the default variant.',
            },
            {
              name: 'isLoading',
              type: 'boolean',
              default: 'false',
              description:
                'AlertDialogAction: a spinner over the hidden label, at the same size; with loadingLabel for a screen reader.',
            },
          ]}
        />
      </DocSection>
      <DocSection title="Keyboard">
        <KeysTable
          rows={[
            ['Escape', 'Closes the dialog, as Cancel does.'],
            ['Tab', 'Moves between the answers, and stays inside the dialog.'],
            ['Enter + Space', 'Presses the focused answer.'],
          ]}
        />
      </DocSection>
      <DocSection title="Notes">
        <Notes
          items={[
            'A click on the backdrop does not close an alert dialog: the person must answer.',
            'AlertDialogAction does not close the dialog by itself. Close it from its onClick when the work is done, or use AlertDialogCancel for an answer that only closes.',
            'In an app, open a confirmation with Prompt: type: "alert" with onAction keeps the dialog open while the work runs and shows a failure in it.',
          ]}
        />
      </DocSection>
    </>
  );
}
