import { DocSection, Example, Notes, PropsTable } from '../blocks';
import Outline from '../examples/list-row/outline';
import outlineSource from '../examples/list-row/outline.tsx?raw';
import Sidebar from '../examples/list-row/sidebar';
import sidebarSource from '../examples/list-row/sidebar.tsx?raw';

export default function ListRowPage() {
  return (
    <>
      <DocSection
        title="A sidebar"
        description="An icon, a name and a count. The current row takes the selected tint at medium weight, and its icon the text colour. ListRowMeta puts small muted text at the row’s end."
      >
        <Example source={sidebarSource}>
          <Sidebar />
        </Example>
      </DocSection>
      <DocSection
        title="Links in a tree"
        description="render draws the row as a link. level steps the content in by 16 for each level, while the fill keeps the row’s full width."
      >
        <Example source={outlineSource}>
          <Outline />
        </Example>
      </DocSection>
      <DocSection
        title="Props"
        description="ListRow takes every prop of a <button>; ListRowMeta every prop of a <span>."
      >
        <PropsTable
          rows={[
            {
              name: 'current',
              type: 'boolean',
              default: 'false',
              description:
                'ListRow: where you are, such as the open page. Sets aria-current="page" and the selected tint.',
            },
            {
              name: 'level',
              type: 'number',
              default: '0',
              description:
                'ListRow: how deep in a tree the row is, from 0 at the top. Steps in up to level 4.',
            },
            {
              name: 'render',
              type: 'ReactElement',
              description:
                'ListRow: draws the row as this element, such as a link or a router link. Without it, the row is a <button>.',
            },
            {
              name: 'disabled',
              type: 'boolean',
              default: 'false',
              description:
                'ListRow: turns a button row off. Its text goes muted.',
            },
          ]}
        />
      </DocSection>
      <DocSection title="Notes">
        <Notes
          items={[
            'A row is 32 tall. Put rows in a <nav> with an aria-label when they move between pages.',
            'Mark one row as current at most. The tint is flat: no shadow and no bar.',
            'Wrap a long name in a span with truncate, so it ends in an ellipsis and the count stays in view.',
          ]}
        />
      </DocSection>
    </>
  );
}
