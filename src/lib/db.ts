import { sql } from '@vercel/postgres';
import { Pool } from 'pg';

// Create a new pool using the connection string from environment variables
const pool = new Pool({
  connectionString: process.env.POSTGRES_URL,
  ssl: {
    rejectUnauthorized: false
  }
});

// Sales operations
export async function getSales() {
  try {
    console.log('Getting sales from database...');
    const result = await sql`
      SELECT * FROM sales 
      ORDER BY date DESC
    `;
    console.log('Successfully fetched sales:', result.rows);
    return result.rows;
  } catch (error) {
    console.error('Error in getSales:', error);
    throw new Error('Failed to fetch sales from database');
  }
}

export async function addSale(data: {
  customer_name: string;
  date: string;
  traffic_amount: number;
  duration_months: number;
  price: number;
}) {
  try {
    console.log('Adding sale to database:', data);
    const result = await sql`
      INSERT INTO sales (
        customer_name, 
        date, 
        traffic_amount, 
        duration_months, 
        price, 
        created_at
      ) VALUES (
        ${data.customer_name},
        ${data.date},
        ${data.traffic_amount},
        ${data.duration_months},
        ${data.price},
        ${new Date().toISOString()}
      )
      RETURNING id
    `;
    console.log('Successfully added sale with ID:', result.rows[0].id);
    return result.rows[0].id;
  } catch (error) {
    console.error('Error in addSale:', error);
    throw new Error('Failed to add sale to database');
  }
}

export async function removeSale(id: string) {
  try {
    console.log('Removing sale from database:', id);
    await sql`
      DELETE FROM sales 
      WHERE id = ${id}
    `;
    console.log('Successfully removed sale');
  } catch (error) {
    console.error('Error in removeSale:', error);
    throw new Error('Failed to remove sale from database');
  }
}

// Expenses operations
export async function getExpenses() {
  try {
    console.log('Getting expenses from database...');
    const result = await sql`
      SELECT * FROM expenses 
      ORDER BY date DESC
    `;
    console.log('Successfully fetched expenses:', result.rows);
    return result.rows;
  } catch (error) {
    console.error('Error in getExpenses:', error);
    throw new Error('Failed to fetch expenses from database');
  }
}

export async function addExpense(data: {
  server: string;
  date: string;
  price: number;
}) {
  try {
    console.log('Adding expense to database:', data);
    const result = await sql`
      INSERT INTO expenses (
        server, 
        date, 
        price, 
        created_at
      ) VALUES (
        ${data.server},
        ${data.date},
        ${data.price},
        ${new Date().toISOString()}
      )
      RETURNING id
    `;
    console.log('Successfully added expense with ID:', result.rows[0].id);
    return result.rows[0].id;
  } catch (error) {
    console.error('Error in addExpense:', error);
    throw new Error('Failed to add expense to database');
  }
}

export async function removeExpense(id: string) {
  try {
    console.log('Removing expense from database:', id);
    await sql`
      DELETE FROM expenses 
      WHERE id = ${id}
    `;
    console.log('Successfully removed expense');
  } catch (error) {
    console.error('Error in removeExpense:', error);
    throw new Error('Failed to remove expense from database');
  }
} 