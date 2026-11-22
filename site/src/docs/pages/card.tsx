import { DocSection, Example, Notes, PropsTable } from '../blocks';
import Settings from '../examples/card/settings';
import settingsSource from '../examples/card/settings.tsx?raw';
import Stats from '../examples/card/stats';
import statsSource from '../examples/card/stats.tsx?raw';

export default function CardPage() {
  return (
    <>
      <DocSection
        title="A header, content and a footer"
        description="A settings group: the title and what it changes, the field, and the actions. A footer with border-t keeps a gap to its line."
      >
        <Example source={settingsSource}>
          <Settings />
        </Example>
      </DocSection>
      <DocSection
        title="Dashboard tiles"
        description="CardAction puts something small at the header’s right end: a period, a menu button. The value is large, with tabular digits; the change says in words what it is compared with."
      >
        <Example source={statsSource} align="start">
          <Stats />
        </Example>
      </DocSection>
      <DocSection
        title="Props"
        description="Card holds CardHeader (with CardTitle, CardDescription and CardAction), CardContent and CardFooter. Each takes every prop of a <div>."
      >
        <PropsTable
          rows={[
            {
              name: 'size',
              type: "'default' | 'sm'",
              default: "'default'",
              description:
                'Card: the padding and the gap between the parts, 16 or 12.',
            },
            {
              name: 'className',
              type: 'string',
              description:
                'CardHeader and CardFooter: border-b on the header or border-t on the footer draws a line, with a gap to the next part.',
            },
          ]}
        />
      </DocSection>
      <DocSection title="Notes">
        <Notes
          items={[
            'The card pads itself, so its parts have no padding of their own. Do not add padding to CardContent.',
            'A card is raised: it reads on the page and on the panel colour, in light and dark mode.',
            'CardTitle is a <div>. When a card heads a part of the page, put a heading inside it, such as an <h2>, so a screen reader can jump to it.',
          ]}
        />
      </DocSection>
    </>
  );
}
