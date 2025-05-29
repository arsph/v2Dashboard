'use client';

import * as React from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { format } from 'date-fns';
import Link from 'next/link';
import { ArrowLeft, CalendarIcon } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import { ExpenseFormSchema, type ExpenseFormData } from '@/lib/types';
import { addExpenseToFirestore } from '@/lib/firebaseService'; 
import { useTransactions } from '@/context/TransactionsContext';

export default function ImportExpensesPage() {
  const { toast } = useToast();
  const { addExpenseTransaction } = useTransactions();

  const form = useForm<ExpenseFormData>({
    resolver: zodResolver(ExpenseFormSchema),
    defaultValues: {
      server: undefined, 
      date: new Date(),
      price: 0,
    },
  });

  async function onSubmit(data: ExpenseFormData) {
    try {
      await addExpenseTransaction(data); // Pass form data directly
      toast({
        title: 'Expense Added Successfully!',
        description: `Expense for server ${data.server} on ${format(data.date, "PPP")} has been recorded.`,
      });
      form.reset(); 
    } catch (error) {
      console.error("Failed to add expense:", error);
      toast({
        title: 'Error',
        description: 'Failed to add expense. Please try again.',
        variant: 'destructive',
      });
    }
  }

  return (
    <div className="flex-1 space-y-6 p-4 md:p-8 pt-6 bg-background min-h-screen">
      <div className="flex items-center justify-between space-y-2 mb-6">
       <div className="flex items-center gap-4">
          {/* Removed back button as sidebar will handle navigation */}
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Add New Server Expense</h1>
        </div>
      </div>

      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle>Enter Server Expense Details</CardTitle>
          <CardDescription>
            Fill in the form below to add a new server expense record.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <FormField
                  control={form.control}
                  name="server"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Server Location</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select server location" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="DE">🇩🇪 DE (Germany)</SelectItem>
                          <SelectItem value="IR">🇮🇷 IR (Iran)</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="date"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>Date</FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant={"outline"}
                              className={cn(
                                "w-full justify-start text-left font-normal",
                                !field.value && "text-muted-foreground"
                              )}
                            >
                              <CalendarIcon className="mr-2 h-4 w-4" />
                              {field.value ? format(field.value, "PPP") : <span>Pick a date</span>}
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={field.value}
                            onSelect={field.onChange}
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="price"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Price (T)</FormLabel>
                      <FormControl>
                        <Input 
                          type="number" 
                          placeholder="e.g., 50.00" 
                          step="0.01" 
                          value={field.value || ''} 
                          onChange={event => field.onChange(event.target.value ? +event.target.value : '')} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="flex justify-end">
                <Button type="submit" className="mt-4" disabled={form.formState.isSubmitting}>
                  {form.formState.isSubmitting ? "Adding..." : "Add Expense"}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
