import { Toaster } from '@omuk/ui/sonner';
import { CodeView, DocSection, Example, Notes, PropsTable } from '../blocks';
import Action from '../examples/toast/action';
import actionSource from '../examples/toast/action.tsx?raw';
import Kinds from '../examples/toast/kinds';
import kindsSource from '../examples/toast/kinds.tsx?raw';
import ToastPlayground from '../examples/toast/playground';
import Position from '../examples/toast/position';
import positionSource from '../examples/toast/position.tsx?raw';
import { useToastPosition } from '../examples/toast/position-store';
import setupSource from '../examples/toast/setup.tsx?raw';

export default function ToastPage() {
  const position = useToastPosition();
  return (
    <>
      <DocSection
        title="Playground"
        description="Change the options on the right, then show the toast. Leave actionLabel empty for no action."
      >
        <ToastPlayground />
      </DocSection>
      <DocSection
        title="Set up"
        description="One Toaster near the root of the app. toast has the same calls as the sonner package, so code written for sonner works as it is."
      >
        <CodeView code={setupSource.trimEnd()} />
      </DocSection>
      <DocSection
        title="Position"
        description="Six places, from 640 wide up: the top or the bottom, at the left, the centre or the right. At the top the stack grows down. On a phone the toasts are always centred."
      >
        <Example source={positionSource}>
          <Position />
        </Example>
      </DocSection>
      <DocSection
        title="Kinds"
        description="An icon only where it helps: done, working, failed. An error stays until it is closed; the others leave after four seconds."
      >
        <Example source={kindsSource}>
          <Kinds />
        </Example>
      </DocSection>
      <DocSection
        title="An action, and work in progress"
        description="One action button, such as Undo. toast.promise shows a spinner while the work runs, then turns into the success or the error."
      >
        <Example source={actionSource}>
          <Action />
        </Example>
      </DocSection>
      <DocSection
        title="Options"
        description="The second argument of toast(), toast.success() and the others."
      >
        <PropsTable
          rows={[
            {
              name: 'description',
              type: 'ReactNode',
              description: 'A line under the title, in the muted colour.',
            },
            {
              name: 'action',
              type: '{ label: ReactNode; onClick: () => void }',
              description:
                'One button in the toast. A click runs it and closes the toast.',
            },
            {
              name: 'duration',
              type: 'number',
              default: '4000',
              description:
                'Milliseconds it stays. An error stays until closed.',
            },
            {
              name: 'id',
              type: 'string | number',
              description:
                'Updates the toast with this id instead of adding one: a loading toast that turns into a success.',
            },
          ]}
        />
      </DocSection>
      <DocSection title="Notes">
        <Notes
          items={[
            'Up to three in a stack, the newest at the bottom. Pointing at the stack opens it and stops the timers.',
            'Bottom right on a computer unless position says otherwise, centred on a phone, at most 384 wide and two lines.',
            'The toasts are read by a screen reader through a live region; the action and the close button are real buttons.',
          ]}
        />
      </DocSection>
      <Toaster position={position} />
    </>
  );
}
