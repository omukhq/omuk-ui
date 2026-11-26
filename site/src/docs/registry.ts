import type { ComponentType } from 'react';

// Every component's page, in the README's groups. The sidebar, the home
// page's index, the page titles and the sitemap all read this list.
//
// `load` imports the page's code: each page is a chunk of its own, so a
// visit to /docs/button never downloads the date picker. A page that is not
// written yet has no `load`: the sidebar still lists it, and its page says
// so and links to the source.

export type DocGroup =
  | 'Actions'
  | 'Forms'
  | 'Dates'
  | 'Overlays'
  | 'Feedback'
  | 'Data'
  | 'Layout';

export type DocEntry = {
  slug: string;
  name: string;
  group: DocGroup;
  /** The file in the package's src/ (and its import path, without .tsx). */
  file: string;
  /** One sentence: what it is for. The page's lede and meta description. */
  description: string;
  /** The names to import, when not the file's name in PascalCase. */
  imports?: string;
  load?: () => Promise<{ default: ComponentType }>;
};

/** The import line a page shows: `import { Button } from 'omuk-ui/button';`. */
export function importLine(entry: DocEntry) {
  const names =
    entry.imports ??
    entry.file
      .split('-')
      .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
      .join('');
  return `import { ${names} } from 'omuk-ui/${entry.file}';`;
}

export const DOCS: DocEntry[] = [
  // Actions
  {
    slug: 'button',
    name: 'Button',
    group: 'Actions',
    file: 'button',
    description:
      'A button in six variants and four sizes. While it loads, it keeps its size: the label stays in the layout, hidden, under a spinner.',
    load: () => import('./pages/button'),
  },
  {
    slug: 'button-group',
    name: 'Button group',
    group: 'Actions',
    file: 'button-group',
    load: () => import('./pages/button-group'),
    description:
      'Buttons joined into one control, with shared edges, for actions that belong together.',
  },
  {
    slug: 'segmented',
    name: 'Segmented control',
    group: 'Actions',
    file: 'segmented',
    imports: 'Segmented, SegmentedItem',
    load: () => import('./pages/segmented'),
    description:
      'One choice out of a few, side by side: a view, a period, a theme.',
  },
  {
    slug: 'chip',
    name: 'Chip',
    group: 'Actions',
    file: 'chip',
    load: () => import('./pages/chip'),
    description:
      'A small removable token: a filter that is on, an email in a list of invites.',
  },
  // Forms
  {
    slug: 'field',
    name: 'Field',
    group: 'Forms',
    file: 'field',
    imports: 'Field, FieldDescription, FieldError, FieldLabel',
    description:
      'A label, a control, a hint and an error, in one layout with the right spacing, across or stacked.',
    load: () => import('./pages/field'),
  },
  {
    slug: 'input',
    name: 'Input',
    group: 'Forms',
    file: 'input',
    description:
      'A text field, 36 tall, with one edge, one focus ring and a red edge when it is invalid.',
    load: () => import('./pages/input'),
  },
  {
    slug: 'input-group',
    name: 'Input group',
    group: 'Forms',
    file: 'input-group',
    imports: 'InputGroup, InputGroupAddon, InputGroupInput',
    load: () => import('./pages/input-group'),
    description:
      'A field with parts inside it: an icon, a prefix, a button that shows a password or clears the text.',
  },
  {
    slug: 'textarea',
    name: 'Textarea',
    group: 'Forms',
    file: 'textarea',
    load: () => import('./pages/textarea'),
    description:
      'A text field for several lines. It grows with its text, down and never sideways.',
  },
  {
    slug: 'select',
    name: 'Select',
    group: 'Forms',
    file: 'select',
    description:
      'One value from a list. It opens over its trigger, finds an option as you type, and works from the keyboard alone.',
    load: () => import('./pages/select'),
  },
  {
    slug: 'command',
    name: 'Command menu',
    group: 'Overlays',
    file: 'command',
    imports: 'Command, CommandDialog',
    load: () => import('./pages/command'),
    description:
      'A search field over a list of commands, for ⌘K: type to narrow it, the arrow keys to move, Enter to run.',
  },
  {
    slug: 'combobox',
    name: 'Combobox',
    group: 'Forms',
    file: 'combobox',
    imports:
      'Combobox, ComboboxContent, ComboboxInput, ComboboxItem, ComboboxList',
    load: () => import('./pages/combobox'),
    description:
      'A field that filters a list as you type: for a long list, where a select would need scrolling.',
  },
  {
    slug: 'checkbox',
    name: 'Checkbox',
    group: 'Forms',
    file: 'checkbox',
    load: () => import('./pages/checkbox'),
    description:
      'On or off, or partly on for a group. The whole row with its label is the target.',
  },
  {
    slug: 'checkbox-group',
    name: 'Checkbox group',
    group: 'Forms',
    file: 'checkbox-group',
    imports: 'CheckboxGroup',
    load: () => import('./pages/checkbox-group'),
    description:
      'Several checkboxes with one value, the list of the checked ones, and a box that checks them all.',
  },
  {
    slug: 'radio-group',
    name: 'Radio group',
    group: 'Forms',
    file: 'radio-group',
    imports: 'RadioGroup, RadioGroupItem',
    load: () => import('./pages/radio-group'),
    description:
      'One choice out of a few, each with room for a description. Arrow keys move the choice.',
  },
  {
    slug: 'switch',
    name: 'Switch',
    group: 'Forms',
    file: 'switch',
    load: () => import('./pages/switch'),
    description:
      'A setting that takes effect at once: on or off, with no Save button.',
  },
  {
    slug: 'input-otp',
    name: 'One-time code',
    group: 'Forms',
    file: 'input-otp',
    imports: 'InputOTP, InputOTPGroup, InputOTPSlot',
    load: () => import('./pages/input-otp'),
    description:
      'Boxes for a one-time code from an app or a text message, with paste and autofill.',
  },
  {
    slug: 'label',
    name: 'Label',
    group: 'Forms',
    file: 'label',
    load: () => import('./pages/label'),
    description: 'The name of a field, linked to it, in the form’s type.',
  },
  // Dates
  {
    slug: 'date-picker',
    name: 'Date picker',
    group: 'Dates',
    file: 'date-picker',
    load: () => import('./pages/date-picker'),
    description:
      'One field for a day, a day and a time, a range or a time. The parts are typed in the language’s order; a calendar opens from the field.',
  },
  {
    slug: 'calendar',
    name: 'Calendar',
    group: 'Dates',
    file: 'calendar',
    load: () => import('./pages/calendar'),
    description:
      'A month grid to pick a day or a range, with the keyboard or the pointer.',
  },
  // Overlays
  {
    slug: 'prompt',
    name: 'Prompt',
    group: 'Overlays',
    file: 'prompt',
    imports: 'PromptProvider, usePrompt',
    description:
      'Alerts, dialogs and drawers opened from code. `open` gives the answer as a promise, and an alert stays open while its action runs.',
    load: () => import('./pages/prompt'),
  },
  {
    slug: 'dialog',
    name: 'Dialog',
    group: 'Overlays',
    file: 'dialog',
    description:
      'A window over the page, built on the browser’s own <dialog>. Focus stays inside until it closes.',
    load: () => import('./pages/dialog'),
  },
  {
    slug: 'alert-dialog',
    name: 'Alert dialog',
    group: 'Overlays',
    file: 'alert-dialog',
    load: () => import('./pages/alert-dialog'),
    description:
      'A question that stops the work until it is answered: a delete, a discard. Focus starts on the safe answer.',
  },
  {
    slug: 'drawer',
    name: 'Drawer',
    group: 'Overlays',
    file: 'drawer',
    load: () => import('./pages/drawer'),
    description:
      'A panel from an edge of the window. A swipe closes it on a phone.',
  },
  {
    slug: 'popover',
    name: 'Popover',
    group: 'Overlays',
    file: 'popover',
    load: () => import('./pages/popover'),
    description:
      'A small panel beside its button, in the browser’s top layer. It turns to the side with room.',
  },
  {
    slug: 'tooltip',
    name: 'Tooltip',
    group: 'Overlays',
    file: 'tooltip',
    load: () => import('./pages/tooltip'),
    description:
      'A short name for a control with no text, shown on hover and on keyboard focus.',
  },
  {
    slug: 'dropdown-menu',
    name: 'Dropdown menu',
    group: 'Overlays',
    file: 'dropdown-menu',
    description:
      'A list of actions from a button: with icons, shortcuts, checked items and submenus, and typing to find.',
    load: () => import('./pages/dropdown-menu'),
  },
  {
    slug: 'context-menu',
    name: 'Context menu',
    group: 'Overlays',
    file: 'context-menu',
    load: () => import('./pages/context-menu'),
    description:
      'The same menu, opened where the pointer is: a right-click, a long press, or Shift+F10.',
  },
  // Feedback
  {
    slug: 'toast',
    name: 'Toast',
    group: 'Feedback',
    file: 'sonner',
    imports: 'Toaster, toast',
    description:
      'A short message at the bottom of the window. Up to three in a stack; an error stays until it is closed.',
    load: () => import('./pages/toast'),
  },
  {
    slug: 'spinner',
    name: 'Spinner',
    group: 'Feedback',
    file: 'spinner',
    load: () => import('./pages/spinner'),
    description:
      'Work in progress, in a known place: a button, a save state, a block.',
  },
  {
    slug: 'skeleton',
    name: 'Skeleton',
    group: 'Feedback',
    file: 'skeleton',
    load: () => import('./pages/skeleton'),
    description:
      'The shape of the content while it loads, so the page does not move when it comes.',
  },
  {
    slug: 'status',
    name: 'Status',
    group: 'Feedback',
    file: 'status',
    load: () => import('./pages/status'),
    description: 'A word and a dot in one colour: live, check this, failed.',
  },
  // Data
  {
    slug: 'table',
    name: 'Table',
    group: 'Data',
    file: 'table',
    imports: 'Table, TableBody, TableCell, TableHead, TableHeader, TableRow',
    load: () => import('./pages/table'),
    description:
      'Rows and columns with the right edges, heights and number alignment.',
  },
  {
    slug: 'pagination',
    name: 'Pagination',
    group: 'Data',
    file: 'pagination',
    imports: 'Pagination, PaginationContent, PaginationItem, PaginationLink',
    load: () => import('./pages/pagination'),
    description:
      'Previous, next and the pages around the current one, as links.',
  },
  {
    slug: 'list-row',
    name: 'List row',
    group: 'Data',
    file: 'list-row',
    imports: 'ListRow, ListRowMeta',
    load: () => import('./pages/list-row'),
    description:
      'A row in a sidebar or a list: an icon, a name, a count, and the current page marked.',
  },
  {
    slug: 'sortable',
    name: 'Sortable list',
    group: 'Data',
    file: 'sortable',
    imports: 'Sortable, SortableHandle, SortableItem',
    load: () => import('./pages/sortable'),
    description:
      'A short list that the person puts in order, by dragging a handle or with the arrow keys.',
  },
  {
    slug: 'badge',
    name: 'Badge',
    group: 'Data',
    file: 'badge',
    load: () => import('./pages/badge'),
    description: 'A short label on a row or a title: a type, a plan, a count.',
  },
  {
    slug: 'avatar',
    name: 'Avatar',
    group: 'Data',
    file: 'avatar',
    imports: 'Avatar, AvatarCount, AvatarStack',
    load: () => import('./pages/avatar'),
    description:
      'A person, an app or a team as a picture or initials, alone or in a stack.',
  },
  // Layout
  {
    slug: 'card',
    name: 'Card',
    group: 'Layout',
    file: 'card',
    imports: 'Card, CardContent, CardFooter, CardHeader, CardTitle',
    load: () => import('./pages/card'),
    description:
      'A raised surface with a header, content and a footer: settings groups, dashboard tiles.',
  },
  {
    slug: 'tabs',
    name: 'Tabs',
    group: 'Layout',
    file: 'tabs',
    imports: 'Tabs, TabsContent, TabsList, TabsTrigger',
    load: () => import('./pages/tabs'),
    description:
      'Views of one thing, one at a time. Arrow keys move between the tabs.',
  },
  {
    slug: 'separator',
    name: 'Separator',
    group: 'Layout',
    file: 'separator',
    load: () => import('./pages/separator'),
    description: 'A line between groups of content, across or down.',
  },
];

/** The entry for a slug, or undefined. */
export function docFor(slug: string) {
  return DOCS.find((entry) => entry.slug === slug);
}

/** Every page by name, A to Z: the sidebar's order, and previous and next. */
export const DOCS_BY_NAME = [...DOCS].sort((a, b) =>
  a.name.localeCompare(b.name),
);

/** The first page of the docs, where /docs leads. */
export const FIRST_DOC = DOCS[0];

const loaded = new Map<string, ComponentType>();

/**
 * Loads a page's code and keeps its component. A link calls it on hover
 * and on focus, so a click on it usually finds the page ready.
 */
export function preloadPage(entry: DocEntry) {
  const load = entry.load;
  if (!load || loaded.has(entry.slug)) return Promise.resolve();
  return load().then((module) => {
    loaded.set(entry.slug, module.default);
  });
}

/** The page's component, when its code has loaded; undefined before. */
export function loadedPage(slug: string) {
  return loaded.get(slug);
}
