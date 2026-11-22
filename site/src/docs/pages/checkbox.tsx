import { DocSection, Example, KeysTable, Notes, PropsTable } from '../blocks';
import Basic from '../examples/checkbox/basic';
import basicSource from '../examples/checkbox/basic.tsx?raw';
import WithDescription from '../examples/checkbox/description';
import descriptionSource from '../examples/checkbox/description.tsx?raw';
import Indeterminate from '../examples/checkbox/indeterminate';
import indeterminateSource from '../examples/checkbox/indeterminate.tsx?raw';
import States from '../examples/checkbox/states';
import statesSource from '../examples/checkbox/states.tsx?raw';

export default function CheckboxPage() {
  return (
    <>
      <DocSection
        title="With a label"
        description="A Label after the box, linked with htmlFor: a press on the label toggles the box too. The box’s own target reaches past its edge, so a small box is still easy to hit."
      >
        <Example source={basicSource}>
          <Basic />
        </Example>
      </DocSection>
      <DocSection
        title="With a description"
        description="In a horizontal Field, the box sits on the first line of its label, and the description runs below."
      >
        <Example source={descriptionSource}>
          <WithDescription />
        </Example>
      </DocSection>
      <DocSection
        title="Partly on"
        description="indeterminate draws a dash for a box over a group when only some of the group are on. Work it out from the group on each render; a press on it then turns them all off or on."
      >
        <Example source={indeterminateSource}>
          <Indeterminate />
        </Example>
      </DocSection>
      <DocSection
        title="States"
        description="Disabled has the hover fill and a thin edge, and a Label after it turns muted. aria-invalid gives the box a red edge."
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
                'Whether the box is on, when the parent keeps it; with onCheckedChange.',
            },
            {
              name: 'defaultChecked',
              type: 'boolean',
              default: 'false',
              description: 'Whether it starts on, when the box keeps its own.',
            },
            {
              name: 'onCheckedChange',
              type: '(checked: boolean, details) => void',
              description: 'Called with the new state after a press.',
            },
            {
              name: 'indeterminate',
              type: 'boolean',
              default: 'false',
              description:
                'Neither on nor off: a dash, and aria-checked="mixed". It wins over checked.',
            },
            {
              name: 'disabled',
              type: 'boolean',
              default: 'false',
              description: 'Turns the box off, with the disabled look.',
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
                'Sends the box with a form, in a hidden native checkbox. Without it, no input is drawn.',
            },
            {
              name: 'value',
              type: 'string',
              default: "'on'",
              description: 'What the form sends while the box is on.',
            },
            {
              name: 'required',
              type: 'boolean',
              default: 'false',
              description:
                'The form does not send until the box is on. Needs name.',
            },
            {
              name: 'render',
              type: 'ReactElement',
              description:
                'Draws the box as this element, with the box’s props merged in.',
            },
          ]}
        />
      </DocSection>
      <DocSection title="Keyboard">
        <KeysTable rows={[['Space', 'Turns the box on or off.']]} />
      </DocSection>
      <DocSection title="Notes">
        <Notes
          items={[
            'Enter does not toggle a checkbox, as the WAI-ARIA pattern asks; Space does.',
            'The box is a <button role="checkbox">, so a click event works as on any button. Read the state from onCheckedChange, not from the event.',
            'For a setting that takes effect at once, with no Save button, use Switch.',
          ]}
        />
      </DocSection>
    </>
  );
}
