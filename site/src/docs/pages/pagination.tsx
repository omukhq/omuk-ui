import { DocSection, Example, KeysTable, Notes, PropsTable } from '../blocks';
import Pages from '../examples/pagination/pages';
import pagesSource from '../examples/pagination/pages.tsx?raw';
import PaginationPlayground from '../examples/pagination/playground';
import Range from '../examples/pagination/range';
import rangeSource from '../examples/pagination/range.tsx?raw';

export default function PaginationPage() {
  return (
    <>
      <DocSection
        title="Playground"
        description="Change the props on the right. The pagination and its code follow."
      >
        <PaginationPlayground />
      </DocSection>
      <DocSection
        title="Pages"
        description="Previous, the first page, the current page and its neighbours, the last page, and next. The current page has the outline and says so to a screen reader; a gap shows as an ellipsis."
      >
        <Example source={pagesSource}>
          <Pages />
        </Example>
      </DocSection>
      <DocSection
        title="Previous and next with a range"
        description="Under a table, say which rows show on the left and put the arrows on the right. The arrows turn off at the ends."
      >
        <Example source={rangeSource} align="start">
          <Range />
        </Example>
      </DocSection>
      <DocSection
        title="Props"
        description="Pagination is the <nav>; PaginationContent the list; PaginationItem one entry in it. The links are anchors: give each one an href, or a router link through its props."
      >
        <PropsTable
          rows={[
            {
              name: 'isActive',
              type: 'boolean',
              default: 'false',
              description:
                'PaginationLink: the current page. It gets the outline, semibold text and aria-current="page".',
            },
            {
              name: 'disabled',
              type: 'boolean',
              default: 'false',
              description:
                'PaginationLink, PaginationPrevious, PaginationNext: muted and out of the Tab order, for an arrow at the end.',
            },
            {
              name: 'size',
              type: "'icon' | 'icon-sm' | 'sm' | …",
              default: "'icon'",
              description:
                'PaginationLink: the button size. Each page is a square by default.',
            },
            {
              name: 'text',
              type: 'string',
              default: "'Previous' | 'Next'",
              description:
                'PaginationPrevious, PaginationNext: the hidden text beside the arrow.',
            },
            {
              name: 'href',
              type: 'string',
              description:
                'PaginationLink, PaginationPrevious, PaginationNext: where the link goes. All the props of an <a> pass through.',
            },
          ]}
        />
      </DocSection>
      <DocSection title="Keyboard">
        <KeysTable
          rows={[
            ['Tab', 'Moves through the links that are on.'],
            ['Enter + Space', 'Goes to the page.'],
          ]}
        />
      </DocSection>
      <DocSection title="Notes">
        <Notes
          items={[
            'The links are real links: keep the page in the URL, so a reload or a shared link shows the same page.',
            'The arrows at the ends go muted, never faded, and leave the Tab order.',
            'An onClick goes on the link itself, so it still runs on a disabled arrow: check the page in the handler, as the examples do.',
          ]}
        />
      </DocSection>
    </>
  );
}
