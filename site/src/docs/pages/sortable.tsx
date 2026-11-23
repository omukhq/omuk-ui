import { DocSection, Example, KeysTable, Notes, PropsTable } from '../blocks';
import Columns from '../examples/sortable/columns';
import columnsSource from '../examples/sortable/columns.tsx?raw';
import SortablePlayground from '../examples/sortable/playground';
import Steps from '../examples/sortable/steps';
import stepsSource from '../examples/sortable/steps.tsx?raw';

export default function SortablePage() {
  return (
    <>
      <DocSection
        title="Playground"
        description="Change the props on the right. The list and its code follow."
      >
        <SortablePlayground />
      </DocSection>
      <DocSection
        title="With handles"
        description="Drag an item by its handle, or focus the handle and press Up or Down. The items it passes slide aside; on the drop, onValueChange gets the new order."
      >
        <Example source={columnsSource}>
          <Columns />
        </Example>
      </DocSection>
      <DocSection
        title="Items with more in them"
        description="An item is a row: put anything beside the handle. Here the order is a list of records, rebuilt from the values that onValueChange gives back."
      >
        <Example source={stepsSource}>
          <Steps />
        </Example>
      </DocSection>
      <DocSection
        title="Props"
        description="Sortable is the list (a <ul>); SortableItem one item in it (an <li>); SortableHandle the button that moves it."
      >
        <PropsTable
          rows={[
            {
              name: 'value',
              type: 'readonly string[]',
              description:
                'Sortable: the items’ values, in their order, when the parent keeps it. defaultValue when the list keeps its own.',
            },
            {
              name: 'onValueChange',
              type: '(order: string[]) => void',
              description:
                'Sortable: called with the new order after a drop, or after a key moved an item.',
            },
            {
              name: 'describe',
              type: '(value: string) => string',
              description:
                'Sortable: an item’s name in the announcement. The item’s label by default.',
            },
            {
              name: 'label',
              type: 'string',
              description:
                'SortableItem, required with its value: what the item is called. The handle is named “Move” and the label, and the announcement uses it too.',
            },
            {
              name: 'hint',
              type: 'string',
              default: "'Drag, or press Up or Down'",
              description: 'SortableHandle: the tooltip on the handle.',
            },
          ]}
        />
      </DocSection>
      <DocSection title="Keyboard" description="With the focus on a handle.">
        <KeysTable
          rows={[
            [
              'Arrow Up',
              'Moves the item up one place. The focus stays on its handle.',
            ],
            ['Arrow Down', 'Moves the item down one place.'],
            ['Escape', 'Ends a drag; the item goes back to where it was.'],
          ]}
        />
      </DocSection>
      <DocSection title="Notes">
        <Notes
          items={[
            'Render the items in the order of value: the list does not reorder its children by itself.',
            'A screen reader hears where the item went, such as “Email moved to position 3 of 5”. With reduced motion, nothing slides.',
            'It is for a short list in one direction: no drag between lists, no tree, and no scroll while dragging. A touch outside a handle still scrolls the page.',
          ]}
        />
      </DocSection>
    </>
  );
}
