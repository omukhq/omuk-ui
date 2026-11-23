import { Status } from '@omuk/ui/status';

const ENVIRONMENTS = [
  {
    name: 'Production',
    note: 'Synced 2 min. ago',
    tone: 'success',
    state: 'Live',
  },
  {
    name: 'Staging',
    note: '3 secrets differ',
    tone: 'warning',
    state: 'Out of date',
  },
  {
    name: 'Preview',
    note: 'The last push did not reach it',
    tone: 'danger',
    state: 'Failed',
  },
  { name: 'Local', note: 'No token yet', tone: 'muted', state: 'Not set up' },
] as const;

export default function StatusList() {
  return (
    <ul className="flex w-full max-w-md flex-col divide-y">
      {ENVIRONMENTS.map((environment) => (
        <li
          key={environment.name}
          className="flex items-center justify-between gap-4 py-3"
        >
          <div className="flex min-w-0 flex-col">
            <span className="text-sm font-medium text-foreground">
              {environment.name}
            </span>
            <span className="truncate text-xs text-muted">
              {environment.note}
            </span>
          </div>
          <Status tone={environment.tone}>{environment.state}</Status>
        </li>
      ))}
    </ul>
  );
}
