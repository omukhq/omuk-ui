import { Button } from '@omuk/ui/button';
import { cn } from '@omuk/ui/utils';
import { SearchIcon, Settings2Icon } from 'lucide-react';
import { lazy, Suspense, useState } from 'react';
import { FIRST_DOC } from './docs/registry';
import { GithubMark } from './github-mark';
import { REPO_URL, SECTIONS } from './links';
import { Link, usePath } from './router';
import { openSearch, preloadSearch, searchKeys } from './search-store';

const SettingsDrawer = lazy(() => import('./settings-drawer'));

/** Starts the drawer's code before it opens: on hover of its button. */
function preloadSettings() {
  import('./settings-drawer').catch(() => {});
}

/**
 * The bar at the top: the name (home), the components, the home page's parts,
 * the settings (theme, accent, font, edges, sizes) and the source. The parts
 * are plain links to /#part: on the home page they scroll, from the docs
 * they open it there.
 */
export function Header() {
  // The drawer's code loads on the first open (or a hover before it), and
  // stays mounted after, so it can slide out when it closes.
  const [settings, setSettings] = useState({ open: false, loaded: false });
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
          aria-label="Settings"
          aria-haspopup="dialog"
          aria-expanded={settings.open}
          onPointerEnter={preloadSettings}
          onFocus={preloadSettings}
          onClick={() => setSettings({ open: true, loaded: true })}
        >
          <Settings2Icon className="size-4" strokeWidth={1.5} />
        </Button>
        {settings.loaded && (
          <Suspense fallback={null}>
            <SettingsDrawer
              open={settings.open}
              onOpenChange={(open) => setSettings({ open, loaded: true })}
            />
          </Suspense>
        )}
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
