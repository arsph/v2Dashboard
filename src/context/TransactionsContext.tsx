'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import type { Transaction, Expense } from '@/lib/types';
import { getSales, addSale, removeSale, getExpenses, addExpense, removeExpense } from '@/lib/db';

interface TransactionsContextType {
  sales: Transaction[];
  expenses: Expense[];
  addSale: (sale: Omit<Transaction, 'id' | 'created_at'>) => Promise<void>;
  removeSale: (id: number) => Promise<void>;
  addExpense: (expense: Omit<Expense, 'id' | 'created_at'>) => Promise<void>;
  removeExpense: (id: number) => Promise<void>;
  refreshData: () => Promise<void>;
}

const TransactionsContext = createContext<TransactionsContextType | undefined>(undefined);

export function TransactionsProvider({ children }: { children: React.ReactNode }) {
  const [sales, setSales] = useState<Transaction[]>([]);
  const [expenses, setExpenses] = useState<Expense[]>([]);

  const refreshData = async () => {
    try {
      const [salesData, expensesData] = await Promise.all([
        getSales(),
        getExpenses(),
      ]);
      setSales(salesData);
      setExpenses(expensesData);
    } catch (error) {
      console.error('Error refreshing data:', error);
    }
  };

  useEffect(() => {
    refreshData();
  }, []);

  const handleAddSale = async (sale: Omit<Transaction, 'id' | 'created_at'>) => {
    try {
      await addSale(sale);
      await refreshData();
    } catch (error) {
      console.error('Error adding sale:', error);
      throw error;
    }
  };

  const handleRemoveSale = async (id: number) => {
    try {
      await removeSale(id);
      await refreshData();
    } catch (error) {
      console.error('Error removing sale:', error);
      throw error;
    }
  };

  const handleAddExpense = async (expense: Omit<Expense, 'id' | 'created_at'>) => {
    try {
      await addExpense(expense);
      await refreshData();
    } catch (error) {
      console.error('Error adding expense:', error);
      throw error;
    }
  };

  const handleRemoveExpense = async (id: number) => {
    try {
      await removeExpense(id);
      await refreshData();
    } catch (error) {
      console.error('Error removing expense:', error);
      throw error;
    }
  };

  return (
    <TransactionsContext.Provider
      value={{
        sales,
        expenses,
        addSale: handleAddSale,
        removeSale: handleRemoveSale,
        addExpense: handleAddExpense,
        removeExpense: handleRemoveExpense,
        refreshData,
      }}
    >
      {children}
    </TransactionsContext.Provider>
  );
}

export function useTransactions() {
  const context = useContext(TransactionsContext);
  if (context === undefined) {
    throw new Error('useTransactions must be used within a TransactionsProvider');
  }
  return context;
}
