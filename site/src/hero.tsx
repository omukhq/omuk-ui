import { Button } from '@omuk/ui/button';
import { CopyButton } from './copy-button';
import { INSTALL_LINE, REPO_URL, VERSION } from './links';
import { SizeDemo } from './size-demo';

/**
 * The first screen: the claim, set large; what it is in one sentence; the
 * install line; then the claim proven on a spec drawing.
 */
export function Hero() {
  return (
    <section
      aria-labelledby="hero-title"
      className="mx-auto max-w-site px-gutter pt-16 pb-section md:pt-28"
    >
      <h1
        id="hero-title"
        className="text-display font-semibold text-balance text-foreground"
      >
        Nothing jumps.
      </h1>
      <div className="mt-10 grid gap-10 md:mt-14 md:grid-cols-12">
        <p className="text-lede text-pretty text-muted md:col-span-6">
          Omuk UI is my React 19 component kit for Tailwind CSS 4, built for
          speed. Nothing moves while it loads, every size is a token, and each
          component is its own import.
        </p>
        <div className="flex flex-col gap-3 md:col-span-5 md:col-start-8 md:self-end">
          <div className="flex items-center gap-2 rounded-lg py-1 pr-1 pl-4 inset-ring inset-ring-border">
            <code className="min-w-0 flex-1 truncate font-mono text-xs text-foreground">
              {INSTALL_LINE}
            </code>
            <CopyButton text={INSTALL_LINE} label="Copy the install command" />
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <Button
              size="lg"
              render={<a href="#install" />}
              nativeButton={false}
            >
              Install
            </Button>
            <Button
              size="lg"
              variant="ghost"
              render={<a href={REPO_URL} />}
              nativeButton={false}
            >
              Read the source
            </Button>
            <p className="ml-auto text-xs text-muted">MIT, version {VERSION}</p>
          </div>
        </div>
      </div>
      <div className="mt-16 md:mt-20">
        <SizeDemo />
      </div>
    </section>
  );
}
