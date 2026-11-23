import { PartTitle } from './section';

// Why it exists: a personal project about speed, then its rules, each with
// the fact that backs it. The rules are not a sequence, so they are not
// numbered.

const RULES = [
  {
    title: 'A page pays only for what it shows.',
    text: 'There is no index file. Each component is its own import, and the heavy parts load when they are first used: the dialogs with the first prompt, the toaster with the first toast.',
    proof: ["import { Button } from '@omuk/ui/button'"],
  },
  {
    title: 'The browser does the work.',
    text: 'Dialogs are the browser’s own <dialog>, popovers its popover attribute. There is no headless library underneath, so there are fewer bytes, and when something is wrong it is my bug to fix.',
    proof: ['<dialog>', 'popover="manual"', 'popovertarget'],
  },
];

export function Why() {
  return (
    <section id="why" aria-labelledby="why-title" className="border-t">
      <div className="mx-auto max-w-site px-gutter py-section">
        <PartTitle id="why-title">Why I built it</PartTitle>
        <p className="mt-10 max-w-2xl text-lede text-pretty text-muted md:mt-14">
          Omuk UI is a personal project. I kept fixing the same small moments,
          and the same slow pages, in my own apps: Markpad, a secrets manager, a
          few dashboards. Now the fixes live in one place, and every component
          keeps two rules about speed.
        </p>
        <dl className="mt-16 border-t md:mt-24">
          {RULES.map((rule) => (
            <div
              key={rule.title}
              className="grid gap-3 border-b py-8 md:grid-cols-12 md:gap-8 md:py-10"
            >
              <dt className="text-xl font-semibold text-balance text-foreground md:col-span-4">
                {rule.title}
              </dt>
              <dd className="text-base text-pretty text-muted md:col-span-5">
                {rule.text}
              </dd>
              <dd className="flex flex-col gap-1 font-mono text-xs text-foreground md:col-span-3">
                {rule.proof.map((line) => (
                  <span key={line}>{line}</span>
                ))}
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
