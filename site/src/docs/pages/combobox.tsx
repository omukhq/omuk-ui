import { DocSection, Example, KeysTable, Notes, PropsTable } from '../blocks';
import Basic from '../examples/combobox/basic';
import basicSource from '../examples/combobox/basic.tsx?raw';
import AsButton from '../examples/combobox/button';
import buttonSource from '../examples/combobox/button.tsx?raw';
import Multiple from '../examples/combobox/multiple';
import multipleSource from '../examples/combobox/multiple.tsx?raw';

export default function ComboboxPage() {
  return (
    <>
      <DocSection
        title="Type to filter"
        description="The list shows the items that contain the typed text, with no regard to case or accents. ComboboxList draws each item with its function. showClear adds a button that empties the field."
      >
        <Example source={basicSource}>
          <Basic />
        </Example>
      </DocSection>
      <DocSection
        title="Several values"
        description="With multiple, the value is a list and each choice is a chip in the field. A pick keeps the list open; Backspace in an empty field removes the last chip."
      >
        <Example source={multipleSource}>
          <Multiple />
        </Example>
      </DocSection>
      <DocSection
        title="A button with a search"
        description="ComboboxButton shows the value as a Select does, and a ComboboxInput inside the list is its search. Items can come in groups: each group gives its items to ComboboxCollection."
      >
        <Example source={buttonSource}>
          <AsButton />
        </Example>
      </DocSection>
      <DocSection
        title="Props"
        description="Combobox is the root and holds the state; the field, the list and the items are its parts."
      >
        <PropsTable
          rows={[
            {
              name: 'items',
              type: 'Value[] | { items: Value[] }[]',
              description:
                'Combobox. The items to filter, flat or in groups. ComboboxList and ComboboxCollection draw what is left.',
            },
            {
              name: 'value',
              type: 'Value | null (Value[] with multiple)',
              description:
                'Combobox. The chosen item, when the parent keeps it; with onValueChange. defaultValue when the combobox keeps its own.',
            },
            {
              name: 'onValueChange',
              type: '(value, details) => void',
              description:
                'Combobox. Called after a pick or a clear. details.cancel() keeps the old value.',
            },
            {
              name: 'multiple',
              type: 'boolean',
              default: 'false',
              description:
                'Combobox. Takes several values, shown as chips (ComboboxChips).',
            },
            {
              name: 'inputValue',
              type: 'string',
              description:
                'Combobox. The typed text, when the parent keeps it; with onInputValueChange. defaultInputValue otherwise.',
            },
            {
              name: 'itemToStringLabel',
              type: '(item: Value) => string',
              description:
                'Combobox. The text of an object item, for the field and the filter. Without it: item.label, then item.value.',
            },
            {
              name: 'isItemEqualToValue',
              type: '(item: Value, value: Value) => boolean',
              description:
                'Combobox. Matches an item to the value when they are different objects (an id compare).',
            },
            {
              name: 'filter',
              type: '((item, query) => boolean) | null',
              description:
                'Combobox. Which items match the typed text. null shows every item, for a list the server filters.',
            },
            {
              name: 'name',
              type: 'string',
              description:
                'Combobox. Sends the value with a form, in a hidden input (one for each value with multiple). itemToStringValue sets the text it sends.',
            },
            {
              name: 'disabled',
              type: 'boolean',
              default: 'false',
              description:
                'Combobox. Turns the whole combobox off. readOnly shows the value and does not open.',
            },
            {
              name: 'autoHighlight',
              type: 'boolean',
              default: 'false',
              description:
                'Combobox. Enter picks the first item when nothing is highlighted.',
            },
            {
              name: 'openOnInputClick',
              type: 'boolean',
              default: 'true',
              description: 'Combobox. A click in the field opens the list.',
            },
            {
              name: 'showClear',
              type: 'boolean',
              default: 'false',
              description:
                'ComboboxInput. A clear button, shown while there is a value or text. It takes the chevron’s place.',
            },
            {
              name: 'showTrigger',
              type: 'boolean',
              default: 'true',
              description:
                'ComboboxInput. The chevron that opens the list. Off by default for the search inside the list.',
            },
            {
              name: 'value (item)',
              type: 'Value',
              description:
                'ComboboxItem. The item this row picks. disabled keeps it in the list and skips it.',
            },
            {
              name: 'placeholder',
              type: 'ReactNode',
              description:
                'ComboboxValue. Shown while nothing is chosen. A function as children draws the value itself (the chips).',
            },
          ]}
        />
      </DocSection>
      <DocSection title="Keyboard">
        <KeysTable
          rows={[
            [
              'Arrow Down',
              'Opens the list on the chosen item, or the first; in the list, moves to the next item.',
            ],
            [
              'Arrow Up',
              'Opens the list on the last item; in the list, moves to the one before.',
            ],
            ['Enter', 'Picks the highlighted item.'],
            ['Escape', 'Closes the list; the field shows the value again.'],
            ['Tab', 'Closes the list and moves on.'],
            [
              'Backspace',
              'With multiple, in an empty field: removes the last chip.',
            ],
          ]}
        />
      </DocSection>
      <DocSection title="Notes">
        <Notes
          items={[
            'The focus stays in the field the whole time. The highlighted item is aria-activedescendant, so a screen reader reads it as the arrows move.',
            'Close the list without a pick and the field goes back to the chosen item’s label: typed text is never a value.',
            'For a short list that needs no search, use Select.',
          ]}
        />
      </DocSection>
    </>
  );
}
