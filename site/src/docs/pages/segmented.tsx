import { DocSection, Example, KeysTable, Notes, PropsTable } from '../blocks';
import Period from '../examples/segmented/period';
import periodSource from '../examples/segmented/period.tsx?raw';
import View from '../examples/segmented/view';
import viewSource from '../examples/segmented/view.tsx?raw';

export default function SegmentedPage() {
  return (
    <>
      <DocSection
        title="A view"
        description="The chosen segment is raised; the others sit on the track. Keep the value in the parent with value and onValueChange."
      >
        <Example source={viewSource}>
          <View />
        </Example>
      </DocSection>
      <DocSection
        title="Its own value"
        description="With defaultValue, the control keeps its value itself. A disabled segment is muted and the arrow keys pass it."
      >
        <Example source={periodSource}>
          <Period />
        </Example>
      </DocSection>
      <DocSection
        title="Props"
        description="Segmented is the track; SegmentedItem is one segment in it. Each also takes the props of its element."
      >
        <PropsTable
          rows={[
            {
              name: 'value',
              type: 'string | null',
              description:
                'Segmented: the chosen segment’s value, when the parent keeps it.',
            },
            {
              name: 'defaultValue',
              type: 'string | null',
              default: 'null',
              description:
                'Segmented: the first value, when the control keeps its own.',
            },
            {
              name: 'onValueChange',
              type: '(value: string) => void',
              description:
                'Segmented: called with the new value. Not called when the chosen segment is pressed again.',
            },
            {
              name: 'aria-label',
              type: 'string',
              description:
                'Segmented: names the control (it is a radio group), such as “View” or “Period”.',
            },
          ]}
        />
        <PropsTable
          rows={[
            {
              name: 'value',
              type: 'string',
              description: 'SegmentedItem: the value this segment stands for.',
            },
            {
              name: 'disabled',
              type: 'boolean',
              default: 'false',
              description:
                'SegmentedItem: turns the segment off. It shows muted, never faded.',
            },
          ]}
        />
      </DocSection>
      <DocSection title="Keyboard">
        <KeysTable
          rows={[
            ['Tab', 'Moves the focus to the chosen segment, and out again.'],
            [
              'Arrow Right + Arrow Down',
              'Moves to the next segment and picks it; from the last, goes to the first.',
            ],
            [
              'Arrow Left + Arrow Up',
              'Moves to the previous segment and picks it; from the first, goes to the last.',
            ],
          ]}
        />
      </DocSection>
      <DocSection title="Notes">
        <Notes
          items={[
            'To a screen reader, it is a radio group: one Tab stop, and each segment says whether it is chosen.',
            'Use it for a setting with two to five choices: a view, a period, a theme. For more, use Select.',
            'To switch between panels of content, use Tabs: they link each tab to its panel.',
          ]}
        />
      </DocSection>
    </>
  );
}
