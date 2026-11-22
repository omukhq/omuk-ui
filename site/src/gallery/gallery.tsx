import { Avatar, AvatarCount, AvatarStack } from '@omuk/ui/avatar';
import { Badge } from '@omuk/ui/badge';
import { Button } from '@omuk/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@omuk/ui/card';
import { Checkbox } from '@omuk/ui/checkbox';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from '@omuk/ui/dropdown-menu';
import { Input } from '@omuk/ui/input';
import { Label } from '@omuk/ui/label';
import { PromptProvider, usePrompt } from '@omuk/ui/prompt';
import { Segmented, SegmentedItem } from '@omuk/ui/segmented';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@omuk/ui/select';
import { Skeleton } from '@omuk/ui/skeleton';
import { Switch } from '@omuk/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@omuk/ui/tabs';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@omuk/ui/tooltip';
import {
  ChevronDownIcon,
  CopyIcon,
  PencilIcon,
  PlusIcon,
  SettingsIcon,
  Trash2Icon,
} from 'lucide-react';
import { lazy, type ReactNode, Suspense, useId, useState } from 'react';
import { RenameForm } from './rename-form';
import { LazyToaster, withToast } from './toasts';

// The live gallery: real components from this repo's src/, in the groups
// of the README. This whole file is a chunk of its own (app.tsx), and the
// date picker one more inside it.

const DateDemo = lazy(() => import('./date-demo'));

const REGIONS = [
  { value: 'eu', label: 'Europe (Frankfurt)' },
  { value: 'us', label: 'United States (Virginia)' },
  { value: 'ap', label: 'Asia Pacific (Singapore)' },
];

/** A pause, for the demos that show work in progress. */
function wait(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export default function Gallery() {
  return (
    <TooltipProvider>
      <div className="flex flex-col">
        <Actions />
        <Forms />
        <Dates />
        <Overlays />
        <Feedback />
        <Data />
        <Layout />
      </div>
      <PromptProvider />
      <LazyToaster />
    </TooltipProvider>
  );
}

/** One group of the gallery: its name on the left, the live parts beside. */
function Group({
  title,
  description,
  children,
}: {
  title: string;
  description: string;
  children: ReactNode;
}) {
  return (
    <div className="grid gap-4 border-t py-8 md:grid-cols-4 md:gap-8">
      <div className="flex flex-col gap-1">
        <h3 className="font-semibold text-foreground">{title}</h3>
        <p className="text-pretty text-muted">{description}</p>
      </div>
      <div className="flex min-w-0 flex-col gap-6 md:col-span-3">
        {children}
      </div>
    </div>
  );
}

/** A row of parts with a short name above it. */
function Specimen({ name, children }: { name: string; children: ReactNode }) {
  return (
    <div className="flex flex-col gap-2">
      <p className="text-xs text-muted">{name}</p>
      <div className="flex flex-wrap items-center gap-2">{children}</div>
    </div>
  );
}

function Actions() {
  const [view, setView] = useState('list');
  return (
    <Group
      title="Actions"
      description="Buttons in five variants and four sizes, and a segmented control."
    >
      <Specimen name="Variants">
        <Button>Save</Button>
        <Button variant="outline">Export</Button>
        <Button variant="ghost">Cancel</Button>
        <Button variant="destructive">Delete</Button>
        <Button variant="danger-confirm">Delete for good</Button>
        <Button variant="link">Learn more</Button>
      </Specimen>
      <Specimen name="Sizes">
        <Button size="xs" variant="outline">
          Extra small
        </Button>
        <Button size="sm" variant="outline">
          Small
        </Button>
        <Button variant="outline">Default</Button>
        <Button variant="outline">
          <PlusIcon data-icon="inline-start" strokeWidth={1.5} />
          With an icon
        </Button>
        <Button size="icon" variant="outline" aria-label="Settings">
          <SettingsIcon className="size-4" strokeWidth={1.5} />
        </Button>
        <Button disabled>Disabled</Button>
      </Specimen>
      <Specimen name="Segmented control">
        <Segmented aria-label="View" value={view} onValueChange={setView}>
          <SegmentedItem value="list">List</SegmentedItem>
          <SegmentedItem value="board">Board</SegmentedItem>
          <SegmentedItem value="calendar">Calendar</SegmentedItem>
        </Segmented>
      </Specimen>
    </Group>
  );
}

function Forms() {
  const [region, setRegion] = useState<string | null>('eu');
  const nameId = useId();
  const emailId = useId();
  const regionId = useId();
  const termsId = useId();
  const alertsId = useId();
  return (
    <Group
      title="Forms"
      description="Fields that keep one height, one edge and one focus ring."
    >
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="flex flex-col gap-1">
          <Label htmlFor={nameId}>Project name</Label>
          <Input id={nameId} placeholder="Billing service" />
        </div>
        <div className="flex flex-col gap-1">
          <Label htmlFor={emailId}>Email</Label>
          <Input
            id={emailId}
            type="email"
            defaultValue="ada@example"
            aria-invalid="true"
            aria-describedby={`${emailId}-error`}
          />
          <p id={`${emailId}-error`} className="text-xs text-danger">
            Enter an email address with a domain, like ada@example.com.
          </p>
        </div>
        <div className="flex flex-col gap-1">
          <Label htmlFor={regionId}>Region</Label>
          <Select items={REGIONS} value={region} onValueChange={setRegion}>
            <SelectTrigger id={regionId} className="w-full">
              <SelectValue placeholder="Choose a region" />
            </SelectTrigger>
            <SelectContent>
              {REGIONS.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="flex flex-col justify-end gap-3">
          <div className="flex items-center gap-2">
            <Checkbox id={termsId} defaultChecked />
            <Label htmlFor={termsId}>Send a weekly summary</Label>
          </div>
          <div className="flex items-center gap-2">
            <Switch id={alertsId} />
            <Label htmlFor={alertsId}>Alerts on this device</Label>
          </div>
        </div>
      </div>
    </Group>
  );
}

function Dates() {
  return (
    <Group
      title="Dates"
      description="One picker for a day, a day and a time, a range or a time. Its code loads only here."
    >
      <Suspense fallback={<DatesSkeleton />}>
        <DateDemo />
      </Suspense>
    </Group>
  );
}

/** The date pickers' place while their code loads: the same two fields. */
function DatesSkeleton() {
  return (
    <div className="grid gap-4 sm:grid-cols-2" aria-hidden>
      {[0, 1].map((index) => (
        <div key={index} className="flex flex-col gap-1">
          <Skeleton className="h-5 w-24" />
          <Skeleton className="h-9 w-full" />
        </div>
      ))}
    </div>
  );
}

function Overlays() {
  const prompt = usePrompt();
  const [sort, setSort] = useState('updated');

  async function deleteProject() {
    const deleted = await prompt.open({
      type: 'alert',
      title: 'Delete the project?',
      description:
        'Its three environments and their secrets go with it. It cannot be undone.',
      actionLabel: 'Delete',
      loadingLabel: 'Deleting',
      destructive: true,
      onAction: () => wait(1200),
    });
    if (deleted) void withToast((toast) => toast.success('Project deleted'));
  }

  async function renameProject() {
    const name = await prompt.open<string>({
      type: 'modal',
      title: 'Rename the project',
      content: (close) => <RenameForm current="Billing" onDone={close} />,
    });
    if (name) void withToast((toast) => toast(`Renamed to ${name}`));
  }

  return (
    <Group
      title="Overlays"
      description="Tooltips, menus and dialogs. A dialog opens from code and gives its answer as a promise."
    >
      <Specimen name="Tooltip and menu">
        <Tooltip>
          <TooltipTrigger
            render={
              <Button
                size="icon"
                variant="outline"
                aria-label="Copy the link"
              />
            }
          >
            <CopyIcon className="size-4" strokeWidth={1.5} />
          </TooltipTrigger>
          <TooltipContent>Copy the link</TooltipContent>
        </Tooltip>
        <DropdownMenu>
          <DropdownMenuTrigger
            render={
              <Button variant="outline">
                Options
                <ChevronDownIcon
                  data-icon="inline-end"
                  className="size-4 text-muted"
                  strokeWidth={1.5}
                />
              </Button>
            }
          />
          <DropdownMenuContent className="w-64">
            <DropdownMenuItem onClick={renameProject}>
              <PencilIcon strokeWidth={1.5} aria-hidden />
              Rename
              <DropdownMenuShortcut>R</DropdownMenuShortcut>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <CopyIcon strokeWidth={1.5} aria-hidden />
              Duplicate
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuLabel>Sort by</DropdownMenuLabel>
            <DropdownMenuRadioGroup value={sort} onValueChange={setSort}>
              <DropdownMenuRadioItem value="updated">
                Last updated
              </DropdownMenuRadioItem>
              <DropdownMenuRadioItem value="name">Name</DropdownMenuRadioItem>
            </DropdownMenuRadioGroup>
            <DropdownMenuSeparator />
            <DropdownMenuItem variant="destructive" onClick={deleteProject}>
              <Trash2Icon strokeWidth={1.5} aria-hidden />
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </Specimen>
      <Specimen name="Dialogs from code">
        <Button variant="outline" onClick={renameProject}>
          Rename the project
        </Button>
        <Button variant="destructive" onClick={deleteProject}>
          Delete the project
        </Button>
      </Specimen>
    </Group>
  );
}

function Feedback() {
  function deploy() {
    void withToast((toast) =>
      toast.promise(wait(1600), {
        loading: 'Deploying',
        success: 'Deployed to production',
        error: 'The deploy failed',
      }),
    );
  }
  return (
    <Group
      title="Feedback"
      description="Toasts stack at the bottom; an error stays until you close it. The toaster loads with the first toast."
    >
      <Specimen name="Toasts">
        <Button
          variant="outline"
          onClick={() => withToast((toast) => toast('Draft saved'))}
        >
          Show a toast
        </Button>
        <Button
          variant="outline"
          onClick={() =>
            withToast((toast) =>
              toast.success('Invite sent', {
                description: 'Ada can join until Friday.',
              }),
            )
          }
        >
          Success
        </Button>
        <Button
          variant="outline"
          onClick={() =>
            withToast((toast) =>
              toast.error('The file did not upload', {
                description: 'It is over 10 MB. Choose a smaller file.',
              }),
            )
          }
        >
          Error
        </Button>
        <Button variant="outline" onClick={deploy}>
          Work in progress
        </Button>
      </Specimen>
      <Specimen name="Skeleton">
        <div className="flex w-full max-w-sm flex-col gap-2" aria-hidden>
          <Skeleton className="h-4 w-3/4" />
          <Skeleton className="h-4 w-1/2" />
        </div>
      </Specimen>
    </Group>
  );
}

function Data() {
  return (
    <Group
      title="Data"
      description="Badges and avatars. A person without a photo keeps one colour, picked from their ID."
    >
      <Specimen name="Badges">
        <Badge>Draft</Badge>
        <Badge variant="plan">Pro</Badge>
        <Badge variant="outline">Archived</Badge>
        <Badge variant="destructive">Expired</Badge>
      </Specimen>
      <Specimen name="Avatars">
        <Avatar size="xl" userId="ada">
          AL
        </Avatar>
        <Avatar size="xl" userId="margaret">
          MH
        </Avatar>
        <Avatar size="xl" kind="team">
          OM
        </Avatar>
        <AvatarStack className="ml-2">
          <Avatar size="lg" userId="ada">
            AL
          </Avatar>
          <Avatar size="lg" userId="dennis">
            DR
          </Avatar>
          <Avatar size="lg" userId="linus">
            LT
          </Avatar>
          <AvatarCount size="lg" count={3} />
        </AvatarStack>
      </Specimen>
    </Group>
  );
}

function Layout() {
  return (
    <Group
      title="Layout"
      description="Tabs and cards. A card is raised over the panel ground, in both modes."
    >
      <Tabs defaultValue="overview" className="flex flex-col gap-4">
        <TabsList variant="line" aria-label="Project">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="usage">Usage</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>
        <div className="rounded-lg bg-panel p-4">
          <TabsContent value="overview">
            <Card className="max-w-sm">
              <CardHeader>
                <CardTitle>Billing service</CardTitle>
                <CardDescription>
                  Three environments, 42 secrets.
                </CardDescription>
              </CardHeader>
              <CardContent className="flex items-center gap-2">
                <span className="size-2 rounded-full bg-success" aria-hidden />
                <span className="text-success">Live</span>
              </CardContent>
              <CardFooter className="gap-2 border-t">
                <Button size="sm" variant="outline">
                  Open
                </Button>
                <Button size="sm" variant="ghost">
                  Share
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>
          <TabsContent value="usage">
            <Card className="max-w-sm">
              <CardHeader>
                <CardTitle>Reads this month</CardTitle>
                <CardDescription>From the CLI and the API.</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-semibold tabular-nums">12,480</p>
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="settings">
            <Card className="max-w-sm">
              <CardHeader>
                <CardTitle>Settings</CardTitle>
                <CardDescription>Who can read this project.</CardDescription>
              </CardHeader>
              <CardContent className="flex items-center justify-between gap-2">
                <span>Only the owner</span>
                <Switch defaultChecked aria-label="Only the owner" />
              </CardContent>
            </Card>
          </TabsContent>
        </div>
      </Tabs>
    </Group>
  );
}
