import { Avatar } from '@omuk/ui/avatar';
import { Badge } from '@omuk/ui/badge';
import { Button } from '@omuk/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@omuk/ui/dropdown-menu';
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from '@omuk/ui/input-group';
import { ListRow, ListRowMeta } from '@omuk/ui/list-row';
import { PromptProvider, usePrompt } from '@omuk/ui/prompt';
import { Segmented, SegmentedItem } from '@omuk/ui/segmented';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@omuk/ui/select';
import { Status } from '@omuk/ui/status';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@omuk/ui/table';
import {
  CopyIcon,
  EllipsisIcon,
  FolderIcon,
  KeyRoundIcon,
  PencilIcon,
  PlusIcon,
  ScrollTextIcon,
  SearchIcon,
  Trash2Icon,
} from 'lucide-react';
import { useState } from 'react';
import { LazyToaster, withToast } from './toasts';

// "In use": one real screen, made only from Omuk UI's parts. It is modelled
// on my secrets manager: a project's secrets in one environment. Everything
// works: the search and the type filter narrow the rows, a row's menu
// copies (a toast), and Delete asks first, runs, then removes the row.
// This file is a chunk of its own: it loads below the first screen.

type Kind = 'secret' | 'config';

type Row = {
  name: string;
  kind: Kind;
  version: number;
  changed: string;
  synced: boolean;
};

const ROWS: Row[] = [
  {
    name: 'DATABASE_URL',
    kind: 'secret',
    version: 4,
    changed: '2 h ago',
    synced: true,
  },
  {
    name: 'STRIPE_SECRET_KEY',
    kind: 'secret',
    version: 2,
    changed: 'Yesterday',
    synced: true,
  },
  {
    name: 'RESEND_API_KEY',
    kind: 'secret',
    version: 3,
    changed: '3 days ago',
    synced: false,
  },
  {
    name: 'APP_URL',
    kind: 'config',
    version: 1,
    changed: '12 Nov',
    synced: true,
  },
  {
    name: 'SENTRY_DSN',
    kind: 'config',
    version: 1,
    changed: '9 Nov',
    synced: true,
  },
  {
    name: 'SESSION_SECRET',
    kind: 'secret',
    version: 6,
    changed: '2 Nov',
    synced: true,
  },
];

const ENVIRONMENTS = [
  { value: 'production', label: 'production' },
  { value: 'preview', label: 'preview' },
  { value: 'development', label: 'development' },
];

const PROJECTS = [
  { name: 'billing', count: 6 },
  { name: 'markpad', count: 21 },
  { name: 'kronix', count: 6 },
];

/** A pause, for the work a demo pretends to do. */
function wait(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export default function AppScreen() {
  return (
    <>
      <div className="overflow-hidden rounded-xl bg-page shadow-lg inset-ring inset-ring-border">
        <div className="flex">
          <Sidebar />
          <Secrets />
        </div>
      </div>
      <PromptProvider />
      <LazyToaster />
    </>
  );
}

function Sidebar() {
  return (
    <nav
      aria-label="The demo's projects"
      className="hidden w-56 shrink-0 flex-col gap-4 border-r p-3 md:flex"
    >
      <div className="flex items-center gap-2 px-2 pt-1">
        <Avatar kind="app" size="md">
          <KeyRoundIcon
            className="size-3.5 text-foreground"
            strokeWidth={1.5}
          />
        </Avatar>
        <span className="text-sm font-semibold text-foreground">Secrets</span>
      </div>
      <div className="flex flex-col gap-0.5">
        <p className="px-3 pb-1 text-xs font-medium text-muted">Projects</p>
        {PROJECTS.map((project) => (
          <ListRow key={project.name} current={project.name === 'billing'}>
            <FolderIcon strokeWidth={1.5} aria-hidden />
            <span className="flex-1 truncate">{project.name}</span>
            <ListRowMeta>{project.count}</ListRowMeta>
          </ListRow>
        ))}
      </div>
      <div className="flex flex-col gap-0.5">
        <p className="px-3 pb-1 text-xs font-medium text-muted">Activity</p>
        <ListRow>
          <ScrollTextIcon strokeWidth={1.5} aria-hidden />
          Audit log
        </ListRow>
      </div>
    </nav>
  );
}

function Secrets() {
  const prompt = usePrompt();
  const [rows, setRows] = useState(ROWS);
  const [query, setQuery] = useState('');
  const [kind, setKind] = useState('all');
  const [environment, setEnvironment] = useState<string | null>('production');

  const shown = rows.filter(
    (row) =>
      row.name.toLowerCase().includes(query.trim().toLowerCase()) &&
      (kind === 'all' || row.kind === kind),
  );

  async function remove(row: Row) {
    const removed = await prompt.open({
      type: 'alert',
      title: `Delete ${row.name}?`,
      description: 'Its history goes too. This cannot be undone.',
      actionLabel: 'Delete',
      loadingLabel: 'Deleting',
      destructive: true,
      onAction: () => wait(900),
    });
    if (!removed) return;
    setRows((current) => current.filter((each) => each.name !== row.name));
    void withToast((toast) => toast.success(`Deleted ${row.name}`));
  }

  function copy(row: Row) {
    void withToast((toast) => toast(`Copied the value of ${row.name}`));
  }

  return (
    <div className="flex min-w-0 flex-1 flex-col">
      <div className="flex flex-wrap items-start justify-between gap-4 px-5 pt-5 pb-4 md:px-6">
        <div className="flex min-w-0 flex-col gap-1">
          <h3 className="text-xl font-semibold text-foreground">billing</h3>
          <p className="text-sm text-muted">
            The secrets of {environment}. Values stay hidden until you show
            them.
          </p>
        </div>
        <Button
          onClick={() => withToast((toast) => toast('This demo adds nothing'))}
        >
          <PlusIcon data-icon="inline-start" strokeWidth={1.5} aria-hidden />
          Add secret
        </Button>
      </div>
      <div className="flex flex-wrap items-center gap-2 border-y px-5 py-3 md:px-6">
        <InputGroup className="w-full sm:w-56">
          <InputGroupAddon>
            <SearchIcon strokeWidth={1.5} aria-hidden />
          </InputGroupAddon>
          <InputGroupInput
            placeholder="Search names"
            aria-label="Search names"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
          />
        </InputGroup>
        <Segmented aria-label="Type" value={kind} onValueChange={setKind}>
          <SegmentedItem value="all">All</SegmentedItem>
          <SegmentedItem value="secret">Secrets</SegmentedItem>
          <SegmentedItem value="config">Config</SegmentedItem>
        </Segmented>
        <div className="sm:ml-auto">
          <Select
            items={ENVIRONMENTS}
            value={environment}
            onValueChange={setEnvironment}
          >
            <SelectTrigger aria-label="Environment" className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {ENVIRONMENTS.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="pl-5 md:pl-6">Name</TableHead>
              <TableHead>Type</TableHead>
              <TableHead className="text-right">Version</TableHead>
              <TableHead>Changed</TableHead>
              <TableHead>Vercel</TableHead>
              <TableHead className="w-12 pr-5 md:pr-6">
                <span className="sr-only">Actions</span>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {shown.map((row) => (
              <TableRow key={row.name}>
                <TableCell className="pl-5 font-mono text-xs md:pl-6">
                  {row.name}
                </TableCell>
                <TableCell>
                  <Badge
                    variant={row.kind === 'secret' ? 'secondary' : 'outline'}
                  >
                    {row.kind === 'secret' ? 'Secret' : 'Config'}
                  </Badge>
                </TableCell>
                <TableCell className="text-right tabular-nums">
                  {row.version}
                </TableCell>
                <TableCell className="text-muted">{row.changed}</TableCell>
                <TableCell>
                  <Status tone={row.synced ? 'success' : 'warning'}>
                    {row.synced ? 'Up to date' : 'Not pushed'}
                  </Status>
                </TableCell>
                <TableCell className="pr-5 md:pr-6">
                  <RowMenu
                    row={row}
                    onCopy={() => copy(row)}
                    onRemove={() => remove(row)}
                  />
                </TableCell>
              </TableRow>
            ))}
            {shown.length === 0 && (
              <TableRow>
                <TableCell colSpan={6} className="py-10 text-center text-muted">
                  No secret matches “{query}”.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <p className="border-t px-5 py-3 text-xs text-muted md:px-6">
        {shown.length} of {rows.length} secrets
      </p>
    </div>
  );
}

function RowMenu({
  row,
  onCopy,
  onRemove,
}: {
  row: Row;
  onCopy: () => void;
  onRemove: () => void;
}) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={
          <Button
            variant="ghost"
            size="icon-xs"
            aria-label={`Actions for ${row.name}`}
          />
        }
      >
        <EllipsisIcon className="size-4" strokeWidth={1.5} />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        <DropdownMenuItem onClick={onCopy}>
          <CopyIcon strokeWidth={1.5} aria-hidden />
          Copy value
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() =>
            withToast((toast) => toast('This demo renames nothing'))
          }
        >
          <PencilIcon strokeWidth={1.5} aria-hidden />
          Rename
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem variant="destructive" onClick={onRemove}>
          <Trash2Icon strokeWidth={1.5} aria-hidden />
          Delete
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
