import { DocSection, Example, KeysTable, Notes, PropsTable } from '../blocks';
import Actions from '../examples/dropdown-menu/actions';
import actionsSource from '../examples/dropdown-menu/actions.tsx?raw';
import Choices from '../examples/dropdown-menu/choices';
import choicesSource from '../examples/dropdown-menu/choices.tsx?raw';
import DropdownMenuPlayground from '../examples/dropdown-menu/playground';

export default function DropdownMenuPage() {
  return (
    <>
      <DocSection
        title="Playground"
        description="Change the props on the right, then open the menu. variant is the Delete item's, disabled the Duplicate item's."
      >
        <DropdownMenuPlayground />
      </DocSection>
      <DocSection
        title="Actions"
        description="An icon at the start of each item, a shortcut at the end. A destructive item comes last, after a separator."
      >
        <Example source={actionsSource}>
          <Actions />
        </Example>
      </DocSection>
      <DocSection
        title="Choices and a submenu"
        description="Radio items pick one value, a checkbox item turns a setting on or off. A tick marks the current value, at the start of the row."
      >
        <Example source={choicesSource}>
          <Choices />
        </Example>
      </DocSection>
      <DocSection title="Props">
        <PropsTable
          rows={[
            {
              name: 'open',
              type: 'boolean',
              description:
                'DropdownMenu: whether it is open, when the parent keeps it; with onOpenChange.',
            },
            {
              name: 'render',
              type: 'ReactElement',
              description:
                'DropdownMenuTrigger: the button that opens the menu.',
            },
            {
              name: 'align',
              type: "'start' | 'center' | 'end'",
              default: "'start'",
              description:
                'DropdownMenuContent: which edge of the trigger it lines up with.',
            },
            {
              name: 'side',
              type: "'top' | 'bottom' | 'left' | 'right'",
              default: "'bottom'",
              description:
                'DropdownMenuContent: the side it opens on. With no room there, it takes the other side.',
            },
            {
              name: 'variant',
              type: "'default' | 'destructive'",
              default: "'default'",
              description:
                'DropdownMenuItem: destructive is red, for a delete.',
            },
            {
              name: 'onClick',
              type: '(event) => void',
              description:
                'DropdownMenuItem: the action. The menu closes after it.',
            },
            {
              name: 'checked',
              type: 'boolean',
              description:
                'DropdownMenuCheckboxItem: on or off; with onCheckedChange.',
            },
            {
              name: 'value',
              type: 'string',
              description:
                'DropdownMenuRadioGroup: the chosen item; with onValueChange. Each radio item has its own value.',
            },
          ]}
        />
      </DocSection>
      <DocSection title="Keyboard">
        <KeysTable
          rows={[
            [
              'Enter',
              'Opens the menu from the trigger; runs the highlighted item.',
            ],
            ['Arrow Down + Arrow Up', 'Moves through the items.'],
            ['Arrow Right', 'Opens a submenu.'],
            ['Arrow Left', 'Closes a submenu.'],
            ['Home + End', 'Goes to the first or the last item.'],
            ['A–Z', 'Finds the next item that starts with the letters typed.'],
            ['Escape', 'Closes the menu; focus goes back to the trigger.'],
          ]}
        />
      </DocSection>
      <DocSection title="Notes">
        <Notes
          items={[
            'It opens in the browser’s top layer, as a popover: no z-index, never clipped by a scrolling parent.',
            'The Context menu is the same menu, opened where the pointer is.',
          ]}
        />
      </DocSection>
    </>
  );
}
