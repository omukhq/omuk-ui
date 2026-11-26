import { MoreHorizontalIcon } from 'lucide-react';
import { Badge } from 'omuk-ui/badge';
import { Button } from 'omuk-ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from 'omuk-ui/dropdown-menu';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from 'omuk-ui/table';

const INVOICES = [
  {
    id: 'INV-1042',
    customer: 'Northwind Trading',
    status: 'Paid',
    amount: 1250,
  },
  { id: 'INV-1043', customer: 'Contoso Ltd', status: 'Due', amount: 830.5 },
  { id: 'INV-1044', customer: 'Fabrikam', status: 'Overdue', amount: 12400 },
  { id: 'INV-1045', customer: 'Tailspin Toys', status: 'Paid', amount: 96 },
];

const money = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
});

export default function TableInvoices() {
  return (
    <Table containerClassName="rounded-lg inset-ring inset-ring-border">
      <TableHeader>
        <TableRow>
          <TableHead className="pl-4">Invoice</TableHead>
          <TableHead>Customer</TableHead>
          <TableHead>Status</TableHead>
          <TableHead className="text-right">Amount</TableHead>
          <TableHead className="w-0 pr-4">
            <span className="sr-only">Actions</span>
          </TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {INVOICES.map((invoice) => (
          <TableRow key={invoice.id}>
            <TableCell className="pl-4 font-medium">{invoice.id}</TableCell>
            <TableCell>{invoice.customer}</TableCell>
            <TableCell>
              <Badge
                variant={
                  invoice.status === 'Overdue' ? 'destructive' : 'default'
                }
              >
                {invoice.status}
              </Badge>
            </TableCell>
            <TableCell className="text-right font-mono text-xs tabular-nums">
              {money.format(invoice.amount)}
            </TableCell>
            <TableCell className="pr-4">
              <DropdownMenu>
                <DropdownMenuTrigger
                  render={
                    <Button
                      variant="ghost"
                      size="icon-xs"
                      aria-label={`Actions for ${invoice.id}`}
                    >
                      <MoreHorizontalIcon strokeWidth={1.5} aria-hidden />
                    </Button>
                  }
                />
                <DropdownMenuContent align="end" className="w-48">
                  <DropdownMenuItem>Download PDF</DropdownMenuItem>
                  <DropdownMenuItem>Send a reminder</DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem variant="destructive">
                    Void
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
