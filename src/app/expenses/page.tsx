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

export default function AllExpensesPage() {
  const { expenses, removeExpense } = useTransactions();
  const { toast } = useToast();
  const [isAlertOpen, setIsAlertOpen] = React.useState(false);
  const [selectedExpenseId, setSelectedExpenseId] = React.useState<string | null>(null);

  const handleRemoveClick = (id: string) => {
    setSelectedExpenseId(id);
    setIsAlertOpen(true);
  };

  const handleConfirmRemove = async () => {
    if (selectedExpenseId) {
      try {
        await removeExpense(parseInt(selectedExpenseId));
        toast({
          title: 'Expense Removed',
          description: 'The expense transaction has been successfully removed.',
        });
      } catch (error) {
        console.error("Failed to remove expense:", error);
        toast({
          title: 'Error',
          description: 'Failed to remove expense. Please try again.',
          variant: 'destructive',
        });
      }
    }
    setIsAlertOpen(false);
    setSelectedExpenseId(null);
  };

  return (
    <>
      <div className="flex-1 space-y-6 p-4 md:p-8 pt-6 bg-background min-h-screen">
        <div className="flex items-center justify-between space-y-2 mb-6">
          <h1 className="text-3xl font-bold tracking-tight text-foreground">All Expense Transactions</h1>
          <Button asChild variant="outline">
            <Link href="/import-expenses">
              <PlusCircle className="mr-2 h-4 w-4" />
              Add New Expense
            </Link>
          </Button>
        </div>

        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle>Expense History</CardTitle>
            <CardDescription>A complete list of all recorded server expenses.</CardDescription>
          </CardHeader>
          <CardContent>
            {expenses.length > 0 ? (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>🌍 Server</TableHead>
                    <TableHead>📅 Date</TableHead>
                    <TableHead className="text-right">💵 Price (T)</TableHead>
                    <TableHead className="text-center">⚡ Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {expenses.map((expense) => (
                    <TableRow key={expense.id}>
                      <TableCell className="font-medium">{expense.server}</TableCell>
                      <TableCell>{format(new Date(expense.date), 'MMM dd, yyyy')}</TableCell>
                      <TableCell className="text-right">{expense.price} T</TableCell>
                      <TableCell className="text-center">
                        <Button variant="outline" size="icon" onClick={() => handleRemoveClick(expense.id)}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
              <p className="text-muted-foreground text-center py-4">No expenses recorded yet.</p>
            )}
          </CardContent>
        </Card>
      </div>

      <AlertDialog open={isAlertOpen} onOpenChange={setIsAlertOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete this expense transaction.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setSelectedExpenseId(null)}>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirmRemove}>
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
