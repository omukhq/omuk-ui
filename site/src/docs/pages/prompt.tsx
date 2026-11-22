import {
  CodeView,
  DocSection,
  Example,
  KeysTable,
  Notes,
  PropsTable,
} from '../blocks';
import Action from '../examples/prompt/action';
import actionSource from '../examples/prompt/action.tsx?raw';
import Alert from '../examples/prompt/alert';
import alertSource from '../examples/prompt/alert.tsx?raw';
import Drawer from '../examples/prompt/drawer';
import drawerSource from '../examples/prompt/drawer.tsx?raw';
import Modal from '../examples/prompt/modal';
import modalSource from '../examples/prompt/modal.tsx?raw';
import setupSource from '../examples/prompt/setup.tsx?raw';

export default function PromptPage() {
  return (
    <>
      <DocSection
        title="Set up"
        description="Put one PromptProvider in the app. Then any handler opens a prompt with usePrompt, or with prompt outside a component. No open state in the caller."
      >
        <CodeView code={setupSource.trimEnd()} />
      </DocSection>
      <DocSection
        title="An alert"
        description="open gives true for the action, false for Cancel, Escape or a click outside."
      >
        <Example source={alertSource}>
          <Alert />
        </Example>
      </DocSection>
      <DocSection
        title="An action that runs in the alert"
        description="With onAction, the alert stays open while the work runs: its button keeps its size and shows a spinner. If the work throws, the message shows in the alert, and the person can try again. Press Delete twice: the first try fails."
      >
        <Example source={actionSource}>
          <Action />
        </Example>
      </DocSection>
      <DocSection
        title="A form in a dialog"
        description="type: 'modal' takes any content. close(value) closes it, and open gives that value; Escape gives null."
      >
        <Example source={modalSource}>
          <Modal />
        </Example>
      </DocSection>
      <DocSection
        title="A drawer"
        description="type: 'drawer' slides in from an edge: right by default, or left, top, bottom."
      >
        <Example source={drawerSource}>
          <Drawer />
        </Example>
      </DocSection>
      <DocSection title="Options">
        <PropsTable
          rows={[
            {
              name: 'type',
              type: "'alert' | 'modal' | 'drawer'",
              description:
                'A question with two answers, or a dialog or a drawer with any content.',
            },
            {
              name: 'title',
              type: 'ReactNode',
              description:
                'The heading; the dialog’s name for a screen reader.',
            },
            {
              name: 'description',
              type: 'ReactNode',
              description: 'One or two sentences under the title.',
            },
            {
              name: 'actionLabel',
              type: 'ReactNode',
              description: 'Alert only: the action button’s label.',
            },
            {
              name: 'cancelLabel',
              type: 'ReactNode',
              default: "'Cancel'",
              description: 'Alert only: the other button’s label.',
            },
            {
              name: 'destructive',
              type: 'boolean',
              default: 'false',
              description:
                'Alert only: the action is the filled danger button, for the last step of a delete.',
            },
            {
              name: 'onAction',
              type: '() => Promise<unknown>',
              description:
                'Alert only: runs in the alert. It resolves: the alert closes with true. It throws: the alert stays open with the message.',
            },
            {
              name: 'loadingLabel',
              type: 'string',
              default: "'Working'",
              description:
                'Alert only: what a screen reader hears while onAction runs.',
            },
            {
              name: 'content',
              type: '(close: (result?) => void) => ReactNode',
              description:
                'Modal and drawer: the body. close(result) closes it and gives the result.',
            },
            {
              name: 'direction',
              type: "'left' | 'right' | 'top' | 'bottom'",
              default: "'right'",
              description: 'Drawer only: the edge it comes from.',
            },
          ]}
        />
      </DocSection>
      <DocSection title="Keyboard">
        <KeysTable
          rows={[
            [
              'Escape',
              'Closes the top prompt: false for an alert, null for a modal or a drawer.',
            ],
            [
              'Tab',
              'Moves through the prompt’s controls, and stays inside it.',
            ],
          ]}
        />
      </DocSection>
      <DocSection title="Notes">
        <Notes
          items={[
            'An alert’s focus starts on the safe answer, Cancel.',
            'Prompts stack: a prompt can open another, and Escape closes the top one only.',
            'prompt.closeAll() closes every open prompt, after a sign-out say.',
          ]}
        />
      </DocSection>
    </>
  );
}
