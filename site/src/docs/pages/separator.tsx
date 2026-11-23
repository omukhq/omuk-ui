import { DocSection, Example, Notes, PropsTable } from '../blocks';
import Horizontal from '../examples/separator/horizontal';
import horizontalSource from '../examples/separator/horizontal.tsx?raw';
import SeparatorPlayground from '../examples/separator/playground';
import Vertical from '../examples/separator/vertical';
import verticalSource from '../examples/separator/vertical.tsx?raw';

export default function SeparatorPage() {
  return (
    <>
      <DocSection
        title="Playground"
        description="Change the props on the right. The line and its code follow."
      >
        <SeparatorPlayground />
      </DocSection>
      <DocSection
        title="Across"
        description="A 1-wide line in the border colour, the full width of its box, between two groups."
      >
        <Example source={horizontalSource}>
          <Horizontal />
        </Example>
      </DocSection>
      <DocSection
        title="Down"
        description="A vertical separator stretches to the height of its row. Give the row a height, or let its tallest item set one."
      >
        <Example source={verticalSource}>
          <Vertical />
        </Example>
      </DocSection>
      <DocSection title="Props" description="And every prop of a <div>.">
        <PropsTable
          rows={[
            {
              name: 'orientation',
              type: "'horizontal' | 'vertical'",
              default: "'horizontal'",
              description:
                'Across or down. Sets aria-orientation and data-orientation.',
            },
            {
              name: 'render',
              type: 'ReactElement',
              description:
                'Draws the line as this element, such as an <hr>, with the separator’s props merged in.',
            },
          ]}
        />
      </DocSection>
      <DocSection title="Notes">
        <Notes
          items={[
            'It has role="separator", so a screen reader knows that one group ends and the next begins.',
            'Space the groups with the gap of their container: the line has no margin of its own.',
            'Use a line only where a gap alone does not split the groups. Too many lines make a page look busy.',
          ]}
        />
      </DocSection>
    </>
  );
}
