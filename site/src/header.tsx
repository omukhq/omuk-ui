import { Button } from '@omuk/ui/button';
import { MoonIcon, SunIcon } from 'lucide-react';
import { REPO_URL, SECTIONS } from './links';
import { setTheme, useTheme } from './theme';

/** The bar at the top: the name, the sections, the theme and GitHub. */
export function Header() {
  const theme = useTheme();
  const next = theme === 'dark' ? 'light' : 'dark';
  return (
    <header className="sticky top-0 z-40 border-b bg-page">
      <div className="mx-auto flex h-14 max-w-5xl items-center gap-2 px-4 sm:px-6">
        <a
          href="#top"
          className="mr-auto rounded-md text-sm font-semibold text-foreground focus-visible:focus-ring"
        >
          Omuk UI
        </a>
        <nav aria-label="Sections" className="hidden items-center sm:flex">
          {SECTIONS.map((section) => (
            <Button
              key={section.id}
              variant="ghost"
              render={<a href={`#${section.id}`} />}
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
          GitHub
        </Button>
      </div>
    </header>
  );
}
