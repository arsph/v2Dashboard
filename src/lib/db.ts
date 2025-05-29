import { sql } from '@vercel/postgres';
import type { Transaction, Expense } from './types';

// Initialize database tables
export async function initDatabase() {
  try {
    // Create sales table
    await sql`
      CREATE TABLE IF NOT EXISTS sales (
        id VARCHAR(255) PRIMARY KEY,
        user VARCHAR(255) NOT NULL,
        date TIMESTAMP NOT NULL,
        traffic_amount VARCHAR(255) NOT NULL,
        duration_months INTEGER NOT NULL,
        price INTEGER NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `;

    // Create expenses table
    await sql`
      CREATE TABLE IF NOT EXISTS expenses (
        id VARCHAR(255) PRIMARY KEY,
        server VARCHAR(255) NOT NULL,
        date TIMESTAMP NOT NULL,
        price INTEGER NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `;
  } catch (error) {
    console.error('Error initializing database:', error);
    throw error;
  }
}

// Sales operations
export async function getSales(): Promise<Transaction[]> {
  try {
    const { rows } = await sql`
      SELECT * FROM sales 
      ORDER BY date DESC;
    `;
    return rows.map(row => ({
      id: row.id,
      user: row.user,
      date: row.date,
      trafficAmount: row.traffic_amount,
      durationMonths: row.duration_months,
      price: row.price
    }));
  } catch (error) {
    console.error('Error fetching sales:', error);
    throw error;
  }
}

export async function addSale(sale: Transaction): Promise<void> {
  try {
    await sql`
      INSERT INTO sales (id, user, date, traffic_amount, duration_months, price)
      VALUES (
        ${sale.id},
        ${sale.user},
        ${sale.date},
        ${sale.trafficAmount},
        ${sale.durationMonths},
        ${sale.price}
      );
    `;
  } catch (error) {
    console.error('Error adding sale:', error);
    throw error;
  }
}

export async function removeSale(id: string): Promise<void> {
  try {
    await sql`
      DELETE FROM sales 
      WHERE id = ${id};
    `;
  } catch (error) {
    console.error('Error removing sale:', error);
    throw error;
  }
}

// Expenses operations
export async function getExpenses(): Promise<Expense[]> {
  try {
    const { rows } = await sql`
      SELECT * FROM expenses 
      ORDER BY date DESC;
    `;
    return rows.map(row => ({
      id: row.id,
      server: row.server,
      date: row.date,
      price: row.price
    }));
  } catch (error) {
    console.error('Error fetching expenses:', error);
    throw error;
  }
}

export async function addExpense(expense: Expense): Promise<void> {
  try {
    await sql`
      INSERT INTO expenses (id, server, date, price)
      VALUES (
        ${expense.id},
        ${expense.server},
        ${expense.date},
        ${expense.price}
      );
    `;
  } catch (error) {
    console.error('Error adding expense:', error);
    throw error;
  }
}

export async function removeExpense(id: string): Promise<void> {
  try {
    await sql`
      DELETE FROM expenses 
      WHERE id = ${id};
    `;
  } catch (error) {
    console.error('Error removing expense:', error);
    throw error;
  }
} 