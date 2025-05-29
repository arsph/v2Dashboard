'use client';

import * as React from 'react';
import type { Transaction, SaleFormData, Expense, ExpenseFormData } from '@/lib/types';
import { getSales, getExpenses, addSale, addExpense, removeSale, removeExpense } from '@/lib/db';

interface TransactionsContextType {
  transactions: Transaction[];
  expenses: Expense[];
  addSaleTransaction: (saleData: SaleFormData) => Promise<void>;
  addExpenseTransaction: (expenseData: ExpenseFormData) => Promise<void>;
  removeSaleTransaction: (id: string) => Promise<void>;
  removeExpenseTransaction: (id: string) => Promise<void>;
  refreshData: () => Promise<void>;
}

const TransactionsContext = React.createContext<TransactionsContextType | undefined>(undefined);

export const TransactionsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [transactions, setTransactions] = React.useState<Transaction[]>([]);
  const [expenses, setExpenses] = React.useState<Expense[]>([]);

  const refreshData = React.useCallback(async () => {
    try {
      const [salesData, expensesData] = await Promise.all([
        getSales(),
        getExpenses()
      ]);
      setTransactions(salesData);
      setExpenses(expensesData);
    } catch (error) {
      console.error('Error refreshing data:', error);
    }
  }, []);

  // Load data from database on mount
  React.useEffect(() => {
    refreshData();
  }, [refreshData]);

  const addSaleTransaction = async (saleData: SaleFormData) => {
    const newTransaction: Transaction = {
      id: `txn_${saleData.name}_${saleData.date.getTime()}`,
      user: saleData.name,
      date: saleData.date.toISOString(),
      trafficAmount: saleData.trafficAmount,
      durationMonths: saleData.durationMonths,
      price: Math.round(saleData.price), // Rounded price
    };
    await addSale(newTransaction);
    await refreshData();
  };

  const addExpenseTransaction = async (expenseData: ExpenseFormData) => {
    const newExpense: Expense = {
      id: `exp_${expenseData.server}_${expenseData.date.getTime()}`,
      server: expenseData.server,
      date: expenseData.date.toISOString(),
      price: Math.round(expenseData.price), // Rounded price
    };
    await addExpense(newExpense);
    await refreshData();
  };

  const removeSaleTransaction = async (id: string) => {
    await removeSale(id);
    await refreshData();
  };

  const removeExpenseTransaction = async (id: string) => {
    await removeExpense(id);
    await refreshData();
  };

  return (
    <TransactionsContext.Provider value={{ 
      transactions, 
      expenses, 
      addSaleTransaction, 
      addExpenseTransaction,
      removeSaleTransaction,
      removeExpenseTransaction,
      refreshData
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
