import { Button } from '@omuk/ui/button';
import { cn } from '@omuk/ui/utils';
import { MoonIcon, SearchIcon, SunIcon } from 'lucide-react';
import { FIRST_DOC } from './docs/registry';
import { REPO_URL, SECTIONS } from './links';
import { Link, usePath } from './router';
import { openSearch, preloadSearch, searchKeys } from './search-store';
import { setTheme, useTheme } from './theme';

/**
 * The bar at the top: the name (home), the components, the home page's parts,
 * the theme and the source. The parts are plain links to /#part: on the
 * home page they scroll, from the docs they open it there.
 */
export function Header() {
  const theme = useTheme();
  const next = theme === 'dark' ? 'light' : 'dark';
  const inDocs = usePath().startsWith('/docs');
  return (
    <header className="sticky top-0 z-40 border-b bg-page">
      <div
        className={cn(
          'mx-auto flex h-14 items-center gap-1 px-gutter',
          inDocs ? 'max-w-docs' : 'max-w-site',
        )}
      >
        <Link
          to="/"
          className="mr-auto rounded-md text-sm font-semibold text-foreground focus-visible:focus-ring"
        >
          Omuk UI
        </Link>
        <Button
          variant="outline"
          onClick={openSearch}
          onPointerEnter={preloadSearch}
          onFocus={preloadSearch}
          aria-label="Find a component"
          aria-keyshortcuts="Meta+K Control+K"
          className="mr-2 text-muted hover:text-foreground"
        >
          <SearchIcon data-icon="inline-start" strokeWidth={1.5} aria-hidden />
          <span className="hidden sm:inline">Find a component</span>
          <kbd className="ml-4 hidden rounded-sm bg-hover px-1.5 font-mono text-xs text-muted sm:inline">
            {searchKeys()}
          </kbd>
        </Button>
        <nav aria-label="Site" className="flex items-center">
          <Button
            variant="ghost"
            render={
              <Link
                to={`/docs/${FIRST_DOC.slug}`}
                aria-current={inDocs ? 'page' : undefined}
              />
            }
            nativeButton={false}
            className={cn(
              inDocs ? 'text-foreground' : 'text-muted hover:text-foreground',
            )}
          >
            Components
          </Button>
          {SECTIONS.map((section) => (
            <Button
              key={section.id}
              variant="ghost"
              render={<a href={`/#${section.id}`} />}
              nativeButton={false}
              className="hidden text-muted hover:text-foreground md:inline-flex"
            >
              {section.label}
            </Button>
          ))}
        </nav>
        <Button
          variant="ghost"
          size="icon"
          aria-label={`Switch to ${next} mode`}
          onClick={() => setTheme(next)}
        >
          {theme === 'dark' ? (
            <SunIcon className="size-4" strokeWidth={1.5} />
          ) : (
            <MoonIcon className="size-4" strokeWidth={1.5} />
          )}
        </Button>
        <Button
          variant="outline"
          render={<a href={REPO_URL} />}
          nativeButton={false}
        >
          Source
        </Button>
      </div>
    </header>
  );
}
