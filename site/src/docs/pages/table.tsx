import { DocSection, Example, Notes, PropsTable } from '../blocks';
import Invoices from '../examples/table/invoices';
import invoicesSource from '../examples/table/invoices.tsx?raw';
import Totals from '../examples/table/totals';
import totalsSource from '../examples/table/totals.tsx?raw';

export default function TablePage() {
  return (
    <>
      <DocSection
        title="Rows with an action"
        description="Numbers sit on the right, in mono at the extra-small size, so the digits line up. A row’s actions go in a menu behind an extra-small ghost button at the row’s end."
      >
        <Example source={invoicesSource} align="start">
          <Invoices />
        </Example>
      </DocSection>
      <DocSection
        title="A footer and a caption"
        description="TableFooter holds the totals on the panel fill. TableCaption says what the table shows; it sits under the table."
      >
        <Example source={totalsSource} align="start">
          <Totals />
        </Example>
      </DocSection>
      <DocSection
        title="Props"
        description="The parts are the table’s own elements: Table, TableHeader, TableBody, TableFooter, TableRow, TableHead, TableCell and TableCaption. Each takes the props of its element."
      >
        <PropsTable
          rows={[
            {
              name: 'containerClassName',
              type: 'string',
              description:
                'Table: classes for the box that scrolls around the table, such as a frame and a radius. className goes on the <table>.',
            },
            {
              name: 'data-selected',
              type: 'boolean',
              description:
                'TableRow: marks a picked row with the selected fill. A row with an open menu in it takes the hover fill.',
            },
            {
              name: 'className',
              type: 'string',
              description:
                'TableHead and TableCell: text-right for numbers, w-0 for a column as narrow as its content.',
            },
          ]}
        />
      </DocSection>
      <DocSection title="Notes">
        <Notes
          items={[
            'The header row is 36 tall and the body rows 48. The lines between rows are drawn on the cells, so they never change a row’s height.',
            'A wide table scrolls sideways inside its box; the page does not.',
            'For a list that people search, sort and page through, build on these parts and on Pagination, and let the server do the work.',
          ]}
        />
      </DocSection>
    </>
  );
}
