import { Skeleton } from '@omuk/ui/skeleton';
import { lazy, Suspense } from 'react';
import { ComponentsIndex } from './components-index';
import { Footer } from './footer';
import { Header } from './header';
import { Hero } from './hero';
import { Install } from './install';
import { Section } from './section';
import { Why } from './why';

// The page. The first screen (header, headline, the spec drawing) is in the
// main bundle. The live app screen is below the fold, with most of the
// components: it is a chunk of its own, fetched as soon as the page runs,
// so it never holds up the first paint.

const AppScreen = lazy(() => import('./gallery/app-screen'));

export function App() {
  return (
    <div id="top" className="flex min-h-dvh flex-col overflow-x-clip">
      <a
        href="#main"
        className="sr-only rounded-md bg-primary px-3 py-2 text-on-primary focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-50"
      >
        Skip to the content
      </a>
      <Header />
      <main id="main" className="flex-1">
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
        <Section
          id="components"
          title="Components"
          description="Every part, each its own import. Each name opens its source: the file is the documentation."
        >
          <ComponentsIndex />
        </Section>
        <Install />
      </main>
      <Footer />
    </div>
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
