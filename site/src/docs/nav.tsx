import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from '@omuk/ui/input-group';
import { ListRow } from '@omuk/ui/list-row';
import { SearchIcon } from 'lucide-react';
import { useState } from 'react';
import { Link } from '../router';
import { DOCS_BY_NAME, preloadPage } from './registry';

/**
 * Every component, A to Z, with a search that narrows the list as you
 * type. The current page is marked. `onNavigate` closes the phone's drawer
 * after a pick.
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
  const shown = DOCS_BY_NAME.filter(
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
      {shown.length === 0 ? (
        <p className="px-3 text-sm text-muted">
          No component is called “{query}”.
        </p>
      ) : (
        <div className="flex flex-col gap-0.5">
          {shown.map((entry) => (
            <ListRow
              key={entry.slug}
              current={entry.slug === current}
              render={
                <Link
                  to={`/docs/${entry.slug}`}
                  onPreload={() => preloadPage(entry).catch(() => {})}
                  onClick={onNavigate}
                />
              }
            >
              {entry.name}
            </ListRow>
          ))}
        </div>
      )}
    </nav>
  );
}
