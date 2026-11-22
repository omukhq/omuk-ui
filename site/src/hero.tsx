import { Button } from '@omuk/ui/button';
import { CopyButton } from './copy-button';
import { INSTALL_LINE, REPO_URL, VERSION } from './links';
import { SizeDemo } from './size-demo';

/**
 * The first screen: what it is, the install line, where the code is, and
 * the first promise, live: two Save buttons, one that grows and one that
 * keeps its size.
 */
export function Hero() {
  return (
    <section
      aria-labelledby="hero-title"
      className="mx-auto grid max-w-5xl items-center gap-12 px-4 pt-12 pb-16 sm:px-6 sm:pt-20 lg:grid-cols-2"
    >
      <div className="flex min-w-0 flex-col gap-6">
        <div className="flex flex-col gap-3">
          <h1
            id="hero-title"
            className="text-2xl font-semibold text-foreground"
          >
            Omuk UI
          </h1>
          <p className="text-xl text-balance text-foreground">
            React 19 components and design tokens for Tailwind CSS 4.
          </p>
        </div>
        <p className="text-base text-pretty text-muted">
          Forms, dialogs, menus, tables, date pickers and toasts, in light and
          dark mode. Each component is its own import, so your app loads only
          what it uses.
        </p>
        <div className="flex items-center gap-2 rounded-lg bg-panel py-1 pr-1 pl-4">
          <code className="min-w-0 flex-1 truncate font-mono text-xs text-foreground">
            {INSTALL_LINE}
          </code>
          <CopyButton text={INSTALL_LINE} label="Copy the install command" />
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Button size="lg" render={<a href="#install" />} nativeButton={false}>
            Get started
          </Button>
          <Button
            size="lg"
            variant="outline"
            render={<a href={REPO_URL} />}
            nativeButton={false}
          >
            View on GitHub
          </Button>
          <p className="text-xs text-muted sm:ml-2">
            MIT license. Version {VERSION}.
          </p>
        </div>
      </div>
      <SizeDemo />
    </section>
  );
}
