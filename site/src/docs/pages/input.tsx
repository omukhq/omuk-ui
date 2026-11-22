import { DocSection, Example, Notes, PropsTable } from '../blocks';
import WithLabel from '../examples/input/field';
import fieldSource from '../examples/input/field.tsx?raw';
import Invalid from '../examples/input/invalid';
import invalidSource from '../examples/input/invalid.tsx?raw';
import States from '../examples/input/states';
import statesSource from '../examples/input/states.tsx?raw';

export default function InputPage() {
  return (
    <>
      <DocSection
        title="With a label"
        description="A Label above, linked with htmlFor. The field is 36 tall: the same as a button, so they line up in a row."
      >
        <Example source={fieldSource}>
          <WithLabel />
        </Example>
      </DocSection>
      <DocSection
        title="Invalid"
        description="Set aria-invalid, not a class: the edge turns red, and a screen reader says the field is invalid. Link the message with aria-describedby."
      >
        <Example source={invalidSource}>
          <Invalid />
        </Example>
      </DocSection>
      <DocSection
        title="States"
        description="Disabled is a state, not a fade: the hover fill, a thin edge and muted text."
      >
        <Example source={statesSource}>
          <States />
        </Example>
      </DocSection>
      <DocSection
        title="Props"
        description="Input takes every prop of an <input>, and adds none. Its look comes from the field recipe that every field shares."
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
                'Classes added after the field’s own, for a width or a font (font-mono for a key).',
            },
          ]}
        />
      </DocSection>
      <DocSection title="Notes">
        <Notes
          items={[
            'The text is 14 at every width. An iPhone zooms in on a field below 16 when it takes the focus; the site’s viewport keeps that in check.',
            'For an icon, a prefix or a button inside the field, use Input group.',
            'For a form, put the field in a Field: it lays out the label, the hint and the error, and links them.',
          ]}
        />
      </DocSection>
    </>
  );
}
