import type { Transaction, Expense } from './types';

declare global {
  const DB: D1Database;
}

// Initialize database tables
export async function initDatabase() {
  try {
    console.log('Starting database initialization...');
    console.log('Checking database connection...');
    
    // Test the connection
    await DB.prepare('SELECT 1').run();
    console.log('Database connection successful');

    // Create sales table
    console.log('Creating sales table...');
    await DB.prepare(`
      CREATE TABLE IF NOT EXISTS sales (
        id TEXT PRIMARY KEY,
        customer_name TEXT NOT NULL,
        date TEXT NOT NULL,
        traffic_amount TEXT NOT NULL,
        duration_months INTEGER NOT NULL,
        price INTEGER NOT NULL,
        created_at TEXT DEFAULT CURRENT_TIMESTAMP
      );
    `).run();
    console.log('Created sales table');

    // Create expenses table
    console.log('Creating expenses table...');
    await DB.prepare(`
      CREATE TABLE IF NOT EXISTS expenses (
        id TEXT PRIMARY KEY,
        server TEXT NOT NULL,
        date TEXT NOT NULL,
        price INTEGER NOT NULL,
        created_at TEXT DEFAULT CURRENT_TIMESTAMP
      );
    `).run();
    console.log('Created expenses table');

    console.log('Database initialization completed successfully');
  } catch (error) {
    console.error('Error initializing database:', error);
    if (error instanceof Error) {
      console.error('Error details:', {
        name: error.name,
        message: error.message,
        stack: error.stack
      });
    }
    throw error;
  }
}

// Sales operations
export async function getSales(): Promise<Transaction[]> {
  try {
    const { results } = await DB.prepare(`
      SELECT 
        id,
        customer_name,
        date,
        traffic_amount,
        duration_months,
        price
      FROM sales 
      ORDER BY date DESC;
    `).all();
    
    return results.map((row: any) => ({
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
    const { id, customer_name, date, trafficAmount, durationMonths, price } = sale;
    await DB.prepare(`
      INSERT INTO sales (
        id,
        customer_name,
        date,
        traffic_amount,
        duration_months,
        price
      ) VALUES (?, ?, ?, ?, ?, ?);
    `).bind(id, customer_name, date, trafficAmount, durationMonths, price).run();
    console.log('Sale added successfully');
  } catch (error) {
    console.error('Error adding sale:', error);
    throw error;
  }
}

export async function removeSale(id: string): Promise<void> {
  try {
    await DB.prepare('DELETE FROM sales WHERE id = ?;').bind(id).run();
  } catch (error) {
    console.error('Error removing sale:', error);
    throw error;
  }
}

// Expenses operations
export async function getExpenses(): Promise<Expense[]> {
  try {
    const { results } = await DB.prepare(`
      SELECT 
        id,
        server,
        date,
        price
      FROM expenses 
      ORDER BY date DESC;
    `).all();
    
    return results.map((row: any) => ({
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
    await DB.prepare(`
      INSERT INTO expenses (
        id,
        server,
        date,
        price
      ) VALUES (?, ?, ?, ?);
    `).bind(id, server, date, price).run();
    console.log('Expense added successfully');
  } catch (error) {
    console.error('Error adding expense:', error);
    throw error;
  }
}

export async function removeExpense(id: string): Promise<void> {
  try {
    await DB.prepare('DELETE FROM expenses WHERE id = ?;').bind(id).run();
  } catch (error) {
    console.error('Error removing expense:', error);
    throw error;
  }
} 