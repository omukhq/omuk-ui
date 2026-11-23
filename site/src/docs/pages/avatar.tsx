import { DocSection, Example, Notes, PropsTable } from '../blocks';
import Kinds from '../examples/avatar/kinds';
import kindsSource from '../examples/avatar/kinds.tsx?raw';
import AvatarPlayground from '../examples/avatar/playground';
import Sizes from '../examples/avatar/sizes';
import sizesSource from '../examples/avatar/sizes.tsx?raw';
import Stack from '../examples/avatar/stack';
import stackSource from '../examples/avatar/stack.tsx?raw';

export default function AvatarPage() {
  return (
    <>
      <DocSection
        title="Playground"
        description="Change the props on the right. The avatar and its code follow."
      >
        <AvatarPlayground />
      </DocSection>
      <DocSection
        title="People, apps and teams"
        description="A person is round; an app and a team are square. Without a picture, a person shows their initials on a colour picked from their userId, so the same person has the same colour everywhere."
      >
        <Example source={kindsSource}>
          <Kinds />
        </Example>
      </DocSection>
      <DocSection
        title="Sizes"
        description="16, 24, 32, 40 and 48. The smallest holds one letter: it shows the first of the initials."
      >
        <Example source={sizesSource}>
          <Sizes />
        </Example>
      </DocSection>
      <DocSection
        title="A stack with a count"
        description="AvatarStack lays each avatar over the last, with a ring in the page colour between them. AvatarCount ends the stack with how many more there are."
      >
        <Example source={stackSource}>
          <Stack />
        </Example>
      </DocSection>
      <DocSection
        title="Props"
        description="Avatar, AvatarCount and AvatarStack each take every prop of a <span>."
      >
        <PropsTable
          rows={[
            {
              name: 'kind',
              type: "'person' | 'app' | 'team'",
              default: "'person'",
              description:
                'Avatar: round for a person; square for an app (on the page colour, with an edge) and a team.',
            },
            {
              name: 'size',
              type: "'sm' | 'md' | 'lg' | 'xl' | '2xl'",
              default: "'md'",
              description:
                'Avatar and AvatarCount: 16, 24, 32, 40 or 48. Use the same size for every avatar in a stack.',
            },
            {
              name: 'src',
              type: 'string | null',
              description:
                'Avatar: a picture. The children (initials, a logo) show when there is none.',
            },
            {
              name: 'userId',
              type: 'string | null',
              description:
                'Avatar: a person’s ID. Picks one of six colours for a person without a picture.',
            },
            {
              name: 'color',
              type: 'string | null',
              description:
                'Avatar: a team’s colour as saved in its settings. It is data, applied inline, with white text.',
            },
            {
              name: 'count',
              type: 'number',
              description:
                'AvatarCount, required: how many more people there are. It shows as +3.',
            },
          ]}
        />
      </DocSection>
      <DocSection title="Notes">
        <Notes
          items={[
            'The picture has an empty alt: say who it is in the text beside it, or in a title or a label on the row.',
            'Without userId, a person’s avatar takes the primary fill. Pass the ID, not the name, so a change of name keeps the colour.',
            'Show three or four people in a stack, and put the rest in the count.',
          ]}
        />
      </DocSection>
    </>
  );
}
