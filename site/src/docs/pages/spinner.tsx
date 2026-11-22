import { DocSection, Example, Notes, PropsTable } from '../blocks';
import Block from '../examples/spinner/block';
import blockSource from '../examples/spinner/block.tsx?raw';
import ButtonExample from '../examples/spinner/button';
import buttonSource from '../examples/spinner/button.tsx?raw';
import Inline from '../examples/spinner/inline';
import inlineSource from '../examples/spinner/inline.tsx?raw';

export default function SpinnerPage() {
  return (
    <>
      <DocSection
        title="Beside a word"
        description="On its own it is muted and 16 square. A size class makes it bigger, a text colour changes its colour. Its aria-label is what a screen reader hears."
      >
        <Example source={inlineSource}>
          <Inline />
        </Example>
      </DocSection>
      <DocSection
        title="In a button"
        description="Do not put a Spinner in a button by hand: give the Button isLoading. The label stays in the layout, hidden, and the spinner sits over it, so the button keeps its size."
      >
        <Example source={buttonSource}>
          <ButtonExample />
        </Example>
      </DocSection>
      <DocSection
        title="In a block"
        description="The block keeps the height of what will come, and the spinner sits in its middle. When the shape of the content is known, a Skeleton is better."
      >
        <Example source={blockSource}>
          <Block />
        </Example>
      </DocSection>
      <DocSection title="Props">
        <PropsTable
          rows={[
            {
              name: 'aria-label',
              type: 'string',
              default: "'Loading'",
              description: 'What a screen reader hears. Name the work.',
            },
            {
              name: 'className',
              type: 'string',
              default: "'size-4 text-muted'",
              description:
                'The size and the colour: it draws in the current text colour.',
            },
          ]}
        />
      </DocSection>
      <DocSection title="Notes">
        <Notes
          items={[
            'It is an SVG with role="status", so a screen reader says its label when it shows.',
            'It moves with SVG animation and needs no CSS keyframes.',
            'A spinner is never the accent colour: accent means picked or a link.',
          ]}
        />
      </DocSection>
    </>
  );
}
