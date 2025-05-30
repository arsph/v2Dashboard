import { Pool } from 'pg';
import type { Transaction, Expense } from './types';

// Create a new pool using the DATABASE_URL from Render
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? {
    rejectUnauthorized: false
  } : undefined
});

// Test database connection
export async function testConnection() {
  try {
    const client = await pool.connect();
    console.log('Database connection successful');
    client.release();
    return true;
  } catch (error) {
    console.error('Database connection error:', error);
    return false;
  }
}

// Initialize database tables
export async function initDatabase() {
  try {
    const client = await pool.connect();
    
    // Create sales table
    await client.query(`
      CREATE TABLE IF NOT EXISTS sales (
        id SERIAL PRIMARY KEY,
        customer_name VARCHAR(255) NOT NULL,
        date DATE NOT NULL,
        traffic_amount INTEGER NOT NULL,
        duration_months INTEGER NOT NULL,
        price DECIMAL(10,2) NOT NULL,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Create expenses table
    await client.query(`
      CREATE TABLE IF NOT EXISTS expenses (
        id SERIAL PRIMARY KEY,
        server VARCHAR(255) NOT NULL,
        date DATE NOT NULL,
        price DECIMAL(10,2) NOT NULL,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `);

    client.release();
    console.log('Database tables initialized successfully');
    return true;
  } catch (error) {
    console.error('Error initializing database:', error);
    return false;
  }
}

// Sales operations
export async function getSales() {
  const result = await pool.query('SELECT * FROM sales ORDER BY date DESC');
  return result.rows;
}

export async function addSale(data: {
  customer_name: string;
  date: string;
  traffic_amount: number;
  duration_months: number;
  price: number;
}) {
  const result = await pool.query(
    'INSERT INTO sales (customer_name, date, traffic_amount, duration_months, price) VALUES ($1, $2, $3, $4, $5) RETURNING *',
    [data.customer_name, data.date, data.traffic_amount, data.duration_months, data.price]
  );
  return result.rows[0];
}

export async function removeSale(id: number) {
  await pool.query('DELETE FROM sales WHERE id = $1', [id]);
}

// Expenses operations
export async function getExpenses() {
  const result = await pool.query('SELECT * FROM expenses ORDER BY date DESC');
  return result.rows;
}

export async function addExpense(data: {
  server: string;
  date: string;
  price: number;
}) {
  const result = await pool.query(
    'INSERT INTO expenses (server, date, price) VALUES ($1, $2, $3) RETURNING *',
    [data.server, data.date, data.price]
  );
  return result.rows[0];
}

export async function removeExpense(id: number) {
  await pool.query('DELETE FROM expenses WHERE id = $1', [id]);
} 