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
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import { SaleFormSchema, type SaleFormData } from '@/lib/types';
import { useTransactions } from '@/context/TransactionsContext';
import { addSaleToFirestore } from '@/lib/firebaseService'; 

export default function ImportSalesPage() {
  const { toast } = useToast();
  const { addSaleTransaction } = useTransactions();

  const form = useForm<SaleFormData>({
    resolver: zodResolver(SaleFormSchema),
    defaultValues: {
      name: '',
      trafficAmount: '',
      durationMonths: 1,
      price: undefined, 
      date: new Date(),
    },
  });

  async function onSubmit(data: SaleFormData) {
    try {
      addSaleTransaction(data); 
      await addSaleToFirestore(data); 
      toast({
        title: 'Sale Added Successfully!',
        description: `Sale for ${data.name} has been recorded.`,
      });
      form.reset(); 
    } catch (error) {
      console.error("Failed to add sale:", error);
      toast({
        title: 'Error',
        description: 'Failed to add sale. Please try again.',
        variant: 'destructive',
      });
    }
  }

  return (
    <div className="flex-1 space-y-6 p-4 md:p-8 pt-6 bg-background min-h-screen">
      <div className="flex items-center justify-between space-y-2 mb-6">
        <div className="flex items-center gap-4">
           {/* Removed back button as sidebar will handle navigation */}
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Add New Sale</h1>
        </div>
      </div>

      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle>Enter Sale Details</CardTitle>
          <CardDescription>Fill in the form below to add a new sales record.</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., John Doe" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="trafficAmount"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Traffic Amount</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., 100 or Unlimited" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="durationMonths"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Duration (Months)</FormLabel>
                    <FormControl>
                      <Input type="number" placeholder="e.g., 1" {...field} />
                    </FormControl>
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
                      <Input type="number" placeholder="e.g., 50.00" step="0.01" {...field} />
                    </FormControl>
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
              <div className="flex justify-end">
                <Button type="submit" className="mt-4" disabled={form.formState.isSubmitting}>
                  {form.formState.isSubmitting ? "Adding..." : "Add Sale"}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
