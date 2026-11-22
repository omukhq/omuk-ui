import { DocSection, Example, KeysTable, Notes, PropsTable } from '../blocks';
import Basic from '../examples/radio-group/basic';
import basicSource from '../examples/radio-group/basic.tsx?raw';
import WithDescription from '../examples/radio-group/description';
import descriptionSource from '../examples/radio-group/description.tsx?raw';
import Horizontal from '../examples/radio-group/horizontal';
import horizontalSource from '../examples/radio-group/horizontal.tsx?raw';

export default function RadioGroupPage() {
  return (
    <>
      <DocSection
        title="One choice"
        description="Each RadioGroupItem has a value and a Label linked with htmlFor. Name the group with aria-labelledby or aria-label. Tab to the group, then use the arrow keys."
      >
        <Example source={basicSource}>
          <Basic />
        </Example>
      </DocSection>
      <DocSection
        title="With descriptions"
        description="A horizontal Field for each choice puts the radio on the first line of its label, with the description below. A disabled choice stays in view and is skipped by the arrow keys."
      >
        <Example source={descriptionSource}>
          <WithDescription />
        </Example>
      </DocSection>
      <DocSection
        title="In a row"
        description="The group is a grid with gap 3. A flex class lays short choices out in a row; the arrow keys work the same."
      >
        <Example source={horizontalSource}>
          <Horizontal />
        </Example>
      </DocSection>
      <DocSection
        title="Props"
        description="RadioGroup is the root and takes the props of a <div>; RadioGroupItem takes the props of a <button>."
      >
        <PropsTable
          rows={[
            {
              name: 'value',
              type: 'string | null',
              description:
                'RadioGroup. The picked value, when the parent keeps it; with onValueChange.',
            },
            {
              name: 'defaultValue',
              type: 'string | null',
              default: 'null',
              description:
                'RadioGroup. The first value, when the group keeps its own.',
            },
            {
              name: 'onValueChange',
              type: '(value: string) => void',
              description:
                'RadioGroup. Called with the new value. Not called when the picked radio is pressed again.',
            },
            {
              name: 'name',
              type: 'string',
              description:
                'RadioGroup. Sends the value with a form, in a hidden input.',
            },
            {
              name: 'disabled',
              type: 'boolean',
              default: 'false',
              description: 'RadioGroup. Turns every radio in the group off.',
            },
            {
              name: 'value (item)',
              type: 'string',
              description:
                'RadioGroupItem. The value this radio picks. Required.',
            },
            {
              name: 'disabled (item)',
              type: 'boolean',
              default: 'false',
              description: 'RadioGroupItem. Turns this one radio off.',
            },
          ]}
        />
      </DocSection>
      <DocSection title="Keyboard">
        <KeysTable
          rows={[
            [
              'Tab',
              'Moves into the group, to the picked radio, and out again.',
            ],
            [
              'Arrow Down + Arrow Right',
              'Moves to the next radio and picks it; from the last, goes round to the first.',
            ],
            [
              'Arrow Up + Arrow Left',
              'Moves to the radio before and picks it.',
            ],
            ['Space', 'Picks the radio that has the focus.'],
          ]}
        />
      </DocSection>
      <DocSection title="Notes">
        <Notes
          items={[
            'The group is one stop in the Tab order: the arrow keys move inside it. While nothing is picked, Tab stops at each radio.',
            'A radio cannot be turned off again. Add a “None” choice when no choice is a valid answer.',
            'For two to five short choices in a toolbar, Segmented is smaller and works the same way.',
          ]}
        />
      </DocSection>
    </>
  );
}
