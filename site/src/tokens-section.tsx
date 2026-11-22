import { cn } from '@omuk/ui/utils';
import { DESIGN_URL } from './links';
import { Section } from './section';

// The colour roles, drawn with their own classes: switch the theme and each
// swatch takes its dark value. The class strings are written out whole, so
// Tailwind finds them.

const GROUPS: {
  title: string;
  roles: { name: string; swatch: string; job: string }[];
}[] = [
  {
    title: 'Surfaces',
    roles: [
      {
        name: 'page',
        swatch: 'bg-page',
        job: 'The main surface, menus, dialogs',
      },
      {
        name: 'panel',
        swatch: 'bg-panel',
        job: 'The ground behind cards and code',
      },
      {
        name: 'raised',
        swatch: 'bg-raised',
        job: 'Cards and popovers, above the ground',
      },
      {
        name: 'hover',
        swatch: 'bg-hover',
        job: 'A row or ghost button under the pointer',
      },
      {
        name: 'selected',
        swatch: 'bg-selected',
        job: 'Toggles that are on, selected rows',
      },
      { name: 'scrim', swatch: 'bg-scrim', job: 'Behind dialogs and drawers' },
    ],
  },
  {
    title: 'Text and edges',
    roles: [
      { name: 'foreground', swatch: 'bg-foreground', job: 'Main text' },
      { name: 'muted', swatch: 'bg-muted', job: 'Hints, labels, timestamps' },
      {
        name: 'primary',
        swatch: 'bg-primary',
        job: 'Primary buttons, tooltips, toasts',
      },
      {
        name: 'border',
        swatch: 'bg-border',
        job: 'Dividers, card and table frames',
      },
      {
        name: 'control',
        swatch: 'bg-control',
        job: 'The resting edge of fields and boxes',
      },
      { name: 'outline', swatch: 'bg-outline', job: 'The same edge on hover' },
    ],
  },
  {
    title: 'Meaning',
    roles: [
      {
        name: 'accent',
        swatch: 'bg-accent',
        job: 'Links, ticks, picked values',
      },
      { name: 'mark', swatch: 'bg-mark', job: 'Highlights and plan badges' },
      { name: 'found', swatch: 'bg-found', job: 'The words a search found' },
      { name: 'danger', swatch: 'bg-danger', job: 'Delete and errors' },
      { name: 'success', swatch: 'bg-success', job: 'Done, live, connected' },
      { name: 'warning', swatch: 'bg-warning', job: 'Check this' },
    ],
  },
];

const TYPE = [
  { name: 'text-xs', className: 'text-xs', use: 'Hints and meta' },
  { name: 'text-sm', className: 'text-sm', use: 'The interface' },
  { name: 'text-base', className: 'text-base', use: 'Reading' },
  { name: 'text-lg', className: 'text-lg', use: 'Dialog titles' },
  { name: 'text-xl', className: 'text-xl', use: 'Section titles' },
  { name: 'text-2xl', className: 'text-2xl', use: 'Page titles' },
];

const RADII = [
  { name: 'rounded-sm', className: 'rounded-sm' },
  { name: 'rounded-md', className: 'rounded-md' },
  { name: 'rounded-lg', className: 'rounded-lg' },
  { name: 'rounded-xl', className: 'rounded-xl' },
];

export function TokensSection() {
  return (
    <Section
      id="tokens"
      title="Tokens"
      description={
        <>
          Your app uses roles, not shades: bg-page, text-muted, bg-accent. Each
          role points at a Tailwind palette shade, and dark mode sets the roles
          again. Every rule is in{' '}
          <a
            href={DESIGN_URL}
            className="rounded-sm text-accent underline-offset-4 hover:underline focus-visible:focus-ring"
          >
            the design system
          </a>
          .
        </>
      }
    >
      <div className="grid gap-8 md:grid-cols-3">
        {GROUPS.map((group) => (
          <div key={group.title} className="flex flex-col gap-3">
            <h3 className="font-semibold text-foreground">{group.title}</h3>
            <ul className="flex flex-col">
              {group.roles.map((role) => (
                <li
                  key={role.name}
                  className="flex items-center gap-3 border-t py-2"
                >
                  <span
                    aria-hidden
                    className={cn(
                      'size-8 shrink-0 rounded-md inset-ring inset-ring-border',
                      role.swatch,
                    )}
                  />
                  <span className="flex min-w-0 flex-col">
                    <code className="font-mono text-xs text-foreground">
                      {role.name}
                    </code>
                    <span className="text-xs text-muted">{role.job}</span>
                  </span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div className="grid gap-8 md:grid-cols-3">
        <div className="flex flex-col gap-3 md:col-span-2">
          <h3 className="font-semibold text-foreground">Type</h3>
          <p className="text-sm text-muted">
            IBM Plex Sans, six sizes, three weights.
          </p>
          <ul className="flex flex-col">
            {TYPE.map((size) => (
              <li
                key={size.name}
                className="flex items-baseline gap-4 border-t py-2"
              >
                <code className="w-20 shrink-0 font-mono text-xs text-muted">
                  {size.name}
                </code>
                <span
                  className={cn(
                    'min-w-0 truncate text-foreground',
                    size.className,
                  )}
                >
                  {size.use}
                </span>
              </li>
            ))}
          </ul>
        </div>
        <div className="flex flex-col gap-3">
          <h3 className="font-semibold text-foreground">Radius</h3>
          <p className="text-sm text-muted">
            The outer corner is one step rounder than the inner one.
          </p>
          <ul className="grid grid-cols-2 gap-3">
            {RADII.map((radius) => (
              <li key={radius.name} className="flex flex-col gap-2">
                <span
                  aria-hidden
                  className={cn('h-12 bg-raised shadow-sm', radius.className)}
                />
                <code className="font-mono text-xs text-muted">
                  {radius.name}
                </code>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </Section>
  );
}
