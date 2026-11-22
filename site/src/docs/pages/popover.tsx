import { DocSection, Example, KeysTable, Notes, PropsTable } from '../blocks';
import Details from '../examples/popover/details';
import detailsSource from '../examples/popover/details.tsx?raw';
import Rename from '../examples/popover/rename';
import renameSource from '../examples/popover/rename.tsx?raw';

export default function PopoverPage() {
  return (
    <>
      <DocSection
        title="More about a setting"
        description="A title, a description and a ×. The title and the description name the panel for a screen reader. The panel pads nothing itself: its content does."
      >
        <Example source={detailsSource}>
          <Details />
        </Example>
      </DocSection>
      <DocSection
        title="A small form"
        description="The focus goes to the first field when it opens. With open and onOpenChange, the form closes the popover when it is sent."
      >
        <Example source={renameSource}>
          <Rename />
        </Example>
      </DocSection>
      <DocSection title="Props">
        <PropsTable
          rows={[
            {
              name: 'open',
              type: 'boolean',
              description:
                'Popover: whether it is open, when the parent keeps it; with onOpenChange.',
            },
            {
              name: 'defaultOpen',
              type: 'boolean',
              default: 'false',
              description:
                'Popover: open at first, when it keeps its own state.',
            },
            {
              name: 'onOpenChange',
              type: '(open: boolean, details) => void',
              description:
                'Popover: called when it opens or closes, and why (a click outside, Escape, Tab out).',
            },
            {
              name: 'render',
              type: 'ReactElement',
              description: 'PopoverTrigger: the button that opens it.',
            },
            {
              name: 'side',
              type: "'top' | 'bottom' | 'left' | 'right'",
              default: "'bottom'",
              description:
                'PopoverContent: the side it opens on. With no room there, it takes the other side.',
            },
            {
              name: 'align',
              type: "'start' | 'center' | 'end'",
              default: "'center'",
              description:
                'PopoverContent: which edge of the trigger it lines up with.',
            },
            {
              name: 'sideOffset',
              type: 'number',
              default: '4',
              description: 'PopoverContent: the gap to the trigger.',
            },
            {
              name: 'initialFocus',
              type: 'boolean | RefObject<HTMLElement>',
              default: 'true',
              description:
                'PopoverContent: where the focus goes when it opens: the first control, a given element, or nowhere (false).',
            },
            {
              name: 'finalFocus',
              type: 'boolean | RefObject | (closeType) => …',
              default: 'true',
              description:
                'PopoverContent: where the focus goes when it closes; the trigger by default.',
            },
          ]}
        />
      </DocSection>
      <DocSection title="Keyboard">
        <KeysTable
          rows={[
            ['Enter + Space', 'Opens or closes it from the trigger.'],
            [
              'Tab',
              'Moves through the panel. Past the last control, it closes the popover.',
            ],
            ['Escape', 'Closes it; focus goes back to the trigger.'],
          ]}
        />
      </DocSection>
      <DocSection title="Notes">
        <Notes
          items={[
            'It is not modal: a click outside closes it, and the page behind stays usable.',
            'On a phone-sized screen, it opens as a sheet at the bottom of the window, over a scrim, with the same content.',
            'For a list of actions, use the Dropdown menu; for a short name on hover, the Tooltip.',
          ]}
        />
      </DocSection>
    </>
  );
}
