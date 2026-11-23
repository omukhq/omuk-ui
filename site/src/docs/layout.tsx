import { Button } from '@omuk/ui/button';
import { PromptProvider, usePrompt } from '@omuk/ui/prompt';
import { Skeleton } from '@omuk/ui/skeleton';
import { cn } from '@omuk/ui/utils';
import { ChevronLeftIcon, ChevronRightIcon, PanelLeftIcon } from 'lucide-react';
import {
  type ComponentType,
  type LazyExoticComponent,
  lazy,
  Suspense,
  useCallback,
  useState,
} from 'react';
import { DESIGN_URL, sourceUrl } from '../links';
import { Link } from '../router';
import { ImportLine } from './blocks';
import { DocsNav } from './nav';
import { DOCS, type DocEntry, docFor, importLine } from './registry';

// The docs: the sidebar with every component, and one component's page.
// This file is a chunk of its own (the home page never loads it), and each
// page inside it is one more: /docs/button loads the button's page only.

const pages = new Map<string, LazyExoticComponent<ComponentType>>();

/** The page's component, made once for each slug. */
function pageFor(entry: DocEntry) {
  const load = entry.load;
  if (!load) return null;
  let page = pages.get(entry.slug);
  if (!page) {
    page = lazy(load);
    pages.set(entry.slug, page);
  }
  return page;
}

export default function DocsLayout({ slug }: { slug: string }) {
  const entry = docFor(slug);
  return (
    <>
      <div className="mx-auto flex max-w-docs gap-12 px-gutter">
        <aside className="sticky top-14 hidden h-sidebar w-56 shrink-0 overflow-y-auto py-10 pr-1 scrollbar-subtle lg:block">
          <DocsNav current={slug} />
        </aside>
        <main id="main" className="min-w-0 flex-1 pt-8 pb-section lg:pt-14">
          <PhoneNav current={slug} />
          {entry ? (
            <DocPage key={entry.slug} entry={entry} />
          ) : (
            <NotFound slug={slug} />
          )}
        </main>
      </div>
      <PromptProvider />
    </>
  );
}

/** On a phone: a button that opens the component list in a drawer. */
function PhoneNav({ current }: { current: string }) {
  const prompt = usePrompt();
  function open() {
    void prompt.open({
      type: 'drawer',
      direction: 'left',
      title: 'Components',
      content: (close) => (
        <DocsNav current={current} onNavigate={() => close()} />
      ),
    });
  }
  return (
    <Button variant="outline" onClick={open} className="mb-8 lg:hidden">
      <PanelLeftIcon data-icon="inline-start" strokeWidth={1.5} aria-hidden />
      Components
    </Button>
  );
}

type Heading = { id: string; title: string };

function DocPage({ entry }: { entry: DocEntry }) {
  const Page = pageFor(entry);
  const [headings, setHeadings] = useState<Heading[]>([]);
  const [active, setActive] = useState<string>();

  /**
   * Reads the page's parts once its code has loaded (this element mounts
   * with the page, inside the Suspense), and marks the part on screen.
   */
  // One function for the page's life: a new one each render would run it
  // again, and its setState would render again.
  const watchHeadings = useCallback(function watch(
    element: HTMLDivElement | null,
  ) {
    if (!element) return;
    const found = [...element.querySelectorAll('section > div > h2[id]')];
    setHeadings(
      found.map((heading) => ({
        id: heading.id,
        title: heading.textContent ?? '',
      })),
    );
    const observer = new IntersectionObserver(
      (records) => {
        const visible = records.find((record) => record.isIntersecting);
        if (visible) setActive(visible.target.id);
      },
      // The top of the window under the header (h-14). rootMargin takes px
      // or %, not a CSS variable.
      { rootMargin: '-56px 0px -70% 0px' }, // design-ok
    );
    for (const heading of found) observer.observe(heading);
    return () => observer.disconnect();
  }, []);

  return (
    <div className="flex gap-12">
      <article className="flex min-w-0 flex-1 flex-col">
        <p className="text-sm text-muted">{entry.group}</p>
        <h1 className="mt-2 text-title font-semibold text-balance text-foreground">
          {entry.name}
        </h1>
        <p className="mt-6 max-w-2xl text-lede text-pretty text-muted">
          {entry.description}
        </p>
        <div className="mt-8 flex flex-wrap items-center gap-x-4 gap-y-3">
          <div className="w-full sm:w-auto sm:min-w-80">
            <ImportLine code={importLine(entry)} />
          </div>
          <a
            href={sourceUrl(`${entry.file}.tsx`)}
            className="rounded-sm text-sm text-foreground underline-offset-4 hover:underline focus-visible:focus-ring"
          >
            Source
          </a>
          <a
            href={DESIGN_URL}
            className="rounded-sm text-sm text-foreground underline-offset-4 hover:underline focus-visible:focus-ring"
          >
            Design rules
          </a>
        </div>
        {Page ? (
          <Suspense fallback={<PageSkeleton />}>
            <div ref={watchHeadings}>
              <Page />
            </div>
          </Suspense>
        ) : (
          <p className="mt-14 max-w-2xl text-pretty text-muted">
            This page is not written yet. Its source file has the props and the
            notes on how it behaves.
          </p>
        )}
        <PrevNext slug={entry.slug} />
      </article>
      <Outline headings={headings} active={active ?? headings[0]?.id} />
    </div>
  );
}

/** On a wide screen: the page's parts, beside it, the one on screen marked. */
function Outline({
  headings,
  active,
}: {
  headings: Heading[];
  active?: string;
}) {
  return (
    <aside className="sticky top-14 hidden h-sidebar w-52 shrink-0 overflow-y-auto pt-14 pb-10 scrollbar-subtle xl:block">
      {headings.length > 0 && (
        <nav aria-label="On this page" className="flex flex-col gap-3">
          <p className="text-sm font-medium text-foreground">On this page</p>
          <ul className="flex flex-col gap-1 border-l">
            {headings.map((heading) => (
              <li key={heading.id}>
                <a
                  href={`#${heading.id}`}
                  aria-current={heading.id === active ? 'location' : undefined}
                  className={cn(
                    '-ml-px block border-l py-1 pl-3 text-sm focus-visible:focus-ring',
                    heading.id === active
                      ? 'border-foreground text-foreground'
                      : 'border-transparent text-muted hover:text-foreground',
                  )}
                >
                  {heading.title}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      )}
    </aside>
  );
}

/** A page's place while its code loads: a frame the size of an example. */
function PageSkeleton() {
  return (
    <div className="flex flex-col gap-4 pt-14" aria-hidden>
      <Skeleton className="h-6 w-32" />
      <Skeleton className="h-9 w-40" />
      <Skeleton className="h-48 w-full rounded-xl" />
    </div>
  );
}

/** The pages before and after this one, in the sidebar's order. */
function PrevNext({ slug }: { slug: string }) {
  const index = DOCS.findIndex((entry) => entry.slug === slug);
  const previous = DOCS[index - 1];
  const next = DOCS[index + 1];
  return (
    <nav
      aria-label="Previous and next"
      className="mt-20 flex items-center justify-between gap-4 border-t pt-6"
    >
      {previous ? (
        <Button
          variant="ghost"
          render={
            <Link
              to={`/docs/${previous.slug}`}
              onPreload={() => void previous.load?.()}
            />
          }
          nativeButton={false}
        >
          <ChevronLeftIcon
            data-icon="inline-start"
            strokeWidth={1.5}
            aria-hidden
          />
          {previous.name}
        </Button>
      ) : (
        <span />
      )}
      {next && (
        <Button
          variant="ghost"
          render={
            <Link
              to={`/docs/${next.slug}`}
              onPreload={() => void next.load?.()}
            />
          }
          nativeButton={false}
        >
          {next.name}
          <ChevronRightIcon
            data-icon="inline-end"
            strokeWidth={1.5}
            aria-hidden
          />
        </Button>
      )}
    </nav>
  );
}

function NotFound({ slug }: { slug: string }) {
  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-title font-semibold text-foreground">Not found</h1>
      <p className="max-w-xl text-lede text-pretty text-muted">
        There is no component called “{slug}”. Pick one from the list, or search
        for it.
      </p>
    </div>
  );
}
