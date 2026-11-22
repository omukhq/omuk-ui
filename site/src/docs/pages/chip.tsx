import { DocSection, Example, KeysTable, Notes, PropsTable } from '../blocks';
import Invites from '../examples/chip/invites';
import invitesSource from '../examples/chip/invites.tsx?raw';
import Tags from '../examples/chip/tags';
import tagsSource from '../examples/chip/tags.tsx?raw';

export default function ChipPage() {
  return (
    <>
      <DocSection
        title="Removable"
        description="With onRemove, the chip draws a remove button at its end. Give each one a removeLabel that names what it removes."
      >
        <Example source={invitesSource}>
          <Invites />
        </Example>
      </DocSection>
      <DocSection
        title="Fixed"
        description="Without onRemove, a chip is a plain token: a tag on a record that the person cannot change here."
      >
        <Example source={tagsSource}>
          <Tags />
        </Example>
      </DocSection>
      <DocSection title="Props" description="And every prop of a <span>.">
        <PropsTable
          rows={[
            {
              name: 'onRemove',
              type: '() => void',
              description:
                'Draws the remove button, and is called when it is pressed. The caller takes the chip away.',
            },
            {
              name: 'removeLabel',
              type: 'string',
              default: "'Remove'",
              description:
                'What a screen reader hears for the remove button, such as “Remove ada@example.com”.',
            },
          ]}
        />
      </DocSection>
      <DocSection title="Keyboard">
        <KeysTable
          rows={[
            ['Tab', 'Moves to the next remove button.'],
            ['Enter + Space', 'Presses the remove button.'],
          ]}
        />
      </DocSection>
      <DocSection title="Notes">
        <Notes
          items={[
            'A chip is 24 tall, with a small radius: it fits inside a field, and the field grows in height as the chips wrap.',
            'When a chip goes, move the focus to the next chip or to the field, so it is not lost.',
            'For a short label that is not a token, such as a status or a plan, use Badge.',
          ]}
        />
      </DocSection>
    </>
  );
}
