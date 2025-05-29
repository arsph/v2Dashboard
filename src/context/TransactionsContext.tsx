'use client';

import * as React from 'react';
import type { Transaction, SaleFormData, Expense, ExpenseFormData } from '@/lib/types';
import { mockDashboardData } from '@/lib/data';
import { addSaleToFirestore, addExpenseToFirestore, deleteSaleFromFirestore, deleteExpenseFromFirestore } from '@/lib/firebaseService'; // Added delete functions

interface TransactionsContextType {
  transactions: Transaction[];
  expenses: Expense[];
  addSaleTransaction: (saleData: SaleFormData) => Promise<void>;
  addExpenseTransaction: (expenseData: ExpenseFormData) => Promise<void>;
  removeSaleTransaction: (id: string) => Promise<void>;
  removeExpenseTransaction: (id: string) => Promise<void>;
}

const TransactionsContext = React.createContext<TransactionsContextType | undefined>(undefined);

export const TransactionsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [transactions, setTransactions] = React.useState<Transaction[]>(mockDashboardData.recentTransactions);
  const [expenses, setExpenses] = React.useState<Expense[]>(mockDashboardData.expenses);

  const addSaleTransaction = async (saleData: SaleFormData) => {
    const newTransaction: Transaction = {
      id: `txn_${saleData.name}_${saleData.date.getTime()}`,
      user: saleData.name,
      date: saleData.date.toISOString(),
      trafficAmount: saleData.trafficAmount,
      durationMonths: saleData.durationMonths,
      price: Math.round(saleData.price), // Rounded price
    };
    setTransactions(prevTransactions => [newTransaction, ...prevTransactions]);
    await addSaleToFirestore(newTransaction);
  };

  const addExpenseTransaction = async (expenseData: ExpenseFormData) => {
    const newExpense: Expense = {
      id: `exp_${expenseData.server}_${expenseData.date.getTime()}`,
      server: expenseData.server,
      date: expenseData.date.toISOString(),
      price: Math.round(expenseData.price), // Rounded price
    };
    setExpenses(prevExpenses => [newExpense, ...prevExpenses]);
    await addExpenseToFirestore(newExpense);
  };

  const removeSaleTransaction = async (id: string) => {
    setTransactions(prevTransactions => prevTransactions.filter(t => t.id !== id));
    await deleteSaleFromFirestore(id);
  };

  const removeExpenseTransaction = async (id: string) => {
    setExpenses(prevExpenses => prevExpenses.filter(e => e.id !== id));
    await deleteExpenseFromFirestore(id);
  };

  return (
    <TransactionsContext.Provider value={{ 
      transactions, 
      expenses, 
      addSaleTransaction, 
      addExpenseTransaction,
      removeSaleTransaction,
      removeExpenseTransaction 
    }}>
      {children}
    </TransactionsContext.Provider>
  );
};

export const useTransactions = (): TransactionsContextType => {
  const context = React.useContext(TransactionsContext);
  if (context === undefined) {
    throw new Error('useTransactions must be used within a TransactionsProvider');
  }
  return context;
};
