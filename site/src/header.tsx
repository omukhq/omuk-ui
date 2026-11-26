import { SearchIcon, Settings2Icon } from 'lucide-react';
import { Button } from 'omuk-ui/button';
import { cn } from 'omuk-ui/utils';
import { FIRST_DOC } from './docs/registry';
import { openDocsNav } from './docs-nav-store';
import { GithubMark } from './github-mark';
import { REPO_URL, SECTIONS } from './links';
import { Link, usePath } from './router';
import { openSearch, preloadSearch, useSearchKeys } from './search-store';
import { openSettings, preloadSettings, useSettings } from './settings-store';

/**
 * The bar at the top: the name (home), the components, the home page's parts,
 * the settings (theme, accent, font, edges, sizes) and the source. The parts
 * are plain links to /#part: on the home page they scroll, from the docs
 * they open it there. On a phone (below md) the search, the components and
 * the settings are in the bottom bar (bottom-nav.tsx) instead.
 */
export function Header() {
  const settings = useSettings();
  const keys = useSearchKeys();
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
          className="mr-2 hidden text-muted hover:text-foreground md:inline-flex"
        >
          <SearchIcon data-icon="inline-start" strokeWidth={1.5} aria-hidden />
          <span>Find a component</span>
          <kbd className="ml-4 rounded-sm bg-hover px-1.5 font-mono text-xs text-muted">
            {keys}
          </kbd>
        </Button>
        <nav aria-label="Site" className="hidden items-center md:flex">
          {/* In the docs below lg, the page has no sidebar: this opens the
              component list in a drawer, from anywhere on the page. */}
          {inDocs && (
            <Button
              variant="ghost"
              aria-haspopup="dialog"
              onClick={openDocsNav}
              className="text-foreground lg:hidden"
            >
              Components
            </Button>
          )}
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
              inDocs
                ? 'hidden text-foreground lg:inline-flex'
                : 'text-muted hover:text-foreground',
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
              className="text-muted hover:text-foreground"
            >
              {section.label}
            </Button>
          ))}
        </nav>
        <Button
          variant="ghost"
          size="icon"
          aria-label="Settings"
          aria-haspopup="dialog"
          aria-expanded={settings.open}
          onPointerEnter={preloadSettings}
          onFocus={preloadSettings}
          onClick={openSettings}
          className="hidden md:inline-flex"
        >
          <Settings2Icon className="size-4" strokeWidth={1.5} />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          aria-label="GitHub"
          render={<a href={REPO_URL} />}
          nativeButton={false}
        >
          <GithubMark className="size-4" />
        </Button>
      </div>
    </header>
  );
}
