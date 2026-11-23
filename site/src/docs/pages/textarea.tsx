import { DocSection, Example, Notes, PropsTable } from '../blocks';
import Basic from '../examples/textarea/basic';
import basicSource from '../examples/textarea/basic.tsx?raw';
import Invalid from '../examples/textarea/invalid';
import invalidSource from '../examples/textarea/invalid.tsx?raw';
import TextareaPlayground from '../examples/textarea/playground';
import States from '../examples/textarea/states';
import statesSource from '../examples/textarea/states.tsx?raw';

export default function TextareaPage() {
  return (
    <>
      <DocSection
        title="Playground"
        description="Change the props on the right. The textarea and its code follow."
      >
        <TextareaPlayground />
      </DocSection>
      <DocSection
        title="With a label"
        description="It starts 64 tall, about two lines, and grows with its text, down and never sideways. Add a line to see it grow."
      >
        <Example source={basicSource}>
          <Basic />
        </Example>
      </DocSection>
      <DocSection
        title="Invalid"
        description="Set aria-invalid, as on an input: the edge turns red. Link the hint with aria-describedby, so a screen reader reads the count too."
      >
        <Example source={invalidSource}>
          <Invalid />
        </Example>
      </DocSection>
      <DocSection
        title="States"
        description="A long line with no space in it, such as a key, wraps at any character and keeps the field in its container. Disabled has the hover fill and muted text."
      >
        <Example source={statesSource}>
          <States />
        </Example>
      </DocSection>
      <DocSection
        title="Props"
        description="Textarea takes every prop of a <textarea>, and adds none."
      >
        <PropsTable
          rows={[
            {
              name: 'aria-invalid',
              type: "boolean | 'true' | 'false'",
              description: 'Marks the value as wrong: the edge turns red.',
            },
            {
              name: 'disabled',
              type: 'boolean',
              default: 'false',
              description: 'Turns the field off, with the disabled look.',
            },
            {
              name: 'className',
              type: 'string',
              description:
                'Classes added after the field’s own: a taller start (min-h-32), a cap on the growth (max-h-64), or font-mono.',
            },
          ]}
        />
      </DocSection>
      <DocSection title="Notes">
        <Notes
          items={[
            'The field grows with field-sizing: content. A browser without it keeps the start height and scrolls.',
            'Set a max-h class when the text can be long, so the field stops growing and scrolls inside.',
            'For a count or a button inside the field’s edge, use an InputGroupTextarea in a stacked Input group.',
          ]}
        />
      </DocSection>
    </>
  );
}
