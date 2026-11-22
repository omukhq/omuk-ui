import { DocSection, Example, Notes, PropsTable } from '../blocks';
import Basic from '../examples/field/basic';
import basicSource from '../examples/field/basic.tsx?raw';
import ChoiceCards from '../examples/field/choice-cards';
import choiceCardsSource from '../examples/field/choice-cards.tsx?raw';
import ErrorExample from '../examples/field/error';
import errorSource from '../examples/field/error.tsx?raw';
import Fieldset from '../examples/field/fieldset';
import fieldsetSource from '../examples/field/fieldset.tsx?raw';

export default function FieldPage() {
  return (
    <>
      <DocSection
        title="A label, a field and a hint"
        description="Field stacks its parts with the form’s spacing: the label above, the hint below. FieldGroup spaces the fields of a form."
      >
        <Example source={basicSource}>
          <Basic />
        </Example>
      </DocSection>
      <DocSection
        title="Errors"
        description="FieldError takes the messages of a check and shows one as a line, more as a list. It draws nothing while there are none. Set aria-invalid on the control as well, so its edge turns red. Type a name with no space."
      >
        <Example source={errorSource}>
          <ErrorExample />
        </Example>
      </DocSection>
      <DocSection
        title="A set of choices"
        description="FieldSet and FieldLegend name a group of checkboxes or radios. A horizontal Field puts the control and its label on one line; data-disabled on the Field mutes its label."
      >
        <Example source={fieldsetSource}>
          <Fieldset />
        </Example>
      </DocSection>
      <DocSection
        title="Choice cards"
        description="A FieldLabel around a whole Field is a card: the whole card picks the choice, and the picked card takes the accent edge."
      >
        <Example source={choiceCardsSource}>
          <ChoiceCards />
        </Example>
      </DocSection>
      <DocSection
        title="Props"
        description="Every part also takes the props of its element: a <div>, or a <fieldset>, <legend>, <label> or <p>."
      >
        <PropsTable
          rows={[
            {
              name: 'orientation',
              type: "'vertical' | 'horizontal' | 'responsive'",
              default: "'vertical'",
              description:
                'Field. Vertical puts the label above the control. Horizontal puts a checkbox, radio or switch beside its label. Responsive is vertical, and horizontal once its FieldGroup is medium wide.',
            },
            {
              name: 'data-disabled',
              type: "''",
              description:
                'Field. Mutes the label and the title. Set it with a disabled control.',
            },
            {
              name: 'variant',
              type: "'legend' | 'label'",
              default: "'legend'",
              description:
                'FieldLegend. legend is a small heading; label has the look of a field’s label.',
            },
            {
              name: 'errors',
              type: '{ message?: string }[]',
              description:
                'FieldError. The messages to show, with repeats dropped. Children, when given, are shown instead.',
            },
            {
              name: 'children',
              type: 'ReactNode',
              description:
                'FieldSeparator. Text in the middle of the line, such as “or”. Without it, the separator is a plain line.',
            },
          ]}
        />
      </DocSection>
      <DocSection title="Notes">
        <Notes
          items={[
            'The parts do not link themselves: give the control an id, the FieldLabel its htmlFor, and point aria-describedby at the hint or the error.',
            'FieldError has role="alert": a screen reader reads a new error out at once. Show it after a check, not while the person still types the first characters.',
            'FieldTitle looks like a label but is not one. Use it inside a choice card, where the FieldLabel is the card itself.',
          ]}
        />
      </DocSection>
    </>
  );
}
