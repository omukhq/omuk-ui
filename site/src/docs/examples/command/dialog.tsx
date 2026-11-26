import { FolderIcon, KeyRoundIcon, MoonIcon, SunIcon } from 'lucide-react';
import { Button } from 'omuk-ui/button';
import { CommandDialog, type CommandItem } from 'omuk-ui/command';
import { useState } from 'react';

export default function CommandDialogExample() {
  const [open, setOpen] = useState(false);
  const [last, setLast] = useState('nothing yet');

  const commands: CommandItem[] = [
    {
      id: 'projects',
      label: 'Projects',
      group: 'Pages',
      icon: <FolderIcon strokeWidth={1.5} aria-hidden />,
      onSelect: () => setLast('Projects'),
    },
    {
      id: 'tokens',
      label: 'Access tokens',
      group: 'Pages',
      keywords: ['api', 'cli'],
      icon: <KeyRoundIcon strokeWidth={1.5} aria-hidden />,
      onSelect: () => setLast('Access tokens'),
    },
    {
      id: 'light',
      label: 'Light theme',
      group: 'Actions',
      icon: <SunIcon strokeWidth={1.5} aria-hidden />,
      shortcut: '⇧⌘L',
      onSelect: () => setLast('Light theme'),
    },
    {
      id: 'dark',
      label: 'Dark theme',
      group: 'Actions',
      icon: <MoonIcon strokeWidth={1.5} aria-hidden />,
      shortcut: '⇧⌘D',
      onSelect: () => setLast('Dark theme'),
    },
  ];

  return (
    <div className="flex flex-col items-center gap-3">
      <Button variant="outline" onClick={() => setOpen(true)}>
        Open the command menu
      </Button>
      <p className="text-sm text-muted">Last command: {last}</p>
      <CommandDialog
        open={open}
        onOpenChange={setOpen}
        placeholder="Search or run a command"
        items={commands}
      />
    </div>
  );
}
