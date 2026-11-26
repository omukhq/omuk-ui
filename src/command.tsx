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
import { cn, isComposing } from './utils';

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
  /** What shows when nothing matches. A screen reader reads it too. */
  empty?: (query: string) => ReactNode;
  /** What a screen reader hears as the search narrows: "3 results". */
  resultsText?: (count: number) => string;
  /** Runs after a command is chosen, before its onSelect: a dialog closes here. */
  onDone?: () => void;
  /** Focus the field as the menu mounts. A CommandDialog does; inline, it is off. */
  autoFocus?: boolean;
};

function defaultEmpty(query: string) {
  return `Nothing matches “${query}”.`;
}

function defaultResults(count: number) {
  return count === 1 ? '1 result' : `${count} results`;
}

/** The menu itself: the field and the list, on any surface. */
function Command({
  items,
  placeholder = 'Search',
  empty = defaultEmpty,
  resultsText = defaultResults,
  onDone,
  autoFocus = false,
  className,
  ...props
}: CommandProps) {
  const id = useId();
  const [query, setQuery] = useState('');
  const [activeId, setActiveId] = useState<string | null>(null);

  const sections = filterCommands(items, query);
  const count = sections.reduce(
    (sum, section) => sum + section.items.length,
    0,
  );
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
    // Every key belongs to the input method while it composes.
    if (isComposing(event.nativeEvent)) return;
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
    } else if (event.key === 'Enter' && active) {
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
        className="max-h-80 overflow-y-auto p-1 empty:hidden"
      >
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
                      {/* A pause between the two lines for a screen reader. */}
                      <span className="sr-only">, </span>
                      {item.description}
                    </span>
                  )}
                </span>
                {/* Shown, not read: the shortcut is not the command's name. */}
                {item.shortcut && (
                  <kbd aria-hidden className={cn(SHORTCUT, 'font-sans')}>
                    {item.shortcut}
                  </kbd>
                )}
              </div>
            ))}
          </div>
        ))}
      </div>
      {/* Outside the listbox, which holds options only. A screen reader
          reads it from the status below. */}
      {count === 0 && (
        <p
          aria-hidden
          data-slot="command-empty"
          className="px-3 py-6 text-center text-muted"
        >
          {empty(query)}
        </p>
      )}
      {/* On the page from the start, so a change is read out: the count as
          the search narrows, or the empty message. Quiet until a search. */}
      <div role="status" className="sr-only">
        {query === '' ? null : count === 0 ? empty(query) : resultsText(count)}
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
