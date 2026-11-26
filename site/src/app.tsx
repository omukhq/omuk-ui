import { Skeleton } from '@omuk/ui/skeleton';
import { lazy, Suspense } from 'react';
import { BottomNav } from './bottom-nav';
import { FIRST_DOC } from './docs/registry';
import { Footer } from './footer';
import { Header } from './header';
import { Hero } from './hero';
import { Install } from './install';
import { usePath } from './router';
import { setSearchOpen, useSearch } from './search-store';
import { Section } from './section';
import { setSettingsOpen, useSettings } from './settings-store';
import { Why } from './why';

// The site: the home page at /, a component's page at /docs/<slug>. The
// home page's first screen is in the main bundle. The live app screen and
// the docs are chunks of their own: the home page never loads the docs, and
// a docs page never loads the app screen.

const AppScreen = lazy(() => import('./gallery/app-screen'));
const DocsLayout = lazy(() => import('./docs/layout'));
const Search = lazy(() => import('./search'));
const SettingsDrawer = lazy(() => import('./settings-drawer'));

/** ⌘K's search, mounted once it first opens. */
function SearchHost() {
  const { open, loaded } = useSearch();
  if (!loaded) return null;
  return (
    <Suspense fallback={null}>
      <Search open={open} onOpenChange={setSearchOpen} />
    </Suspense>
  );
}

/**
 * The settings drawer, mounted once it first opens (the header's button or
 * the phone's bottom bar), and kept after, so it can slide out when it
 * closes.
 */
function SettingsHost() {
  const { open, loaded } = useSettings();
  if (!loaded) return null;
  return (
    <Suspense fallback={null}>
      <SettingsDrawer open={open} onOpenChange={setSettingsOpen} />
    </Suspense>
  );
}

/** The slug in /docs/<slug>; /docs alone is the first page. */
function docsSlug(path: string) {
  const rest = path.replace(/^\/docs\/?/, '').replace(/\/$/, '');
  return rest === '' ? FIRST_DOC.slug : rest;
}

export function App() {
  const path = usePath();
  const inDocs = path === '/docs' || path.startsWith('/docs/');
  return (
    // Room for the phone's bottom bar, so it covers no content.
    <div
      id="top"
      className="flex min-h-dvh flex-col overflow-x-clip pb-bottom-nav md:pb-0"
    >
      <a
        href="#main"
        className="sr-only rounded-md bg-primary px-3 py-2 text-on-primary focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-50"
      >
        Skip to the content
      </a>
      <Header />
      {inDocs ? (
        <div className="flex-1">
          <Suspense fallback={null}>
            <DocsLayout slug={docsSlug(path)} />
          </Suspense>
        </div>
      ) : (
        <Home />
      )}
      <Footer />
      <BottomNav />
      <SearchHost />
      <SettingsHost />
    </div>
  );
}

/**
 * Opened at /#install (from a docs page, a new tab, a shared link): the
 * browser looked for the part before React drew the page, found nothing and
 * stayed at the top. Once the home page is in, go to the part. The app
 * screen's skeleton keeps its size, so the part does not move after.
 */
function goToHash(main: HTMLElement | null) {
  if (!main || !location.hash) return;
  const id = decodeURIComponent(location.hash.slice(1));
  requestAnimationFrame(() => document.getElementById(id)?.scrollIntoView());
}

function Home() {
  return (
    <main ref={goToHash} id="main" className="flex-1">
      <Hero />
      <Why />
      <Section
        id="in-use"
        title="In use"
        description="A screen from my secrets manager, rebuilt here from Omuk UI’s parts only. It all works: search, filter, open a row’s menu, delete a secret. Switch to dark mode at the top."
      >
        <Suspense fallback={<ScreenSkeleton />}>
          <AppScreen />
        </Suspense>
      </Section>
      <Install />
    </main>
  );
}

/** The app screen's place while its code loads: the same frame and rows. */
function ScreenSkeleton() {
  return (
    <div
      className="flex flex-col gap-4 rounded-xl p-6 inset-ring inset-ring-border"
      aria-hidden
    >
      <Skeleton className="h-7 w-32" />
      <Skeleton className="h-9 w-full max-w-md" />
      {[0, 1, 2, 3, 4, 5].map((index) => (
        <Skeleton key={index} className="h-8 w-full" />
      ))}
    </div>
  );
}
