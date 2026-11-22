import { CHANGELOG_URL, LICENSE_URL, REPO_URL, VERSION } from './links';

const LINKS = [
  { label: 'GitHub', href: REPO_URL },
  { label: 'Changelog', href: CHANGELOG_URL },
  { label: 'MIT license', href: LICENSE_URL },
];

export function Footer() {
  return (
    <footer className="border-t bg-panel">
      <div className="mx-auto flex max-w-5xl flex-col gap-4 px-4 py-8 sm:flex-row sm:items-center sm:justify-between sm:px-6">
        <p className="text-sm text-muted">
          Omuk UI {VERSION}. Free to use under the MIT license.
        </p>
        <nav aria-label="Links" className="flex flex-wrap gap-4">
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
