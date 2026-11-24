import { DocSection, Example, KeysTable, Notes, PropsTable } from '../blocks';
import Basic from '../examples/checkbox-group/basic';
import basicSource from '../examples/checkbox-group/basic.tsx?raw';
import Parent from '../examples/checkbox-group/parent';
import parentSource from '../examples/checkbox-group/parent.tsx?raw';
import CheckboxGroupPlayground from '../examples/checkbox-group/playground';

export default function CheckboxGroupPage() {
  return (
    <>
      <DocSection
        title="Playground"
        description="Change the props on the right. The group and its code follow."
      >
        <CheckboxGroupPlayground />
      </DocSection>
      <DocSection
        title="Several choices"
        description="Each Checkbox in the group has a value; the group's value is the list of the checked ones. Name the group with aria-labelledby or aria-label."
      >
        <Example source={basicSource}>
          <Basic />
        </Example>
      </DocSection>
      <DocSection
        title="Check them all"
        description="Give the group allValues and add a Checkbox with parent. It is checked when every value is, shows a dash when only some are, and a click checks them all, or clears them."
      >
        <Example source={parentSource}>
          <Parent />
        </Example>
      </DocSection>
      <DocSection
        title="Props"
        description="CheckboxGroup takes every prop of a <div> as well. A Checkbox in it takes value and parent."
      >
        <PropsTable
          rows={[
            {
              name: 'value',
              type: 'string[]',
              description:
                'CheckboxGroup. The checked values, when the parent keeps them; with onValueChange.',
            },
            {
              name: 'defaultValue',
              type: 'string[]',
              default: '[]',
              description:
                'CheckboxGroup. The checked values at first, when the group keeps them.',
            },
            {
              name: 'onValueChange',
              type: '(value: string[]) => void',
              description:
                'CheckboxGroup. Runs with the new list on each change.',
            },
            {
              name: 'allValues',
              type: 'string[]',
              default: '[]',
              description:
                'CheckboxGroup. Every value a parent checkbox checks and clears.',
            },
            {
              name: 'disabled',
              type: 'boolean',
              default: 'false',
              description: 'CheckboxGroup. Turns every box in the group off.',
            },
            {
              name: 'name',
              type: 'string',
              description:
                'CheckboxGroup. The form field’s name: each checked box sends its value under it.',
            },
            {
              name: 'value',
              type: 'string',
              description:
                'Checkbox. The value this box stands for; the group checks it when the value is in its list.',
            },
            {
              name: 'parent',
              type: 'boolean',
              default: 'false',
              description:
                'Checkbox. The box that checks or clears every value in allValues. It sends nothing in a form.',
            },
          ]}
        />
      </DocSection>
      <DocSection title="Keyboard">
        <KeysTable
          rows={[
            ['Tab', 'Moves to the next box in the group.'],
            ['Space', 'Checks or clears the box.'],
          ]}
        />
      </DocSection>
      <DocSection title="Notes">
        <Notes
          items={[
            'It has role="group", so a screen reader names the boxes together. A parent box reads as mixed while only some are checked.',
            'Each box is a plain Checkbox: its label, its disabled state and its look work as on the Checkbox page.',
            'Use a radio group when only one choice can be on.',
          ]}
        />
      </DocSection>
    </>
  );
}
