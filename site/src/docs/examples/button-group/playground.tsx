import { Button } from 'omuk-ui/button';
import { ButtonGroup, ButtonGroupSeparator } from 'omuk-ui/button-group';
import { Fragment } from 'react';
import { Playground } from '../../playground';

const ORIENTATIONS = ['horizontal', 'vertical'] as const;
const VARIANTS = ['outline', 'default', 'ghost'] as const;
const LABELS = ['Copy', 'Download', 'Share', 'Print', 'Archive'];

type Values = {
  orientation: (typeof ORIENTATIONS)[number];
  variant: (typeof VARIANTS)[number];
  buttons: number;
  separators: boolean;
};

const INITIAL: Values = {
  orientation: 'horizontal',
  variant: 'outline',
  buttons: 3,
  separators: false,
};

/** The labels of the buttons shown, from 2 to 5. */
function labels(count: number) {
  return LABELS.slice(0, Math.min(Math.max(count, 2), LABELS.length));
}

function code({ orientation, variant, buttons, separators }: Values) {
  const open =
    orientation === 'horizontal'
      ? '<ButtonGroup aria-label="Report actions">'
      : `<ButtonGroup orientation="vertical" aria-label="Report actions">`;
  const button =
    variant === 'default' ? '<Button>' : `<Button variant="${variant}">`;
  const separator =
    orientation === 'horizontal'
      ? '<ButtonGroupSeparator />'
      : '<ButtonGroupSeparator orientation="horizontal" />';
  const rows = labels(buttons).flatMap((label, at) => [
    ...(separators && at > 0 ? [`  ${separator}`] : []),
    `  ${button}${label}</Button>`,
  ]);
  const parts = separators
    ? 'ButtonGroup, ButtonGroupSeparator'
    : 'ButtonGroup';
  return [
    "import { Button } from 'omuk-ui/button';",
    `import { ${parts} } from 'omuk-ui/button-group';`,
    '',
    open,
    ...rows,
    '</ButtonGroup>',
  ].join('\n');
}

export default function ButtonGroupPlayground() {
  return (
    <Playground
      initial={INITIAL}
      controls={[
        { name: 'orientation', kind: 'choice', options: ORIENTATIONS },
        { name: 'variant', kind: 'choice', options: VARIANTS },
        { name: 'buttons', kind: 'number', min: 2, max: 5 },
        { name: 'separators', kind: 'boolean' },
      ]}
      render={({ orientation, variant, buttons, separators }) => (
        <ButtonGroup orientation={orientation} aria-label="Report actions">
          {labels(buttons).map((label, at) => (
            <Fragment key={label}>
              {separators && at > 0 && (
                <ButtonGroupSeparator
                  orientation={
                    orientation === 'horizontal' ? 'vertical' : 'horizontal'
                  }
                />
              )}
              <Button variant={variant}>{label}</Button>
            </Fragment>
          ))}
        </ButtonGroup>
      )}
      code={code}
    />
  );
}
