import { DocSection, Example, Notes, PropsTable } from '../blocks';
import Basic from '../examples/label/basic';
import basicSource from '../examples/label/basic.tsx?raw';
import WithControl from '../examples/label/control';
import controlSource from '../examples/label/control.tsx?raw';
import WithHint from '../examples/label/hint';
import hintSource from '../examples/label/hint.tsx?raw';
import LabelPlayground from '../examples/label/playground';

export default function LabelPage() {
  return (
    <>
      <DocSection
        title="Playground"
        description="Change the props on the right. The label and its code follow."
      >
        <LabelPlayground />
      </DocSection>
      <DocSection
        title="Above a field"
        description="A medium-weight label, linked to its field with htmlFor. A press on the label puts the focus in the field."
      >
        <Example source={basicSource}>
          <Basic />
        </Example>
      </DocSection>
      <DocSection
        title="Beside a control"
        description="After a checkbox or a switch, with the normal weight. A press on the label toggles the control. When the control before it is disabled, the label turns muted on its own."
      >
        <Example source={controlSource}>
          <WithControl />
        </Example>
      </DocSection>
      <DocSection
        title="With a note"
        description="The label is a row with gap 2, so a muted note such as “Optional” can sit beside the name, inside the label."
      >
        <Example source={hintSource}>
          <WithHint />
        </Example>
      </DocSection>
      <DocSection
        title="Props"
        description="Label takes every prop of a <label>, and adds none."
      >
        <PropsTable
          rows={[
            {
              name: 'htmlFor',
              type: 'string',
              description:
                'The id of the field or control the label names. A press on the label then reaches it.',
            },
            {
              name: 'className',
              type: 'string',
              description:
                'Classes added after the label’s own: font-normal beside a checkbox, font-mono for a key.',
            },
          ]}
        />
      </DocSection>
      <DocSection title="Notes">
        <Notes
          items={[
            'The label goes muted, not faded, in two cases: right after a disabled control with the peer class (Checkbox, Radio, Switch), or inside a group with data-disabled (a Field).',
            'Text in a label cannot be selected, so a double click on it does not select a word by mistake.',
            'In a form, use FieldLabel in a Field: it is this label, with the field’s layout.',
          ]}
        />
      </DocSection>
    </>
  );
}
