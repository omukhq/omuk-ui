import { CommandDialog, type CommandItem } from '@omuk/ui/command';
import { MoonIcon, SunIcon } from 'lucide-react';
import { DOCS_BY_NAME, preloadPage } from './docs/registry';
import { navigate } from './router';
import { setTheme } from './theme';

// ⌘K: find a component and go to its page, or switch the theme. The app
// loads this file only when the search first opens (or its button is
// hovered), so it costs nothing until then. The menu is Omuk UI's own
// CommandDialog.

const COMMANDS: CommandItem[] = [
  ...DOCS_BY_NAME.map((entry) => ({
    id: entry.slug,
    label: entry.name,
    group: 'Components',
    description: entry.description,
    onSelect: () => {
      // The page shows at once when its code is in: start it first.
      preloadPage(entry)
        .catch(() => {})
        .then(() => navigate(`/docs/${entry.slug}`));
    },
  })),
  {
    id: 'theme-light',
    label: 'Light mode',
    group: 'Theme',
    icon: <SunIcon strokeWidth={1.5} aria-hidden />,
    onSelect: () => setTheme('light'),
  },
  {
    id: 'theme-dark',
    label: 'Dark mode',
    group: 'Theme',
    icon: <MoonIcon strokeWidth={1.5} aria-hidden />,
    onSelect: () => setTheme('dark'),
  },
];

export default function Search({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  return (
    <CommandDialog
      open={open}
      onOpenChange={onOpenChange}
      title="Find a component"
      placeholder="Find a component"
      items={COMMANDS}
      empty={(query) => `No component matches “${query}”.`}
    />
  );
}
