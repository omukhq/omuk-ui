import { DocSection, Example, Notes, PropsTable } from '../blocks';
import Actions from '../examples/button-group/actions';
import actionsSource from '../examples/button-group/actions.tsx?raw';
import ButtonGroupPlayground from '../examples/button-group/playground';
import Split from '../examples/button-group/split';
import splitSource from '../examples/button-group/split.tsx?raw';
import WithText from '../examples/button-group/with-text';
import withTextSource from '../examples/button-group/with-text.tsx?raw';

export default function ButtonGroupPage() {
  return (
    <>
      <DocSection
        title="Playground"
        description="Change the props on the right. The group and its code follow."
      >
        <ButtonGroupPlayground />
      </DocSection>
      <DocSection
        title="Actions that belong together"
        description="Outline buttons side by side share their edges: each one after the first moves back by the edge’s width, and only the outer corners stay round."
      >
        <Example source={actionsSource}>
          <Actions />
        </Example>
      </DocSection>
      <DocSection
        title="A split button"
        description="The main action and a menu of the other ways to do it. A separator draws the line between two filled buttons."
      >
        <Example source={splitSource}>
          <Split />
        </Example>
      </DocSection>
      <DocSection
        title="With text and a field"
        description="ButtonGroupText is a fixed part, such as a prefix or a unit. An input in the group takes the width that is left."
      >
        <Example source={withTextSource}>
          <WithText />
        </Example>
      </DocSection>
      <DocSection
        title="Props"
        description="ButtonGroup is the row; ButtonGroupText and ButtonGroupSeparator are parts that go in it. Each also takes the props of its element."
      >
        <PropsTable
          rows={[
            {
              name: 'orientation',
              type: "'horizontal' | 'vertical'",
              default: "'horizontal'",
              description:
                'ButtonGroup: side by side, or stacked with shared top and bottom edges. ButtonGroupSeparator takes it too, with vertical as its default: a vertical line splits a horizontal group.',
            },
            {
              name: 'aria-label',
              type: 'string',
              description:
                'ButtonGroup: names the group (it has role="group"), so a screen reader says what the buttons are for.',
            },
            {
              name: 'render',
              type: 'ReactElement',
              description:
                'ButtonGroupText: draws the text as this element, for example a <label> for the field next to it.',
            },
          ]}
        />
      </DocSection>
      <DocSection title="Notes">
        <Notes
          items={[
            'Each button keeps its own Tab stop and keys: the group only joins their edges.',
            'Put groups inside a group to space them apart: a group of groups gets a gap of 8 between them.',
            'For one choice out of a few, use Segmented control instead: it is one Tab stop, and the arrow keys pick.',
          ]}
        />
      </DocSection>
    </>
  );
}
