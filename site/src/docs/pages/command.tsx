import { DocSection, Example, KeysTable, Notes, PropsTable } from '../blocks';
import Dialog from '../examples/command/dialog';
import dialogSource from '../examples/command/dialog.tsx?raw';
import Inline from '../examples/command/inline';
import inlineSource from '../examples/command/inline.tsx?raw';

export default function CommandPage() {
  return (
    <>
      <DocSection
        title="In a dialog"
        description="CommandDialog is the menu for ⌘K. Bind the key in your app and pass open. A chosen command closes the dialog, then runs. Groups keep the order of their first command; type “api” to find Access tokens by a keyword."
      >
        <Example source={dialogSource}>
          <Dialog />
        </Example>
      </DocSection>
      <DocSection
        title="On the page"
        description="Command is the same menu without the dialog, on any surface. A disabled command shows, but the keys skip it."
      >
        <Example source={inlineSource}>
          <Inline />
        </Example>
      </DocSection>
      <DocSection
        title="Props"
        description="Command takes every prop of a <div> as well. CommandDialog takes all of Command’s but onDone and autoFocus, and these."
      >
        <PropsTable
          rows={[
            {
              name: 'items',
              type: 'CommandItem[]',
              description:
                'The commands: { id, label, onSelect } and, if you like, group, description, keywords, icon, shortcut, disabled.',
            },
            {
              name: 'placeholder',
              type: 'string',
              default: "'Search'",
              description:
                'The field’s placeholder, and its name and the list’s for a screen reader.',
            },
            {
              name: 'empty',
              type: '(query: string) => ReactNode',
              default: '“Nothing matches …”',
              description: 'What shows when no command matches.',
            },
            {
              name: 'onDone',
              type: '() => void',
              description:
                'Command only. Runs after a command is chosen, before its onSelect.',
            },
            {
              name: 'autoFocus',
              type: 'boolean',
              default: 'false',
              description:
                'Command only. Focuses the field as it mounts. CommandDialog always does.',
            },
            {
              name: 'open',
              type: 'boolean',
              description: 'CommandDialog only. Whether the dialog is open.',
            },
            {
              name: 'onOpenChange',
              type: '(open: boolean) => void',
              description:
                'CommandDialog only. Escape, a click outside and a chosen command call it with false.',
            },
            {
              name: 'title',
              type: 'string',
              default: "'Command menu'",
              description:
                'CommandDialog only. The dialog’s name for a screen reader; it does not show.',
            },
          ]}
        />
      </DocSection>
      <DocSection title="Keyboard">
        <KeysTable
          rows={[
            ['Down', 'Moves to the next command; from the last, to the first.'],
            [
              'Up',
              'Moves to the previous command; from the first, to the last.',
            ],
            ['Ctrl + Home', 'Moves to the first command.'],
            ['Ctrl + End', 'Moves to the last command.'],
            ['Enter', 'Runs the highlighted command.'],
            ['Escape', 'Closes the dialog.'],
          ]}
        />
      </DocSection>
      <DocSection title="Notes">
        <Notes
          items={[
            'The focus stays in the field, so typing never stops. The list follows with aria-activedescendant, as a WAI-ARIA combobox does.',
            'The search reads the label first: its start, then the start of a word in it, then anywhere. A keyword or the description matches after. Better matches come first inside each group.',
            'A shortcut only shows at the end of the row. Bind the key yourself.',
            'Each time the dialog opens, the field is empty and the first command is highlighted.',
          ]}
        />
      </DocSection>
    </>
  );
}
