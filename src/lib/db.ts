import { Pool } from 'pg';
import type { Transaction, Expense } from './types';

// Create a new pool using the connection string
const pool = new Pool({
  connectionString: process.env.POSTGRES_URL,
  ssl: {
    rejectUnauthorized: false
  }
});

// Initialize database tables
export async function initDatabase() {
  try {
    console.log('Starting database initialization...');
    console.log('Checking database connection...');
    
    // Test the connection
    const client = await pool.connect();
    try {
      await client.query('SELECT 1');
      console.log('Database connection successful');

      // Drop existing tables if they exist
      console.log('Dropping existing tables...');
      await client.query('DROP TABLE IF EXISTS sales;');
      await client.query('DROP TABLE IF EXISTS expenses;');
      console.log('Dropped existing tables');

      // Create sales table
      console.log('Creating sales table...');
      await client.query(`
        CREATE TABLE sales (
          id VARCHAR(255) PRIMARY KEY,
          customer_name VARCHAR(255) NOT NULL,
          date TIMESTAMP NOT NULL,
          traffic_amount VARCHAR(255) NOT NULL,
          duration_months INTEGER NOT NULL,
          price INTEGER NOT NULL,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
      `);
      console.log('Created sales table');

      // Create expenses table
      console.log('Creating expenses table...');
      await client.query(`
        CREATE TABLE expenses (
          id VARCHAR(255) PRIMARY KEY,
          server VARCHAR(255) NOT NULL,
          date TIMESTAMP NOT NULL,
          price INTEGER NOT NULL,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
      `);
      console.log('Created expenses table');

      console.log('Database initialization completed successfully');
    } finally {
      client.release();
    }
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
  const client = await pool.connect();
  try {
    const { rows } = await client.query(`
      SELECT 
        id,
        customer_name,
        date,
        traffic_amount,
        duration_months,
        price
      FROM sales 
      ORDER BY date DESC;
    `);
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
  } finally {
    client.release();
  }
}

export async function addSale(sale: Transaction): Promise<void> {
  const client = await pool.connect();
  try {
    console.log('Adding sale:', sale);
    const { id, customer_name, date, trafficAmount, durationMonths, price } = sale;
    await client.query(`
      INSERT INTO sales (
        id,
        customer_name,
        date,
        traffic_amount,
        duration_months,
        price
      ) VALUES ($1, $2, $3, $4, $5, $6);
    `, [id, customer_name, date, trafficAmount, durationMonths, price]);
    console.log('Sale added successfully');
  } catch (error) {
    console.error('Error adding sale:', error);
    throw error;
  } finally {
    client.release();
  }
}

export async function removeSale(id: string): Promise<void> {
  const client = await pool.connect();
  try {
    await client.query('DELETE FROM sales WHERE id = $1;', [id]);
  } catch (error) {
    console.error('Error removing sale:', error);
    throw error;
  } finally {
    client.release();
  }
}

// Expenses operations
export async function getExpenses(): Promise<Expense[]> {
  const client = await pool.connect();
  try {
    const { rows } = await client.query(`
      SELECT 
        id,
        server,
        date,
        price
      FROM expenses 
      ORDER BY date DESC;
    `);
    return rows.map(row => ({
      id: row.id,
      server: row.server,
      date: row.date,
      price: row.price
    }));
  } catch (error) {
    console.error('Error fetching expenses:', error);
    throw error;
  } finally {
    client.release();
  }
}

export async function addExpense(expense: Expense): Promise<void> {
  const client = await pool.connect();
  try {
    console.log('Adding expense:', expense);
    const { id, server, date, price } = expense;
    await client.query(`
      INSERT INTO expenses (
        id,
        server,
        date,
        price
      ) VALUES ($1, $2, $3, $4);
    `, [id, server, date, price]);
    console.log('Expense added successfully');
  } catch (error) {
    console.error('Error adding expense:', error);
    throw error;
  } finally {
    client.release();
  }
}

export async function removeExpense(id: string): Promise<void> {
  const client = await pool.connect();
  try {
    await client.query('DELETE FROM expenses WHERE id = $1;', [id]);
  } catch (error) {
    console.error('Error removing expense:', error);
    throw error;
  } finally {
    client.release();
  }
} 