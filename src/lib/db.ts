import { sql } from '@vercel/postgres';
import type { Transaction, Expense } from './types';

// Initialize database tables
export async function initDatabase() {
  try {
    console.log('Starting database initialization...');

    // Drop existing tables if they exist
    await sql`DROP TABLE IF EXISTS sales;`;
    await sql`DROP TABLE IF EXISTS expenses;`;
    console.log('Dropped existing tables');

    // Create sales table
    await sql`
      CREATE TABLE sales (
        id VARCHAR(255) PRIMARY KEY,
        customer_name VARCHAR(255) NOT NULL,
        date TIMESTAMP NOT NULL,
        traffic_amount VARCHAR(255) NOT NULL,
        duration_months INTEGER NOT NULL,
        price INTEGER NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `;
    console.log('Created sales table');

    // Create expenses table
    await sql`
      CREATE TABLE expenses (
        id VARCHAR(255) PRIMARY KEY,
        server VARCHAR(255) NOT NULL,
        date TIMESTAMP NOT NULL,
        price INTEGER NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `;
    console.log('Created expenses table');

    console.log('Database initialization completed successfully');
  } catch (error) {
    console.error('Error initializing database:', error);
    throw error;
  }
}

// Sales operations
export async function getSales(): Promise<Transaction[]> {
  try {
    const { rows } = await sql`
      SELECT 
        id,
        customer_name,
        date,
        traffic_amount,
        duration_months,
        price
      FROM sales 
      ORDER BY date DESC;
    `;
    return rows.map(row => ({
      id: row.id,
      customer_name: row.customer_name,
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
    console.log('Adding sale:', sale);
    const { id, user: customerName, date, trafficAmount, durationMonths, price } = sale;
    await sql`
      INSERT INTO sales (
        id,
        customer_name,
        date,
        traffic_amount,
        duration_months,
        price
      ) VALUES (
        ${id},
        ${customerName},
        ${date},
        ${trafficAmount},
        ${durationMonths},
        ${price}
      );
    `;
    console.log('Sale added successfully');
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
      SELECT 
        id,
        server,
        date,
        price
      FROM expenses 
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
    console.log('Adding expense:', expense);
    const { id, server, date, price } = expense;
    await sql`
      INSERT INTO expenses (
        id,
        server,
        date,
        price
      ) VALUES (
        ${id},
        ${server},
        ${date},
        ${price}
      );
    `;
    console.log('Expense added successfully');
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