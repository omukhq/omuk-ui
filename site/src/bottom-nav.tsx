import { cn } from '@omuk/ui/utils';
import {
  HouseIcon,
  LayoutGridIcon,
  SearchIcon,
  Settings2Icon,
} from 'lucide-react';
import type { ComponentProps, ReactNode } from 'react';
import { FIRST_DOC } from './docs/registry';
import { openDocsNav } from './docs-nav-store';
import { Link, usePath } from './router';
import { openSearch, preloadSearch } from './search-store';
import { openSettings, preloadSettings, useSettings } from './settings-store';

// On a phone (below md): the site's four places, as app tabs along the
// bottom, where the thumb is. The header keeps only the name and GitHub
// there. Components opens the list in the docs, and goes to the first page
// from the home page. The page keeps room for the bar (App, pb-bottom-nav).

const TAB =
  'flex min-w-0 flex-1 flex-col items-center justify-center gap-1 rounded-md text-xs font-medium outline-none focus-visible:focus-ring [&_svg]:size-5';

function tabClass(current: boolean) {
  return cn(TAB, current ? 'text-foreground' : 'text-muted');
}

function Tab({
  icon,
  label,
  ...props
}: ComponentProps<'button'> & { icon: ReactNode; label: string }) {
  return (
    <button type="button" className={tabClass(false)} {...props}>
      {icon}
      {label}
    </button>
  );
}

export function BottomNav() {
  const path = usePath();
  const inDocs = path === '/docs' || path.startsWith('/docs/');
  const settings = useSettings();
  const components = (
    <>
      <LayoutGridIcon strokeWidth={1.5} aria-hidden />
      Components
    </>
  );
  return (
    <nav
      aria-label="Site"
      // The phone's gesture bar or buttons sit over the page's bottom edge
      // (viewport-fit=cover): the bar's tabs stay above them.
      className="fixed inset-x-0 bottom-0 z-40 box-content flex h-16 gap-1 border-t bg-page px-2 pb-safe-bottom md:hidden"
    >
      <Link
        to="/"
        aria-current={path === '/' ? 'page' : undefined}
        className={tabClass(path === '/')}
      >
        <HouseIcon strokeWidth={1.5} aria-hidden />
        Home
      </Link>
      {inDocs ? (
        <button
          type="button"
          aria-haspopup="dialog"
          onClick={openDocsNav}
          className={tabClass(true)}
        >
          {components}
        </button>
      ) : (
        <Link to={`/docs/${FIRST_DOC.slug}`} className={tabClass(false)}>
          {components}
        </Link>
      )}
      <Tab
        icon={<SearchIcon strokeWidth={1.5} aria-hidden />}
        label="Search"
        aria-haspopup="dialog"
        onClick={openSearch}
        onPointerEnter={preloadSearch}
        onFocus={preloadSearch}
      />
      <Tab
        icon={<Settings2Icon strokeWidth={1.5} aria-hidden />}
        label="Settings"
        aria-haspopup="dialog"
        aria-expanded={settings.open}
        onClick={openSettings}
        onPointerEnter={preloadSettings}
        onFocus={preloadSettings}
      />
    </nav>
  );
}
