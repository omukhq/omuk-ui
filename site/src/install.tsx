import { CodeBlock } from './code-block';
import { INSTALL_LINE, TAG } from './links';
import { Section } from './section';

const STYLES = `@import "tailwindcss";
@import "../node_modules/@omuk/ui/src/design/theme.css";
@import "../node_modules/@omuk/ui/src/design/fonts.css";
@source "../node_modules/@omuk/ui/src";`;

const USE = `import { Button } from '@omuk/ui/button';

<Button isLoading={saving} loadingLabel="Saving" onClick={save}>
  Save
</Button>`;

const PROMPT = `import { usePrompt } from '@omuk/ui/prompt';

const prompt = usePrompt();
const ok = await prompt.open({
  type: 'alert',
  title: 'Delete the team?',
  description: 'It cannot be undone.',
  actionLabel: 'Delete',
  destructive: true,
});`;

const STEPS = [
  {
    title: 'Install from GitHub, with an exact tag',
    text: 'A tag never moves. Do not install @omuk/ui by name from npm: that scope is not ours. Peer dependencies: React 19, React DOM 19 and Tailwind CSS 4.',
    code: `${INSTALL_LINE}\n\n# or in package.json\n"@omuk/ui": "github:omukhq/omuk-ui#${TAG}"`,
    label: 'Copy the install command',
  },
  {
    title: 'Load the tokens and the fonts',
    text: 'In your main stylesheet. The paths are relative to it. The fonts come from your own domain, and a browser downloads a face only when the page uses it.',
    code: STYLES,
    label: 'Copy the stylesheet lines',
  },
  {
    title: 'Import each component from its own path',
    text: 'There is no index file, so a page loads only the components it uses.',
    code: USE,
    label: 'Copy the example',
  },
  {
    title: 'Open dialogs from code',
    text: 'Put one <PromptProvider /> in the app. A prompt gives its answer as a promise.',
    code: PROMPT,
    label: 'Copy the example',
  },
];

export function Install() {
  return (
    <Section
      id="install"
      title="Install and use"
      description="Four steps from an empty Vite, Astro or Next.js app to a button that keeps its size."
    >
      <ol className="flex flex-col">
        {STEPS.map((step, index) => (
          <li
            key={step.title}
            className="grid gap-4 border-t py-6 md:grid-cols-5 md:gap-8"
          >
            <div className="flex gap-4 md:col-span-2">
              <span className="w-4 shrink-0 font-semibold text-muted tabular-nums">
                {index + 1}
              </span>
              <div className="flex flex-col gap-1">
                <h3 className="font-semibold text-foreground">{step.title}</h3>
                <p className="text-pretty text-muted">{step.text}</p>
              </div>
            </div>
            <div className="min-w-0 md:col-span-3">
              <CodeBlock code={step.code} label={step.label} />
            </div>
          </li>
        ))}
      </ol>
    </Section>
  );
}
