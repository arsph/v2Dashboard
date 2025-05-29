import type { Transaction, Expense } from './types';

const SALES_STORAGE_KEY = 'v2dashboard_sales';
const EXPENSES_STORAGE_KEY = 'v2dashboard_expenses';

/**
 * Gets all sales from localStorage
 */
export function getSales(): Transaction[] {
  if (typeof window === 'undefined') return [];
  const sales = localStorage.getItem(SALES_STORAGE_KEY);
  return sales ? JSON.parse(sales) : [];
}

/**
 * Gets all expenses from localStorage
 */
export function getExpenses(): Expense[] {
  if (typeof window === 'undefined') return [];
  const expenses = localStorage.getItem(EXPENSES_STORAGE_KEY);
  return expenses ? JSON.parse(expenses) : [];
}

/**
 * Adds a new sale to localStorage
 */
export function addSale(sale: Transaction): void {
  const sales = getSales();
  sales.unshift(sale);
  localStorage.setItem(SALES_STORAGE_KEY, JSON.stringify(sales));
}

/**
 * Adds a new expense to localStorage
 */
export function addExpense(expense: Expense): void {
  const expenses = getExpenses();
  expenses.unshift(expense);
  localStorage.setItem(EXPENSES_STORAGE_KEY, JSON.stringify(expenses));
}

/**
 * Removes a sale from localStorage
 */
export function removeSale(id: string): void {
  const sales = getSales();
  const updatedSales = sales.filter(sale => sale.id !== id);
  localStorage.setItem(SALES_STORAGE_KEY, JSON.stringify(updatedSales));
}

/**
 * Removes an expense from localStorage
 */
export function removeExpense(id: string): void {
  const expenses = getExpenses();
  const updatedExpenses = expenses.filter(expense => expense.id !== id);
  localStorage.setItem(EXPENSES_STORAGE_KEY, JSON.stringify(updatedExpenses));
} 