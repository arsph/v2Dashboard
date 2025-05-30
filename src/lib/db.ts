import type { Transaction, Expense } from './types';

interface Env {
  DB: D1Database;
}

// Sales operations
export async function getSales(env: Env) {
  const { results } = await env.DB.prepare('SELECT * FROM sales ORDER BY date DESC').all();
  return results;
}

export async function addSale(env: Env, data: {
  customer_name: string;
  date: string;
  traffic_amount: number;
  duration_months: number;
  price: number;
}) {
  const { results } = await env.DB.prepare(
    'INSERT INTO sales (customer_name, date, traffic_amount, duration_months, price) VALUES (?, ?, ?, ?, ?) RETURNING *'
  ).bind(data.customer_name, data.date, data.traffic_amount, data.duration_months, data.price).run();
  return results;
}

export async function removeSale(env: Env, id: number) {
  await env.DB.prepare('DELETE FROM sales WHERE id = ?').bind(id).run();
}

// Expenses operations
export async function getExpenses(env: Env) {
  const { results } = await env.DB.prepare('SELECT * FROM expenses ORDER BY date DESC').all();
  return results;
}

export async function addExpense(env: Env, data: {
  server: string;
  date: string;
  price: number;
}) {
  const { results } = await env.DB.prepare(
    'INSERT INTO expenses (server, date, price) VALUES (?, ?, ?) RETURNING *'
  ).bind(data.server, data.date, data.price).run();
  return results;
}

export async function removeExpense(env: Env, id: number) {
  await env.DB.prepare('DELETE FROM expenses WHERE id = ?').bind(id).run();
}
