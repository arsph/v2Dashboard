import type { Transaction } from '@/lib/types';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { format } from 'date-fns';

interface RecentTransactionsTableProps {
  transactions: Transaction[];
}

export function RecentTransactionsTable({ transactions }: RecentTransactionsTableProps) {
  return (
    <Card className="shadow-lg">
      <CardHeader>
        <CardTitle>Recent Sales</CardTitle>
        <CardDescription>Latest sales</CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>👤 User</TableHead>
              <TableHead>📅 Date</TableHead>
              <TableHead>🌐 Traffic</TableHead>
              <TableHead>⏱️ Duration</TableHead>
              <TableHead className="text-right">💵 Price (T)</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {transactions.map((transaction) => (
              <TableRow key={transaction.id}>
                <TableCell className="font-medium truncate max-w-[150px]">{transaction.customer_name}</TableCell>
                <TableCell>{format(new Date(transaction.date), 'MMM dd, yyyy')}</TableCell>
                <TableCell>{transaction.traffic_amount}</TableCell>
                <TableCell>{transaction.durationMonths} mo</TableCell>
                <TableCell className="text-right">{transaction.price} T</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
