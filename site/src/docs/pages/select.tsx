import { DocSection, Example, KeysTable, Notes, PropsTable } from '../blocks';
import Basic from '../examples/select/basic';
import basicSource from '../examples/select/basic.tsx?raw';
import Groups from '../examples/select/groups';
import groupsSource from '../examples/select/groups.tsx?raw';

export default function SelectPage() {
  return (
    <>
      <DocSection
        title="A value from a list"
        description="Give the options to items too: the trigger then shows the chosen option’s label, and typing finds an option by it."
      >
        <Example source={basicSource}>
          <Basic />
        </Example>
      </DocSection>
      <DocSection
        title="Groups"
        description="items takes groups as well, each with its own items. A label names each group; a separator splits them."
      >
        <Example source={groupsSource}>
          <Groups />
        </Example>
      </DocSection>
      <DocSection
        title="Props"
        description="Select is the root; the trigger, the list and the options are its parts."
      >
        <PropsTable
          rows={[
            {
              name: 'value',
              type: 'Value | null',
              description: 'The chosen value, when the parent keeps it.',
            },
            {
              name: 'defaultValue',
              type: 'Value | null',
              description: 'The first value, when the select keeps its own.',
            },
            {
              name: 'onValueChange',
              type: '(value: Value, details) => void',
              description: 'Called with the new value after a pick.',
            },
            {
              name: 'items',
              type: '{ value, label }[] | { items }[] | Record<string, ReactNode>',
              description:
                'The options with their labels, flat or in groups: for the trigger’s text and for type-to-find.',
            },
            {
              name: 'name',
              type: 'string',
              description: 'Sends the value with a form, in a hidden input.',
            },
            {
              name: 'disabled',
              type: 'boolean',
              default: 'false',
              description:
                'Turns the select off. required and readOnly work as on a native field.',
            },
            {
              name: 'open',
              type: 'boolean',
              description:
                'Whether the list is open, when the parent keeps it; with onOpenChange. defaultOpen when the select keeps it.',
            },
          ]}
        />
      </DocSection>
      <DocSection title="Keyboard">
        <KeysTable
          rows={[
            ['Space', 'Opens the list from the trigger.'],
            [
              'Enter',
              'Opens the list; in the list, picks the highlighted option.',
            ],
            ['Arrow Down + Arrow Up', 'Moves through the options.'],
            ['Home + End', 'Goes to the first or the last option.'],
            [
              'A–Z',
              'Finds the next option that starts with the letters typed.',
            ],
            ['Escape', 'Closes the list; focus goes back to the trigger.'],
          ]}
        />
      </DocSection>
      <DocSection title="Notes">
        <Notes
          items={[
            'The list opens over its trigger, with the chosen option where the trigger was. When there is no room, it opens below instead.',
            'It opens on a click, not on a press, and takes one value: no multiple.',
            'For a long list that people search, use Combobox.',
          ]}
        />
      </DocSection>
    </>
  );
}
