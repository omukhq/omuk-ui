import { Section } from './section';

const PROMISES = [
  {
    title: 'Nothing jumps.',
    text: 'A loading button keeps its exact size: the spinner sits where the label was. A dialog stays open while its action runs, and shows the error there if it fails.',
  },
  {
    title: 'No number by hand.',
    text: 'Every colour, size, radius and space is a named token. A test fails the moment a component writes a raw pixel or hex value. Dark mode, or a new brand colour, is one file.',
  },
  {
    title: 'A page pays only for what it shows.',
    text: 'There is no index file. @omuk/ui/button is the button and nothing else, so a sign-in page never downloads a date picker.',
  },
  {
    title: 'Ours all the way down.',
    text: 'No headless library underneath and no second layer of class names. When something is wrong, it is our bug, and we can fix it the same day.',
  },
  {
    title: 'Your build, not ours.',
    text: 'The package is TypeScript source. Your bundler compiles it with your app, so there is no second build to keep in step, and you can read every line you ship.',
  },
];

/** The story, the live Save button, and the five promises. */
export function Why() {
  return (
    <Section id="why" title="Why we built it">
      <div className="grid items-start gap-12 lg:grid-cols-2">
        <div className="flex flex-col gap-4 text-base text-foreground">
          <p>
            You press Save. The label turns into “Saving…”, the button gets
            wider, and the button next to it shifts. Nobody files a bug about
            it. But you feel it, every time.
          </p>
          <p className="text-muted">
            We kept finding small moments like that in our own apps. Each one
            was easy to fix once. The trouble was fixing it again in the next
            app, and the next. So we built one place where the fix lives.
          </p>
          <p className="text-muted">
            It runs our apps in production. We made it public, under the MIT
            license, so that your buttons stop jumping too.
          </p>
          <p className="text-muted">
            The two Save buttons{' '}
            <a
              href="#top"
              className="rounded-sm text-accent underline-offset-4 hover:underline focus-visible:focus-ring"
            >
              at the top of the page
            </a>{' '}
            show the first promise. Press one, or keep both loading.
          </p>
        </div>
        <div className="flex flex-col gap-2">
          <h3 className="text-lg font-semibold text-foreground">
            Five promises
          </h3>
          <p className="text-muted">
            Every component keeps them, and a test checks most of them.
          </p>
          <ol className="mt-2 flex flex-col">
            {PROMISES.map((promise, index) => (
              <li
                key={promise.title}
                className="flex gap-4 border-t py-4 text-sm"
              >
                <span className="w-4 shrink-0 font-semibold text-muted tabular-nums">
                  {index + 1}
                </span>
                <p className="text-pretty">
                  <span className="font-semibold text-foreground">
                    {promise.title}
                  </span>{' '}
                  <span className="text-muted">{promise.text}</span>
                </p>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </Section>
  );
}
