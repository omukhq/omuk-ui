import { Skeleton } from '@omuk/ui/skeleton';
import { lazy, Suspense } from 'react';
import { Footer } from './footer';
import { Header } from './header';
import { Hero } from './hero';
import { Install } from './install';
import { Section } from './section';
import { TokensSection } from './tokens-section';
import { Why } from './why';

// The page. The first screen (header, hero, the story and its live Save
// button) is in the main bundle. The gallery is below the fold, with most
// of the components: it is a chunk of its own, fetched as soon as the page
// runs, so it never holds up the first paint.

const Gallery = lazy(() => import('./gallery/gallery'));

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
          id="components"
          title="Components"
          description="Everything here is live: the real components from the repository, in the theme you see. Switch to dark mode at the top to see every role change."
        >
          <Suspense fallback={<GallerySkeleton />}>
            <Gallery />
          </Suspense>
        </Section>
        <TokensSection />
        <Install />
      </main>
      <Footer />
    </div>
  );
}

/** The gallery's place while its code loads. */
function GallerySkeleton() {
  return (
    <div className="flex flex-col gap-6 border-t py-8" aria-hidden>
      <Skeleton className="h-5 w-32" />
      <Skeleton className="h-9 w-full max-w-lg" />
      <Skeleton className="h-9 w-full max-w-md" />
    </div>
  );
}
