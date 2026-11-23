import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from '@omuk/ui/table';
import { Playground } from '../../playground';

const INVOICES = [
  { id: 'INV-1042', customer: 'Northwind Trading', amount: 1250 },
  { id: 'INV-1043', customer: 'Contoso Ltd', amount: 830.5 },
  { id: 'INV-1044', customer: 'Fabrikam', amount: 12400 },
  { id: 'INV-1045', customer: 'Tailspin Toys', amount: 96 },
  { id: 'INV-1046', customer: 'Wide World Importers', amount: 2075 },
  { id: 'INV-1047', customer: 'Adventure Works', amount: 540 },
];

const money = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
});

/** The frame on the scroll box: a line and a radius. */
const FRAME = 'rounded-lg inset-ring inset-ring-border';

/** A money cell: on the right, in figures of one width. */
const AMOUNT = 'pr-4 text-right font-mono text-xs tabular-nums';

type Values = {
  rows: number;
  selected: number;
  framed: boolean;
  footer: boolean;
  caption: string;
};

const INITIAL: Values = {
  rows: 4,
  selected: 2,
  framed: true,
  footer: true,
  caption: '',
};

function Preview({ rows, selected, framed, footer, caption }: Values) {
  const shown = INVOICES.slice(0, rows);
  const total = shown.reduce((sum, invoice) => sum + invoice.amount, 0);
  return (
    <Table containerClassName={framed ? FRAME : undefined}>
      {caption && <TableCaption>{caption}</TableCaption>}
      <TableHeader>
        <TableRow>
          <TableHead className="pl-4">Invoice</TableHead>
          <TableHead>Customer</TableHead>
          <TableHead className="pr-4 text-right">Amount</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {shown.map((invoice, index) => (
          <TableRow
            key={invoice.id}
            data-selected={index + 1 === selected || undefined}
          >
            <TableCell className="pl-4 font-medium">{invoice.id}</TableCell>
            <TableCell>{invoice.customer}</TableCell>
            <TableCell className={AMOUNT}>
              {money.format(invoice.amount)}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
      {footer && (
        <TableFooter>
          <TableRow>
            <TableCell className="pl-4" colSpan={2}>
              Total
            </TableCell>
            <TableCell className={AMOUNT}>{money.format(total)}</TableCell>
          </TableRow>
        </TableFooter>
      )}
    </Table>
  );
}

function code({ rows, selected, framed, footer, caption }: Values) {
  const parts = ['Table', 'TableBody'];
  if (caption) parts.push('TableCaption');
  parts.push('TableCell');
  if (footer) parts.push('TableFooter');
  parts.push('TableHead', 'TableHeader', 'TableRow');
  const root = framed ? `<Table containerClassName="${FRAME}">` : '<Table>';
  const selectedRow =
    selected >= 1 && selected <= rows
      ? `\n        data-selected={index === ${selected - 1} || undefined}`
      : '';
  const captionPart = caption
    ? `\n  <TableCaption>${caption}</TableCaption>`
    : '';
  const footerPart = footer
    ? `
  <TableFooter>
    <TableRow>
      <TableCell className="pl-4" colSpan={2}>Total</TableCell>
      <TableCell className="${AMOUNT}">{money.format(total)}</TableCell>
    </TableRow>
  </TableFooter>`
    : '';
  return `import {
  ${parts.join(',\n  ')},
} from '@omuk/ui/table';

${root}${captionPart}
  <TableHeader>
    <TableRow>
      <TableHead className="pl-4">Invoice</TableHead>
      <TableHead>Customer</TableHead>
      <TableHead className="pr-4 text-right">Amount</TableHead>
    </TableRow>
  </TableHeader>
  <TableBody>
    {invoices.slice(0, ${rows}).map((invoice, index) => (
      <TableRow
        key={invoice.id}${selectedRow}
      >
        <TableCell className="pl-4 font-medium">{invoice.id}</TableCell>
        <TableCell>{invoice.customer}</TableCell>
        <TableCell className="${AMOUNT}">
          {money.format(invoice.amount)}
        </TableCell>
      </TableRow>
    ))}
  </TableBody>${footerPart}
</Table>`;
}

export default function TablePlayground() {
  return (
    <Playground
      align="start"
      initial={INITIAL}
      controls={[
        { name: 'rows', kind: 'number', min: 1, max: INVOICES.length },
        { name: 'selected', kind: 'number', min: 0, max: INVOICES.length },
        { name: 'framed', kind: 'boolean' },
        { name: 'footer', kind: 'boolean' },
        { name: 'caption', kind: 'text' },
      ]}
      render={(values) => <Preview {...values} />}
      code={code}
    />
  );
}
