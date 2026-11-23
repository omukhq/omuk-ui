import { SearchIcon } from 'lucide-react';
import {
  type ComponentPropsWithRef,
  type KeyboardEvent,
  type ReactNode,
  useId,
  useState,
} from 'react';
import { filterCommands } from './command-filter';
import { Dialog, DialogContent, DialogTitle } from './dialog';
import { MENU_SEPARATOR, ROW, SECTION_LABEL, SHORTCUT } from './recipes';
import { cn } from './utils';

// A command menu: a search field over a list of commands, for ⌘K. Type to
// narrow the list; the arrow keys, Home and End move the highlight; Enter
// runs the highlighted command. The focus stays in the field the whole
// time (a WAI-ARIA combobox with aria-activedescendant), so typing never
// stops. The commands are data, so the menu itself does the search and
// the order (command-filter.ts).

export type CommandItem = {
  /** Unique in the list. */
  id: string;
  /** What the row says, and what the search reads first. */
  label: string;
  /** The heading the row sits under. Groups keep the order they first come in. */
  group?: string;
  /** A second, muted line; the search reads it after the label. */
  description?: string;
  /** More words the search matches, not shown. */
  keywords?: string[];
  /** An icon at the start of the row. */
  icon?: ReactNode;
  /** A key to show at the end of the row ("⌘D"). It only shows: bind it yourself. */
  shortcut?: string;
  disabled?: boolean;
  /** Runs on Enter or a click. In a CommandDialog, the dialog closes first. */
  onSelect: () => void;
};

type CommandProps = Omit<ComponentPropsWithRef<'div'>, 'onSelect'> & {
  items: readonly CommandItem[];
  /** The field's placeholder, and its name for a screen reader. */
  placeholder?: string;
  /** What shows when nothing matches. */
  empty?: (query: string) => ReactNode;
  /** Runs after a command is chosen, before its onSelect: a dialog closes here. */
  onDone?: () => void;
  /** Focus the field as the menu mounts. A CommandDialog does; inline, it is off. */
  autoFocus?: boolean;
};

function defaultEmpty(query: string) {
  return `Nothing matches “${query}”.`;
}

/** The menu itself: the field and the list, on any surface. */
function Command({
  items,
  placeholder = 'Search',
  empty = defaultEmpty,
  onDone,
  autoFocus = false,
  className,
  ...props
}: CommandProps) {
  const id = useId();
  const [query, setQuery] = useState('');
  const [activeId, setActiveId] = useState<string | null>(null);

  const sections = filterCommands(items, query);
  const enabled = sections
    .flatMap((section) => section.items)
    .filter((item) => !item.disabled);
  // The highlight stays on its command while that one is shown; else it
  // goes to the first command that can run.
  const active = enabled.find((item) => item.id === activeId) ?? enabled[0];

  function optionId(item: CommandItem) {
    return `${id}-${item.id}`;
  }

  function highlight(item: CommandItem | undefined) {
    if (!item) return;
    setActiveId(item.id);
    document
      .getElementById(optionId(item))
      ?.scrollIntoView({ block: 'nearest' });
  }

  function choose(item: CommandItem) {
    if (item.disabled) return;
    onDone?.();
    item.onSelect();
  }

  function onKeyDown(event: KeyboardEvent<HTMLInputElement>) {
    const index = active ? enabled.indexOf(active) : -1;
    const last = enabled.length - 1;
    if (event.key === 'ArrowDown') {
      event.preventDefault();
      highlight(enabled[index >= last ? 0 : index + 1]);
    } else if (event.key === 'ArrowUp') {
      event.preventDefault();
      highlight(enabled[index <= 0 ? last : index - 1]);
    } else if (event.key === 'Home' && event.ctrlKey) {
      event.preventDefault();
      highlight(enabled[0]);
    } else if (event.key === 'End' && event.ctrlKey) {
      event.preventDefault();
      highlight(enabled[last]);
    } else if (
      event.key === 'Enter' &&
      active &&
      !event.nativeEvent.isComposing
    ) {
      event.preventDefault();
      choose(active);
    }
  }

  return (
    <div
      data-slot="command"
      className={cn('flex flex-col text-sm text-foreground', className)}
      {...props}
    >
      <div
        data-slot="command-search"
        className="flex h-11 items-center gap-2 border-b px-3"
      >
        <SearchIcon
          className="size-4 shrink-0 text-muted"
          strokeWidth={1.5}
          aria-hidden
        />
        <input
          // biome-ignore lint/a11y/noAutofocus: a dialog opens to be typed in
          autoFocus={autoFocus}
          type="text"
          role="combobox"
          aria-expanded
          aria-autocomplete="list"
          aria-controls={`${id}-list`}
          aria-activedescendant={active ? optionId(active) : undefined}
          aria-label={placeholder}
          placeholder={placeholder}
          autoComplete="off"
          spellCheck={false}
          value={query}
          onChange={(event) => {
            setQuery(event.target.value);
            setActiveId(null);
          }}
          onKeyDown={onKeyDown}
          className="h-full min-w-0 flex-1 bg-transparent text-sm text-foreground outline-none placeholder:text-muted"
        />
      </div>
      <div
        id={`${id}-list`}
        role="listbox"
        aria-label={placeholder}
        data-slot="command-list"
        className="max-h-80 overflow-y-auto p-1"
      >
        {sections.length === 0 && (
          <p
            data-slot="command-empty"
            className="px-3 py-6 text-center text-muted"
          >
            {empty(query)}
          </p>
        )}
        {sections.map((section, index) => (
          <div
            key={section.group ?? ''}
            role="group"
            aria-labelledby={section.group ? `${id}-group-${index}` : undefined}
            data-slot="command-group"
          >
            {index > 0 && <div aria-hidden className={MENU_SEPARATOR} />}
            {section.group && (
              <div id={`${id}-group-${index}`} className={SECTION_LABEL}>
                {section.group}
              </div>
            )}
            {section.items.map((item) => (
              // The keys work in the field (aria-activedescendant): the rows
              // stay out of the tab order and need no key handler.
              // biome-ignore lint/a11y/useFocusableInteractive: the field holds the focus
              <div
                key={item.id}
                id={optionId(item)}
                role="option"
                aria-selected={item === active}
                aria-disabled={item.disabled || undefined}
                data-slot="command-item"
                data-highlighted={item === active ? '' : undefined}
                data-disabled={item.disabled ? '' : undefined}
                className={cn(ROW, 'cursor-pointer')}
                onPointerMove={() => {
                  if (!item.disabled && item !== active) setActiveId(item.id);
                }}
                onClick={() => choose(item)}
              >
                {item.icon}
                <span className="flex min-w-0 flex-col">
                  <span className="truncate">{item.label}</span>
                  {item.description && (
                    <span className="truncate text-xs text-muted">
                      {item.description}
                    </span>
                  )}
                </span>
                {item.shortcut && (
                  <kbd className={cn(SHORTCUT, 'font-sans')}>
                    {item.shortcut}
                  </kbd>
                )}
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

type CommandDialogProps = Omit<CommandProps, 'onDone' | 'autoFocus'> & {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /** The dialog's name for a screen reader; not shown. */
  title?: string;
};

/**
 * The menu in a dialog, for ⌘K. A chosen command closes it, then runs. It
 * starts empty each time it opens.
 */
function CommandDialog({
  open,
  onOpenChange,
  title = 'Command menu',
  className,
  ...props
}: CommandDialogProps) {
  return (
    <Dialog open={open} onOpenChange={(next) => onOpenChange(next)}>
      <DialogContent
        showCloseButton={false}
        className="top-1/5 flex max-w-lg translate-y-0 flex-col gap-0 overflow-hidden p-0"
      >
        <DialogTitle className="sr-only">{title}</DialogTitle>
        <Command
          className={cn('min-w-0', className)}
          autoFocus
          onDone={() => onOpenChange(false)}
          {...props}
        />
      </DialogContent>
    </Dialog>
  );
}

export { Command, CommandDialog };
