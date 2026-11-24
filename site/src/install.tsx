import { CodeBlock } from './code-block';
import { INSTALL_LINE, TAG } from './links';
import { Section } from './section';

// Two ways in, each in steps from an empty app: the package (updates by
// version), or the `omuk` command, which copies one component at a time as
// files the app owns (cli/ in the kit). Both come from the same source.

const STYLES = `@import "tailwindcss";
@import "../node_modules/@omuk/ui/src/design/theme.css";
@import "../node_modules/@omuk/ui/src/design/fonts.css";
@source "../node_modules/@omuk/ui/src";`;

const USE = `import { Button } from '@omuk/ui/button';

<Button isLoading={saving} loadingLabel="Saving" onClick={save}>
  Save
</Button>`;

type Step = { title: string; text: string; code: string; label: string };

const PACKAGE_STEPS: Step[] = [
  {
    title: 'Add the package',
    text: 'From GitHub, at an exact tag: a tag never moves. It needs React 19, React DOM 19 and Tailwind CSS 4. The @omuk scope on npm is not mine.',
    code: `${INSTALL_LINE}\n\n# package.json\n"@omuk/ui": "github:omukhq/omuk-ui#${TAG}"`,
    label: 'Copy the install command',
  },
  {
    title: 'Load the tokens and fonts',
    text: 'In your main stylesheet; the paths are relative to it. The fonts come from your own domain, and a browser downloads a face only when a page uses it.',
    code: STYLES,
    label: 'Copy the stylesheet lines',
  },
  {
    title: 'Import what a page uses',
    text: 'Each component has its own path. There is no index file, so nothing else comes along.',
    code: USE,
    label: 'Copy the example',
  },
];

const CLI_STEPS: Step[] = [
  {
    title: 'Set up the folder',
    text: 'Writes omuk.json and copies the tokens and fonts into src/components/ui (or the folder you name with --dir). It prints the two lines for your stylesheet.',
    code: `npx @omukhq/cli init

# your main stylesheet, after @import "tailwindcss"
@import "./components/ui/design/theme.css";
@import "./components/ui/design/fonts.css";`,
    label: 'Copy the init command',
  },
  {
    title: 'Add a component',
    text: 'Copies the component and every file it imports, and installs its npm packages with your package manager. The files import each other by relative path: no alias to set up.',
    code: `npx @omukhq/cli add button dialog

import { Button } from './components/ui/button';`,
    label: 'Copy the add command',
  },
  {
    title: 'Change it, update it',
    text: 'The code is yours to change. Run add again for a newer version: omuk updates the files you did not change and keeps the ones you did. --overwrite replaces those too.',
    code: `npx @omukhq/cli list                  # what you have, and its version
npx @omukhq/cli add button --dry-run  # see the changes first`,
    label: 'Copy the update commands',
  },
];

/** A numbered list of steps: the text on the left, the code on the right. */
function Steps({ steps }: { steps: Step[] }) {
  return (
    <ol className="flex flex-col border-t">
      {steps.map((step, index) => (
        <li
          key={step.title}
          className="grid gap-6 border-b py-8 md:grid-cols-12 md:gap-8 md:py-10"
        >
          <div className="flex gap-6 md:col-span-5">
            <span className="font-mono text-xs text-muted tabular-nums md:pt-1.5">
              {index + 1}
            </span>
            <div className="flex flex-col gap-2">
              <h3 className="text-xl font-semibold text-foreground">
                {step.title}
              </h3>
              <p className="max-w-md text-pretty text-muted">{step.text}</p>
            </div>
          </div>
          <div className="min-w-0 md:col-span-7">
            <CodeBlock code={step.code} label={step.label} />
          </div>
        </li>
      ))}
    </ol>
  );
}

export function Install() {
  return (
    <Section
      id="install"
      title="Install"
      description="Works with Vite, Astro and Next.js: your bundler compiles the source with your app."
    >
      <Steps steps={PACKAGE_STEPS} />
      <div className="mt-16 flex flex-col gap-2 md:mt-20">
        <h3 id="install-cli" className="text-2xl font-semibold text-foreground">
          Or copy one component at a time
        </h3>
        <p className="max-w-2xl text-pretty text-muted">
          The omuk command puts a component in your app as source you own, as
          shadcn/ui does. Take the package for updates by version, the command
          to change the code. Both come from the same files.
        </p>
      </div>
      <div className="mt-8">
        <Steps steps={CLI_STEPS} />
      </div>
    </Section>
  );
}
