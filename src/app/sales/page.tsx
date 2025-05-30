'use client';

import * as React from 'react';
import { useTransactions } from '@/context/TransactionsContext';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { PlusCircle, Trash2 } from 'lucide-react';
import { format } from 'date-fns';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useToast } from '@/hooks/use-toast';

export default function AllSalesPage() {
  const { sales, removeSale } = useTransactions();
  const { toast } = useToast();
  const [isAlertOpen, setIsAlertOpen] = React.useState(false);
  const [selectedTransactionId, setSelectedTransactionId] = React.useState<string | null>(null);

  const handleRemoveClick = (id: string) => {
    setSelectedTransactionId(id);
    setIsAlertOpen(true);
  };

  const handleConfirmRemove = async () => {
    if (selectedTransactionId) {
      try {
        await removeSale(parseInt(selectedTransactionId));
        toast({
          title: 'Sale Removed',
          description: 'The sale transaction has been successfully removed.',
        });
      } catch (error) {
        console.error("Failed to remove sale:", error);
        toast({
          title: 'Error',
          description: 'Failed to remove sale. Please try again.',
          variant: 'destructive',
        });
      }
    }
    setIsAlertOpen(false);
    setSelectedTransactionId(null);
  };

  return (
    <>
      <div className="flex-1 space-y-6 p-4 md:p-8 pt-6 bg-background min-h-screen">
        <div className="flex items-center justify-between space-y-2 mb-6">
          <h1 className="text-3xl font-bold tracking-tight text-foreground">All Sales Transactions</h1>
          <Button asChild variant="outline">
            <Link href="/import-sales">
              <PlusCircle className="mr-2 h-4 w-4" />
              Add New Sale
            </Link>
          </Button>
        </div>

        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle>Sales History</CardTitle>
            <CardDescription>A complete list of all recorded sales.</CardDescription>
          </CardHeader>
          <CardContent>
            {sales.length > 0 ? (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>👤 User</TableHead>
                    <TableHead>📅 Date</TableHead>
                    <TableHead>🌐 Traffic</TableHead>
                    <TableHead>⏱️ Duration</TableHead>
                    <TableHead className="text-right">💵 Price (T)</TableHead>
                    <TableHead className="text-center">⚡ Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                {sales.map((transaction) => (
                    <TableRow key={transaction.id}>
                      <TableCell className="font-medium">{transaction.customer_name}</TableCell>
                      <TableCell>{format(new Date(transaction.date), 'MMM dd, yyyy')}</TableCell>
                      <TableCell>{transaction.traffic_amount}</TableCell>
                      <TableCell className="text-right">{transaction.durationMonths}</TableCell>
                      <TableCell className="text-right">{transaction.price} T</TableCell>
                      <TableCell className="text-center">
                        <Button variant="outline" size="icon" onClick={() => handleRemoveClick(transaction.id)}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
              <p className="text-muted-foreground text-center py-4">No sales recorded yet.</p>
            )}
          </CardContent>
        </Card>
      </div>

      <AlertDialog open={isAlertOpen} onOpenChange={setIsAlertOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete this sale transaction.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setSelectedTransactionId(null)}>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirmRemove}>
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
