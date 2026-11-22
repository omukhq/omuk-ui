import { DocSection, Example, Notes, PropsTable } from '../blocks';
import Basic from '../examples/input-otp/basic';
import basicSource from '../examples/input-otp/basic.tsx?raw';
import Groups from '../examples/input-otp/groups';
import groupsSource from '../examples/input-otp/groups.tsx?raw';
import Invalid from '../examples/input-otp/invalid';
import invalidSource from '../examples/input-otp/invalid.tsx?raw';

export default function InputOTPPage() {
  return (
    <>
      <DocSection
        title="Six digits"
        description="One real input under the boxes takes the code, so typing, paste and the phone’s autofill all work. pattern keeps out what does not belong: here, anything but digits."
      >
        <Example source={basicSource}>
          <Basic />
        </Example>
      </DocSection>
      <DocSection
        title="Groups"
        description="Split a long code into groups, with a dash between them that a screen reader skips. With letters in the code, set inputMode to text, so a phone shows the full keyboard."
      >
        <Example source={groupsSource}>
          <Groups />
        </Example>
      </DocSection>
      <DocSection
        title="A wrong code"
        description="Set aria-invalid on the input and on each slot: the boxes take the red edge. The line below keeps its place while it is empty, so nothing moves when the error shows."
      >
        <Example source={invalidSource}>
          <Invalid />
        </Example>
      </DocSection>
      <DocSection
        title="Props"
        description="InputOTP takes every prop of the input-otp library’s OTPInput and of an <input>. InputOTPGroup and InputOTPSlot take the props of a <div>."
      >
        <PropsTable
          rows={[
            {
              name: 'maxLength',
              type: 'number',
              description:
                'InputOTP. How many characters the code has. Draw one slot for each. Required.',
            },
            {
              name: 'value',
              type: 'string',
              description:
                'InputOTP. The code, when the parent keeps it; with onChange(value).',
            },
            {
              name: 'onComplete',
              type: '(value: string) => void',
              description:
                'InputOTP. Called when the last box fills: a good time to send the code.',
            },
            {
              name: 'pattern',
              type: 'string',
              description:
                'InputOTP. A regular expression each character must match. REGEXP_ONLY_DIGITS and REGEXP_ONLY_DIGITS_AND_CHARS come from input-otp.',
            },
            {
              name: 'disabled',
              type: 'boolean',
              default: 'false',
              description: 'InputOTP. Turns the field off.',
            },
            {
              name: 'containerClassName',
              type: 'string',
              description:
                'InputOTP. Classes for the row that holds the groups: a gap, a font. className goes to the hidden input.',
            },
            {
              name: 'index',
              type: 'number',
              description:
                'InputOTPSlot. Which character of the code this box shows, from 0. Required.',
            },
          ]}
        />
      </DocSection>
      <DocSection title="Notes">
        <Notes
          items={[
            'The keys are those of a text field: type, Backspace, the arrow keys, select all. There is no box to Tab between.',
            'The field asks for autocomplete="one-time-code", so a phone offers the code from a text message.',
            'Send the code in onComplete, or after a press on a button. Do not clear it on a wrong code: the person may see the one wrong digit.',
          ]}
        />
      </DocSection>
    </>
  );
}
