import { DocSection, Example, KeysTable, Notes, PropsTable } from '../blocks';
import Actions from '../examples/context-menu/actions';
import actionsSource from '../examples/context-menu/actions.tsx?raw';
import Choices from '../examples/context-menu/choices';
import choicesSource from '../examples/context-menu/choices.tsx?raw';
import ContextMenuPlayground from '../examples/context-menu/playground';

export default function ContextMenuPage() {
  return (
    <>
      <DocSection
        title="Playground"
        description="Change the props on the right, then right-click the area. variant is the Delete item's, disabled the Duplicate item's."
      >
        <ContextMenuPlayground />
      </DocSection>
      <DocSection
        title="Actions on a row"
        description="ContextMenuTrigger is the area that answers a right-click. The menu opens at the pointer, or under the focused area from the keyboard. A destructive item comes last, after a separator."
      >
        <Example source={actionsSource}>
          <Actions />
        </Example>
      </DocSection>
      <DocSection
        title="Choices and a submenu"
        description="The same parts as the Dropdown menu: radio items pick one value, a checkbox item turns a setting on or off, and a submenu opens to the side."
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
                'ContextMenu: whether it is open, when the parent keeps it; with onOpenChange.',
            },
            {
              name: 'render',
              type: 'ReactElement',
              description:
                'ContextMenuTrigger: the element to draw in place of its div.',
            },
            {
              name: 'side',
              type: "'top' | 'bottom' | 'left' | 'right'",
              default: "'right'",
              description:
                'ContextMenuContent: the side of the pointer it opens on. With no room there, it takes the other side.',
            },
            {
              name: 'align',
              type: "'start' | 'center' | 'end'",
              default: "'start'",
              description:
                'ContextMenuContent: how it lines up with the pointer.',
            },
            {
              name: 'variant',
              type: "'default' | 'destructive'",
              default: "'default'",
              description: 'ContextMenuItem: destructive is red, for a delete.',
            },
            {
              name: 'disabled',
              type: 'boolean',
              default: 'false',
              description:
                'ContextMenuItem: it stays in the list and in the arrow keys’ path, but does nothing.',
            },
            {
              name: 'inset',
              type: 'boolean',
              default: 'false',
              description:
                'ContextMenuItem, ContextMenuLabel, ContextMenuSubTrigger: lines the text up with items that have an icon.',
            },
            {
              name: 'checked',
              type: 'boolean',
              description:
                'ContextMenuCheckboxItem: on or off; with onCheckedChange.',
            },
            {
              name: 'value',
              type: 'string',
              description:
                'ContextMenuRadioGroup: the chosen item; with onValueChange. Each radio item has its own value.',
            },
          ]}
        />
      </DocSection>
      <DocSection title="Keyboard">
        <KeysTable
          rows={[
            [
              'Shift + F10',
              'Opens the menu under the focused area. The menu key does the same.',
            ],
            ['Arrow Down + Arrow Up', 'Moves through the items.'],
            ['Arrow Right', 'Opens a submenu.'],
            ['Arrow Left', 'Closes a submenu.'],
            ['Home + End', 'Goes to the first or the last item.'],
            ['A–Z', 'Finds the next item that starts with the letters typed.'],
            ['Enter', 'Runs the highlighted item.'],
            ['Escape', 'Closes the menu.'],
          ]}
        />
      </DocSection>
      <DocSection title="Notes">
        <Notes
          items={[
            'On a touch screen, a press of half a second opens it. A finger that moves first scrolls instead.',
            'A right-click is hard to find: put every action in the menu somewhere else too, as a button or a Dropdown menu.',
            'Give the trigger tabIndex={0} so a keyboard can reach it and open the menu.',
          ]}
        />
      </DocSection>
    </>
  );
}
