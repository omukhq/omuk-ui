import { DocSection, Example, Notes, PropsTable } from '../blocks';
import Card from '../examples/skeleton/card';
import cardSource from '../examples/skeleton/card.tsx?raw';
import List from '../examples/skeleton/list';
import listSource from '../examples/skeleton/list.tsx?raw';
import SkeletonPlayground from '../examples/skeleton/playground';

export default function SkeletonPage() {
  return (
    <>
      <DocSection
        title="Playground"
        description="Change the props on the right. The bar and its code follow."
      >
        <SkeletonPlayground />
      </DocSection>
      <DocSection
        title="A card while it loads"
        description="Press Reload. Each bar has the size of the text it stands for: h-5 for a line of small text, h-4 for extra small. The card keeps its size, so nothing below it moves when the content comes."
      >
        <Example source={cardSource}>
          <Card />
        </Example>
      </DocSection>
      <DocSection
        title="Rows while they load"
        description="A row keeps its final height, and the bars change width from row to row. Show about as many rows as the page will hold."
      >
        <Example source={listSource}>
          <List />
        </Example>
      </DocSection>
      <DocSection title="Props">
        <PropsTable
          rows={[
            {
              name: 'className',
              type: 'string',
              description:
                'The bar’s size and shape: a height and a width, rounded-full for a circle.',
            },
          ]}
        />
      </DocSection>
      <DocSection title="Notes">
        <Notes
          items={[
            'A bar takes its place at once but shows only after 300 ms, so a fast load never flashes it.',
            'It does not shimmer: a still bar is calmer, and it does not draw the eye.',
            'A skeleton says nothing to a screen reader. Put aria-busy on the area that loads, and a label that names the work.',
          ]}
        />
      </DocSection>
    </>
  );
}
