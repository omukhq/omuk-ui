import { DocSection, Example, KeysTable, Notes, PropsTable } from '../blocks';
import Line from '../examples/tabs/line';
import lineSource from '../examples/tabs/line.tsx?raw';
import TabsPlayground from '../examples/tabs/playground';
import Track from '../examples/tabs/track';
import trackSource from '../examples/tabs/track.tsx?raw';

export default function TabsPage() {
  return (
    <>
      <DocSection
        title="Playground"
        description="Change the props on the right. The tabs and their code follow."
      >
        <TabsPlayground />
      </DocSection>
      <DocSection
        title="Line tabs"
        description="The design system’s tabs: muted labels on a line, the selected one in the text colour over an accent underline. Only the colour changes, so nothing moves."
      >
        <Example source={lineSource} align="start">
          <Line />
        </Example>
      </DocSection>
      <DocSection
        title="On a track"
        description="The default variant puts the tabs on a grey track and raises the selected one. Here the parent keeps the value, and a disabled tab is muted."
      >
        <Example source={trackSource} align="start">
          <Track />
        </Example>
      </DocSection>
      <DocSection
        title="Props"
        description="Tabs is the root; TabsList holds the TabsTrigger tabs; TabsContent is the panel for one tab. Each takes every prop of its element."
      >
        <PropsTable
          rows={[
            {
              name: 'value',
              type: 'unknown',
              description:
                'Tabs: the selected tab’s value, when the parent keeps it. TabsTrigger and TabsContent: the value they stand for, required.',
            },
            {
              name: 'defaultValue',
              type: 'unknown',
              default: '0',
              description:
                'Tabs: the first selected tab, when the tabs keep their own value.',
            },
            {
              name: 'onValueChange',
              type: '(value, details) => void',
              description: 'Tabs: called with the new tab’s value.',
            },
            {
              name: 'orientation',
              type: "'horizontal' | 'vertical'",
              default: "'horizontal'",
              description:
                'Tabs: the tabs in a row or in a column. It decides which arrow keys move.',
            },
            {
              name: 'variant',
              type: "'default' | 'line'",
              default: "'default'",
              description:
                'TabsList: a grey track, or a line with an underline.',
            },
            {
              name: 'activateOnFocus',
              type: 'boolean',
              default: 'true',
              description:
                'TabsList: the arrow keys select the tab they move to. False only moves the focus.',
            },
            {
              name: 'loopFocus',
              type: 'boolean',
              default: 'true',
              description:
                'TabsList: from the last tab, the next arrow goes to the first.',
            },
            {
              name: 'disabled',
              type: 'boolean',
              default: 'false',
              description:
                'TabsTrigger: turns the tab off. The arrow keys still reach it, but do not select it.',
            },
            {
              name: 'keepMounted',
              type: 'boolean',
              default: 'false',
              description:
                'TabsContent: keeps the panel in the page, hidden, while another tab is selected.',
            },
          ]}
        />
      </DocSection>
      <DocSection title="Keyboard">
        <KeysTable
          rows={[
            [
              'Tab',
              'Moves the focus to the selected tab, then into its panel.',
            ],
            [
              'Arrow Left + Arrow Right',
              'Moves to the tab before or after, and selects it. Up and Down in vertical tabs.',
            ],
            ['Home + End', 'Goes to the first or the last tab.'],
          ]}
        />
      </DocSection>
      <DocSection title="Notes">
        <Notes
          items={[
            'Each tab names its panel and each panel its tab, so a screen reader says where the content came from.',
            'A panel that is not selected is not in the page, unless keepMounted is set: a form in it loses what was typed.',
            'Tabs switch content. For a setting with a few choices, use Segmented control.',
          ]}
        />
      </DocSection>
    </>
  );
}
