import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from '@omuk/ui/input-group';
import { ListRow } from '@omuk/ui/list-row';
import { SearchIcon } from 'lucide-react';
import { useState } from 'react';
import { Link } from '../router';
import { DOCS, GROUPS } from './registry';

/**
 * Every component, in its group, with a search that narrows the list as
 * you type. The current page is marked. `onNavigate` closes the phone's
 * drawer after a pick.
 */
export function DocsNav({
  current,
  onNavigate,
}: {
  current: string;
  onNavigate?: () => void;
}) {
  const [query, setQuery] = useState('');
  const needle = query.trim().toLowerCase();
  const shown = DOCS.filter(
    (entry) =>
      needle === '' ||
      entry.name.toLowerCase().includes(needle) ||
      entry.slug.includes(needle),
  );

  return (
    <nav aria-label="Components" className="flex flex-col gap-6">
      <InputGroup>
        <InputGroupAddon>
          <SearchIcon strokeWidth={1.5} aria-hidden />
        </InputGroupAddon>
        <InputGroupInput
          type="search"
          placeholder="Find a component"
          aria-label="Find a component"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
        />
      </InputGroup>
      {shown.length === 0 && (
        <p className="px-3 text-sm text-muted">
          No component is called “{query}”.
        </p>
      )}
      {GROUPS.map((group) => {
        const entries = shown.filter((entry) => entry.group === group);
        if (entries.length === 0) return null;
        return (
          <div key={group} className="flex flex-col gap-0.5">
            <p className="px-3 pb-1 text-xs font-medium text-muted">{group}</p>
            {entries.map((entry) => (
              <ListRow
                key={entry.slug}
                current={entry.slug === current}
                render={
                  <Link
                    to={`/docs/${entry.slug}`}
                    onPreload={() => void entry.load?.()}
                    onClick={onNavigate}
                  />
                }
              >
                {entry.name}
              </ListRow>
            ))}
          </div>
        );
      })}
    </nav>
  );
}
