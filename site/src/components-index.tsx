import { sourceUrl } from './links';

// Every component, in the README's groups. Each name links to its source:
// the package is TypeScript source, so the file is the documentation too.

const GROUPS: { title: string; items: [string, string][] }[] = [
  {
    title: 'Actions',
    items: [
      ['Button', 'button.tsx'],
      ['Button group', 'button-group.tsx'],
      ['Segmented control', 'segmented.tsx'],
      ['Chip', 'chip.tsx'],
    ],
  },
  {
    title: 'Forms',
    items: [
      ['Field', 'field.tsx'],
      ['Input', 'input.tsx'],
      ['Input group', 'input-group.tsx'],
      ['Textarea', 'textarea.tsx'],
      ['Select', 'select.tsx'],
      ['Combobox', 'combobox.tsx'],
      ['Checkbox', 'checkbox.tsx'],
      ['Radio group', 'radio-group.tsx'],
      ['Switch', 'switch.tsx'],
      ['One-time code', 'input-otp.tsx'],
      ['Label', 'label.tsx'],
    ],
  },
  {
    title: 'Dates',
    items: [
      ['Date picker', 'date-picker.tsx'],
      ['Calendar', 'calendar.tsx'],
    ],
  },
  {
    title: 'Overlays',
    items: [
      ['Prompt', 'prompt.tsx'],
      ['Dialog', 'dialog.tsx'],
      ['Alert dialog', 'alert-dialog.tsx'],
      ['Drawer', 'drawer.tsx'],
      ['Popover', 'popover.tsx'],
      ['Tooltip', 'tooltip.tsx'],
      ['Dropdown menu', 'dropdown-menu.tsx'],
      ['Context menu', 'context-menu.tsx'],
    ],
  },
  {
    title: 'Feedback',
    items: [
      ['Toast', 'sonner.tsx'],
      ['Spinner', 'spinner.tsx'],
      ['Skeleton', 'skeleton.tsx'],
      ['Status', 'status.tsx'],
    ],
  },
  {
    title: 'Data and layout',
    items: [
      ['Table', 'table.tsx'],
      ['Pagination', 'pagination.tsx'],
      ['List row', 'list-row.tsx'],
      ['Sortable list', 'sortable.tsx'],
      ['Badge', 'badge.tsx'],
      ['Avatar', 'avatar.tsx'],
      ['Card', 'card.tsx'],
      ['Tabs', 'tabs.tsx'],
      ['Separator', 'separator.tsx'],
    ],
  },
];

export function ComponentsIndex() {
  return (
    <div className="grid gap-x-8 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
      {GROUPS.map((group) => (
        <div key={group.title} className="flex flex-col gap-3">
          <h3 className="border-b pb-3 font-semibold text-foreground">
            {group.title}
          </h3>
          <ul className="flex flex-col">
            {group.items.map(([name, file]) => (
              <li key={file}>
                <a
                  href={sourceUrl(file)}
                  className="flex items-baseline justify-between gap-4 rounded-sm py-1.5 text-foreground hover:text-accent focus-visible:focus-ring"
                >
                  {name}
                  <span className="font-mono text-xs text-muted">{file}</span>
                </a>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}
