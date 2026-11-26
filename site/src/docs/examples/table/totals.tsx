import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from 'omuk-ui/table';

const USAGE = [
  { service: 'Web app', requests: 1284330, errors: 212 },
  { service: 'Public API', requests: 902118, errors: 1045 },
  { service: 'Webhooks', requests: 48210, errors: 3 },
];

const count = new Intl.NumberFormat('en-US');

export default function TableTotals() {
  const requests = USAGE.reduce((sum, row) => sum + row.requests, 0);
  const errors = USAGE.reduce((sum, row) => sum + row.errors, 0);
  return (
    <Table containerClassName="rounded-lg inset-ring inset-ring-border">
      <TableCaption className="mb-4">Requests in November 2026.</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead className="pl-4">Service</TableHead>
          <TableHead className="text-right">Requests</TableHead>
          <TableHead className="pr-4 text-right">Errors</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {USAGE.map((row) => (
          <TableRow key={row.service}>
            <TableCell className="pl-4">{row.service}</TableCell>
            <TableCell className="text-right font-mono text-xs tabular-nums">
              {count.format(row.requests)}
            </TableCell>
            <TableCell className="pr-4 text-right font-mono text-xs tabular-nums">
              {count.format(row.errors)}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
      <TableFooter>
        <TableRow>
          <TableCell className="pl-4">Total</TableCell>
          <TableCell className="text-right font-mono text-xs tabular-nums">
            {count.format(requests)}
          </TableCell>
          <TableCell className="pr-4 text-right font-mono text-xs tabular-nums">
            {count.format(errors)}
          </TableCell>
        </TableRow>
      </TableFooter>
    </Table>
  );
}
