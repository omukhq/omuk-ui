import { DocSection, Example, KeysTable, Notes, PropsTable } from '../blocks';
import Basic from '../examples/switch/basic';
import basicSource from '../examples/switch/basic.tsx?raw';
import SwitchPlayground from '../examples/switch/playground';
import Settings from '../examples/switch/settings';
import settingsSource from '../examples/switch/settings.tsx?raw';
import States from '../examples/switch/states';
import statesSource from '../examples/switch/states.tsx?raw';

export default function SwitchPage() {
  return (
    <>
      <DocSection
        title="Playground"
        description="Change the props on the right. The switch and its code follow."
      >
        <SwitchPlayground />
      </DocSection>
      <DocSection
        title="With a label"
        description="A switch acts at once: save the change in onCheckedChange, with no Save button. Off, it looks like an empty checkbox; on, the knob grows, slides and shows a tick."
      >
        <Example source={basicSource}>
          <Basic />
        </Example>
      </DocSection>
      <DocSection
        title="A list of settings"
        description="In a horizontal Field, the title and the description come first and the switch sits at the end of the row."
      >
        <Example source={settingsSource}>
          <Settings />
        </Example>
      </DocSection>
      <DocSection
        title="Sizes and states"
        description="The default track is 44 by 24; sm is 36 by 20, for a row in a table. Disabled has the hover fill, a thin edge and a pale knob, and a Label after it turns muted."
      >
        <Example source={statesSource}>
          <States />
        </Example>
      </DocSection>
      <DocSection title="Props" description="And every prop of a <button>.">
        <PropsTable
          rows={[
            {
              name: 'checked',
              type: 'boolean',
              description:
                'Whether the switch is on, when the parent keeps it; with onCheckedChange.',
            },
            {
              name: 'defaultChecked',
              type: 'boolean',
              default: 'false',
              description:
                'Whether it starts on, when the switch keeps its own.',
            },
            {
              name: 'onCheckedChange',
              type: '(checked: boolean, details) => void',
              description: 'Called with the new state after a press.',
            },
            {
              name: 'size',
              type: "'sm' | 'md'",
              default: "'md'",
              description: 'The track: 44 by 24, or 36 by 20.',
            },
            {
              name: 'disabled',
              type: 'boolean',
              default: 'false',
              description: 'Turns the switch off, with the disabled look.',
            },
            {
              name: 'readOnly',
              type: 'boolean',
              default: 'false',
              description: 'Shows the state, and a press does not change it.',
            },
            {
              name: 'name',
              type: 'string',
              description:
                'Sends the switch with a form, in a hidden native checkbox. value sets what it sends while on (the default is "on").',
            },
            {
              name: 'render',
              type: 'ReactElement',
              description:
                'Draws the switch as this element, with the switch’s props merged in.',
            },
          ]}
        />
      </DocSection>
      <DocSection title="Keyboard">
        <KeysTable
          rows={[
            ['Space', 'Turns the switch on or off.'],
            ['Enter', 'Turns the switch on or off.'],
          ]}
        />
      </DocSection>
      <DocSection title="Notes">
        <Notes
          items={[
            'Use a switch only for a change that happens at once. In a form with a Save button, use a Checkbox.',
            'Name the setting, not the state: “Lock production”, not “On”. The switch itself tells a screen reader on or off.',
            'While the change saves, keep the switch in its new state. On a failure, set it back and say why.',
          ]}
        />
      </DocSection>
    </>
  );
}
