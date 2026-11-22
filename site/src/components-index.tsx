import { DOCS, GROUPS } from './docs/registry';
import { Link } from './router';

// Every component, in the README's groups. Each name opens its page in the
// docs; pointing at it starts that page's code.

export function ComponentsIndex() {
  return (
    <div className="grid gap-x-8 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
      {GROUPS.map((group) => (
        <div key={group} className="flex flex-col gap-3">
          <h3 className="border-b pb-3 font-semibold text-foreground">
            {group}
          </h3>
          <ul className="flex flex-col">
            {DOCS.filter((entry) => entry.group === group).map((entry) => (
              <li key={entry.slug}>
                <Link
                  to={`/docs/${entry.slug}`}
                  onPreload={() => void entry.load?.()}
                  className="flex items-baseline justify-between gap-4 rounded-sm py-1.5 text-foreground hover:text-accent focus-visible:focus-ring"
                >
                  {entry.name}
                  <span className="font-mono text-xs text-muted">
                    {entry.file}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}
