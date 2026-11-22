import { DocSection, Example, Notes, PropsTable } from '../blocks';
import List from '../examples/status/list';
import listSource from '../examples/status/list.tsx?raw';
import Tones from '../examples/status/tones';
import tonesSource from '../examples/status/tones.tsx?raw';

export default function StatusPage() {
  return (
    <>
      <DocSection
        title="Four tones"
        description="Success for live, done or connected. Warning for something to check. Danger for a failure. Muted, the default, for a state that needs nothing."
      >
        <Example source={tonesSource}>
          <Tones />
        </Example>
      </DocSection>
      <DocSection
        title="In a list"
        description="At the end of a row, the status says the state in one or two words. The row’s second line says why."
      >
        <Example source={listSource}>
          <List />
        </Example>
      </DocSection>
      <DocSection title="Props">
        <PropsTable
          rows={[
            {
              name: 'tone',
              type: "'success' | 'warning' | 'danger' | 'muted'",
              default: "'muted'",
              description: 'The colour of the dot and of the word.',
            },
            {
              name: 'children',
              type: 'ReactNode',
              description: 'The word or the short phrase after the dot.',
            },
          ]}
        />
      </DocSection>
      <DocSection title="Notes">
        <Notes
          items={[
            'The word carries the meaning; the colour only helps. Never show the dot alone.',
            'The dot is hidden from a screen reader, which reads only the word.',
            'For a label that is not a state (a count, a type), use a Badge.',
          ]}
        />
      </DocSection>
    </>
  );
}
