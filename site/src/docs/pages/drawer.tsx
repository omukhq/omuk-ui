import { DocSection, Example, KeysTable, Notes, PropsTable } from '../blocks';
import Directions from '../examples/drawer/directions';
import directionsSource from '../examples/drawer/directions.tsx?raw';
import Edit from '../examples/drawer/edit';
import editSource from '../examples/drawer/edit.tsx?raw';
import DrawerPlayground from '../examples/drawer/playground';

export default function DrawerPage() {
  return (
    <>
      <DocSection
        title="Playground"
        description="Change the props on the right, then open the drawer."
      >
        <DrawerPlayground />
      </DocSection>
      <DocSection
        title="A form in a drawer"
        description="The header and the footer stay in place, and the fields between them scroll. Save closes the drawer from state; DrawerClose closes it with no change."
      >
        <Example source={editSource}>
          <Edit />
        </Example>
      </DocSection>
      <DocSection
        title="Four edges"
        description="direction picks the edge. A side drawer is three quarters of the width, up to a limit; a top or a bottom one is the full width, up to four fifths of the height."
      >
        <Example source={directionsSource}>
          <Directions />
        </Example>
      </DocSection>
      <DocSection title="Props">
        <PropsTable
          rows={[
            {
              name: 'direction',
              type: "'left' | 'right' | 'top' | 'bottom'",
              default: "'right'",
              description: 'Drawer: the edge it slides in from.',
            },
            {
              name: 'open',
              type: 'boolean',
              description:
                'Drawer: whether it is open, when the parent keeps it; with onOpenChange.',
            },
            {
              name: 'defaultOpen',
              type: 'boolean',
              default: 'false',
              description:
                'Drawer: open at first, when it keeps its own state.',
            },
            {
              name: 'onOpenChange',
              type: '(open: boolean, details) => void',
              description:
                'Drawer: called when it opens or closes, and why. A swipe gives the reason "swipe".',
            },
            {
              name: 'disablePointerDismissal',
              type: 'boolean',
              default: 'false',
              description: 'Drawer: a click on the backdrop does not close it.',
            },
            {
              name: 'render',
              type: 'ReactElement',
              description:
                'DrawerTrigger and DrawerClose: the element to draw, usually a Button.',
            },
            {
              name: 'initialFocus',
              type: 'unknown',
              description:
                'DrawerContent: when set, the drawer does not move the focus to its panel, and the browser focuses the first field.',
            },
          ]}
        />
      </DocSection>
      <DocSection title="Keyboard">
        <KeysTable
          rows={[
            ['Escape', 'Closes the drawer; focus goes back to the trigger.'],
            [
              'Tab',
              'Moves through the drawer’s controls, and stays inside it.',
            ],
          ]}
        />
      </DocSection>
      <DocSection title="Notes">
        <Notes
          items={[
            'When it opens, the focus goes to the panel, not to the first field, so a phone does not open its keyboard at once.',
            'On a touch screen, a swipe toward the edge closes a left or a right drawer. A top or a bottom drawer leaves the drag to its content.',
            'To open a drawer from a handler, with no open state, use Prompt with type: "drawer".',
          ]}
        />
      </DocSection>
    </>
  );
}
