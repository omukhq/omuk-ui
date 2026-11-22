import { PartTitle } from './section';

// Why it exists: the moment that started it, set large; that it is a
// personal project about speed; then its five rules, each with the fact
// that backs it. The rules are not a sequence, so they are not numbered.

const RULES = [
  {
    title: 'No layout shift.',
    text: 'A loading button keeps its exact size. A dialog stays where it is while its action runs, and shows the error there. Fonts load from your own domain. The page does not move under the reader.',
    proof: ['Button at rest: 55 px', 'Button loading: 55 px'],
  },
  {
    title: 'A page pays only for what it shows.',
    text: 'There is no index file. Each component is its own import, and the heavy parts load when they are first used: the dialogs with the first prompt, the toaster with the first toast.',
    proof: [
      'Input: 0.5 kB',
      'Button: 2.2 kB',
      'Date picker: 12.2 kB',
      'gzip, React not counted',
    ],
  },
  {
    title: 'The browser does the work.',
    text: 'Dialogs are the browser’s own <dialog>, popovers its popover attribute. There is no headless library underneath, so there are fewer bytes, and when something is wrong it is my bug to fix.',
    proof: ['<dialog>', 'popover="manual"', 'popovertarget'],
  },
  {
    title: 'Every size is a token.',
    // design-ok: the next line names the values the test refuses; it is copy, not a style.
    text: 'Colours, sizes, radii and spacing have names, in one file. A test fails the moment a component writes 13px or #eee. Dark mode is the same file, with other values.', // design-ok
    proof: ['src/design/theme.css', 'src/tokens.test.ts'],
  },
  {
    title: 'Your build, not mine.',
    text: 'The package is TypeScript source. Your bundler compiles it and drops what you do not use, with the rest of your app. There is no second build, and you can read every line you ship.',
    proof: ['"./button": "./src/button.tsx"'],
  },
];

export function Why() {
  return (
    <section id="why" aria-labelledby="why-title" className="border-t">
      <div className="mx-auto max-w-site px-gutter py-section">
        <PartTitle id="why-title">Why I built it</PartTitle>
        <p className="mt-10 max-w-4xl text-story text-balance text-foreground md:mt-14">
          You press Save. The label turns into “Saving…”, the button grows, and
          the row beside it shifts. Nobody files a bug about it. But you feel
          it, every time.
        </p>
        <p className="mt-8 max-w-2xl text-lede text-pretty text-muted">
          Omuk UI is a personal project. I kept fixing the same small moments,
          and the same slow pages, in my own apps: Markpad, a secrets manager, a
          few dashboards. Now the fixes live in one place, and every component
          keeps five rules about speed.
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
