import { Button } from 'omuk-ui/button';
import { usePrompt } from 'omuk-ui/prompt';
import { Playground } from '../../playground';

type Values = {
  title: string;
  description: string;
  actionLabel: string;
  cancelLabel: string;
  destructive: boolean;
};

const INITIAL: Values = {
  title: 'Discard the draft?',
  description: 'The changes since the last save are lost.',
  actionLabel: 'Discard',
  cancelLabel: 'Cancel',
  destructive: false,
};

/** A string as JavaScript source, in single quotes. */
function quote(text: string) {
  return `'${text.replaceAll('\\', '\\\\').replaceAll("'", "\\'")}'`;
}

function Preview({ values }: { values: Values }) {
  const prompt = usePrompt();

  function ask() {
    void prompt.open({ type: 'alert', ...values });
  }

  return (
    <Button variant="outline" onClick={ask}>
      Open the alert
    </Button>
  );
}

function code(values: Values) {
  const lines = [
    `type: 'alert'`,
    `title: ${quote(values.title)}`,
    `description: ${quote(values.description)}`,
    `actionLabel: ${quote(values.actionLabel)}`,
  ];
  if (values.cancelLabel !== INITIAL.cancelLabel) {
    lines.push(`cancelLabel: ${quote(values.cancelLabel)}`);
  }
  if (values.destructive) lines.push('destructive: true');
  return `import { usePrompt } from 'omuk-ui/prompt';

const prompt = usePrompt();

const yes = await prompt.open({
${lines.map((line) => `  ${line},`).join('\n')}
});`;
}

export default function PromptPlayground() {
  return (
    <Playground
      initial={INITIAL}
      controls={[
        { name: 'title', kind: 'text' },
        { name: 'description', kind: 'text' },
        { name: 'actionLabel', kind: 'text' },
        { name: 'cancelLabel', kind: 'text' },
        { name: 'destructive', kind: 'boolean' },
      ]}
      render={(values) => <Preview values={values} />}
      code={code}
    />
  );
}
