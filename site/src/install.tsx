import { CodeBlock } from './code-block';
import { INSTALL_LINE, TAG } from './links';
import { Section } from './section';

// Three steps, in order: from an empty app to a button that keeps its size.

const STYLES = `@import "tailwindcss";
@import "../node_modules/@omuk/ui/src/design/theme.css";
@import "../node_modules/@omuk/ui/src/design/fonts.css";
@source "../node_modules/@omuk/ui/src";`;

const USE = `import { Button } from '@omuk/ui/button';

<Button isLoading={saving} loadingLabel="Saving" onClick={save}>
  Save
</Button>`;

const STEPS = [
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

export function Install() {
  return (
    <Section
      id="install"
      title="Install"
      description="Works with Vite, Astro and Next.js: your bundler compiles the source with your app."
    >
      <ol className="flex flex-col border-t">
        {STEPS.map((step, index) => (
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
    </Section>
  );
}
