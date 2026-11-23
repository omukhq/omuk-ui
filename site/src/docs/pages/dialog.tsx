import { DocSection, Example, KeysTable, Notes, PropsTable } from '../blocks';
import Basic from '../examples/dialog/basic';
import basicSource from '../examples/dialog/basic.tsx?raw';
import Controlled from '../examples/dialog/controlled';
import controlledSource from '../examples/dialog/controlled.tsx?raw';
import DialogPlayground from '../examples/dialog/playground';

export default function DialogPage() {
  return (
    <>
      <DocSection
        title="Playground"
        description="Change the props on the right, then open the dialog."
      >
        <DialogPlayground />
      </DocSection>
      <DocSection
        title="With a trigger"
        description="The trigger opens it, DialogClose or Escape closes it, and focus goes back to the trigger. render draws the trigger and the close as Buttons."
      >
        <Example source={basicSource}>
          <Basic />
        </Example>
      </DocSection>
      <DocSection
        title="Open from state"
        description="With open and onOpenChange, the parent decides. For a dialog opened from code and answered with a value, Prompt is shorter."
      >
        <Example source={controlledSource}>
          <Controlled />
        </Example>
      </DocSection>
      <DocSection title="Props">
        <PropsTable
          rows={[
            {
              name: 'open',
              type: 'boolean',
              description: 'Whether it is open, when the parent keeps it.',
            },
            {
              name: 'defaultOpen',
              type: 'boolean',
              default: 'false',
              description:
                'Open at first, when the dialog keeps its own state.',
            },
            {
              name: 'onOpenChange',
              type: '(open: boolean, details) => void',
              description: 'Called when it opens or closes, and why.',
            },
            {
              name: 'disablePointerDismissal',
              type: 'boolean',
              default: 'false',
              description: 'A click on the backdrop does not close it.',
            },
            {
              name: 'showCloseButton',
              type: 'boolean',
              default: 'true',
              description: 'DialogContent: the × in the corner.',
            },
          ]}
        />
      </DocSection>
      <DocSection title="Keyboard">
        <KeysTable
          rows={[
            ['Escape', 'Closes the dialog.'],
            [
              'Tab',
              'Moves through the dialog’s controls, and stays inside it.',
            ],
          ]}
        />
      </DocSection>
      <DocSection title="Notes">
        <Notes
          items={[
            'It is the browser’s own <dialog>, opened with showModal(): it sits in the top layer, so no z-index is needed.',
            'The title names the dialog for a screen reader; the description is read after it.',
            'Use Prompt for a question or a form opened from a handler, and Alert dialog for a delete.',
          ]}
        />
      </DocSection>
    </>
  );
}
