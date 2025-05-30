import { NextResponse } from 'next/server';
import { getExpenses, addExpense, removeExpense } from '@/lib/db';

interface Env {
  DB: D1Database;
}

export async function GET(request: Request) {
  const env = { DB: process.env.DB as unknown as D1Database }; // Access D1 via process.env
  try {
    const expenses = await getExpenses(env);
    return NextResponse.json(expenses);
  } catch (error) {
    console.error('Error fetching expenses:', error);
    return NextResponse.json({ error: 'Failed to fetch expenses' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const env = { DB: process.env.DB as unknown as D1Database }; // Access D1 via process.env
  try {
    const data = await request.json();
    const newExpense = await addExpense(env, data);
    return NextResponse.json(newExpense, { status: 201 });
  } catch (error) {
    console.error('Error adding expense:', error);
    return NextResponse.json({ error: 'Failed to add expense' }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  const env = { DB: process.env.DB as unknown as D1Database }; // Access D1 via process.env
  try {
    const { id } = await request.json();
    await removeExpense(env, id);
    return NextResponse.json({ message: 'Expense removed successfully' });
  } catch (error) {
    console.error('Error removing expense:', error);
    return NextResponse.json({ error: 'Failed to remove expense' }, { status: 500 });
  }
}
