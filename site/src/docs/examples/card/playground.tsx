import { Button } from '@omuk/ui/button';
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@omuk/ui/card';
import { Playground } from '../../playground';

const SIZES = ['md', 'sm'] as const;

type Values = {
  size: (typeof SIZES)[number];
  title: string;
  description: string;
  action: string;
  footer: boolean;
};

const INITIAL: Values = {
  size: 'md',
  title: 'Monthly report',
  description: 'Sent to the team on the first of each month.',
  action: 'Weekly',
  footer: true,
};

const BODY = 'The next report goes out on 1 December, at 09:00.';

function code({ size, title, description, action, footer }: Values) {
  const parts = ['Card'];
  if (action) parts.push('CardAction');
  parts.push('CardContent');
  if (description) parts.push('CardDescription');
  if (footer) parts.push('CardFooter');
  parts.push('CardHeader', 'CardTitle');
  const header = [
    `<CardTitle>${title}</CardTitle>`,
    description && `<CardDescription>${description}</CardDescription>`,
    action && `<CardAction>${action}</CardAction>`,
  ];
  const buttonImport = footer
    ? "import { Button } from '@omuk/ui/button';\n"
    : '';
  const footerPart = footer
    ? `
  <CardFooter className="justify-end gap-2 border-t">
    <Button variant="ghost">Skip</Button>
    <Button>Send now</Button>
  </CardFooter>`
    : '';
  return `${buttonImport}import {
  ${parts.join(',\n  ')},
} from '@omuk/ui/card';

<Card${size === 'sm' ? ' size="sm"' : ''} className="w-full max-w-md">
  <CardHeader>
    ${header.filter(Boolean).join('\n    ')}
  </CardHeader>
  <CardContent className="text-muted">${BODY}</CardContent>${footerPart}
</Card>`;
}

export default function CardPlayground() {
  return (
    <Playground
      align="start"
      initial={INITIAL}
      controls={[
        { name: 'size', kind: 'choice', options: SIZES },
        { name: 'title', kind: 'text' },
        { name: 'description', kind: 'text' },
        { name: 'action', kind: 'text' },
        { name: 'footer', kind: 'boolean' },
      ]}
      render={({ size, title, description, action, footer }) => (
        <Card size={size} className="w-full max-w-md">
          <CardHeader>
            <CardTitle>{title}</CardTitle>
            {description && <CardDescription>{description}</CardDescription>}
            {action && <CardAction>{action}</CardAction>}
          </CardHeader>
          <CardContent className="text-muted">{BODY}</CardContent>
          {footer && (
            <CardFooter className="justify-end gap-2 border-t">
              <Button variant="ghost">Skip</Button>
              <Button>Send now</Button>
            </CardFooter>
          )}
        </Card>
      )}
      code={code}
    />
  );
}
