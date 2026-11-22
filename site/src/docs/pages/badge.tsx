import { DocSection, Example, Notes, PropsTable } from '../blocks';
import InContext from '../examples/badge/in-context';
import inContextSource from '../examples/badge/in-context.tsx?raw';
import Variants from '../examples/badge/variants';
import variantsSource from '../examples/badge/variants.tsx?raw';

export default function BadgePage() {
  return (
    <>
      <DocSection
        title="Variants"
        description="Most badges are neutral: the hover fill and muted text. Plan is the one with colour, for a paid feature. Destructive puts the text in the danger colour."
      >
        <Example source={variantsSource}>
          <Variants />
        </Example>
      </DocSection>
      <DocSection
        title="On a title and a row"
        description="A badge sits beside what it labels: a plan on a heading, a type or a count at the end of a row. An icon in it takes the small size."
      >
        <Example source={inContextSource}>
          <InContext />
        </Example>
      </DocSection>
      <DocSection title="Props" description="And every prop of a <span>.">
        <PropsTable
          rows={[
            {
              name: 'variant',
              type: "'default' | 'secondary' | 'plan' | 'destructive' | 'outline' | 'ghost' | 'link'",
              default: "'default'",
              description:
                'The look. secondary is the same as default; both are neutral.',
            },
            {
              name: 'render',
              type: 'ReactElement',
              description:
                'Draws the badge as this element, such as a link, with the badge’s look.',
            },
          ]}
        />
      </DocSection>
      <DocSection title="Notes">
        <Notes
          items={[
            'A badge is 20 tall and one line. Keep the text to a word or two, in sentence case.',
            'A badge is not a button. For something the person removes, use Chip; for a state that changes, such as live or failed, use Status.',
            'Do not let colour carry the meaning alone: the text must say it too.',
          ]}
        />
      </DocSection>
    </>
  );
}
