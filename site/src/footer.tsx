import { cn } from '@omuk/ui/utils';
import {
  CHANGELOG_URL,
  DESIGN_URL,
  LICENSE_URL,
  REPO_URL,
  VERSION,
} from './links';
import { usePath } from './router';

const LINKS = [
  { label: 'Source', href: REPO_URL },
  { label: 'Design rules', href: DESIGN_URL },
  { label: 'Changelog', href: CHANGELOG_URL },
  { label: 'MIT license', href: LICENSE_URL },
];

export function Footer() {
  const inDocs = usePath().startsWith('/docs');
  return (
    <footer className="border-t">
      <div
        className={cn(
          'mx-auto flex flex-col gap-6 px-gutter py-12 sm:flex-row sm:items-end sm:justify-between',
          inDocs ? 'max-w-docs' : 'max-w-site',
        )}
      >
        <div className="flex flex-col gap-1">
          <p className="font-semibold text-foreground">Omuk UI</p>
          <p className="text-sm text-muted">
            A personal project. Version {VERSION}, free under the MIT license.
          </p>
        </div>
        <nav aria-label="Links" className="flex flex-wrap gap-x-6 gap-y-2">
          {LINKS.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="rounded-sm text-sm text-foreground underline-offset-4 hover:underline focus-visible:focus-ring"
            >
              {link.label}
            </a>
          ))}
        </nav>
      </div>
    </footer>
  );
}
