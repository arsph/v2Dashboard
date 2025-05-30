import { NextResponse } from 'next/server';
import { getExpenses, addExpense, removeExpense } from '@/lib/db';

export async function GET() {
  try {
    const expenses = await getExpenses();
    return NextResponse.json(expenses);
  } catch (error) {
    console.error('Error fetching expenses:', error);
    return NextResponse.json({ error: 'Failed to fetch expenses' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const data = await request.json();
    const newExpenseId = await addExpense(data);
    return NextResponse.json({ id: newExpenseId }, { status: 201 });
  } catch (error) {
    console.error('Error adding expense:', error);
    return NextResponse.json({ error: 'Failed to add expense' }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { id } = await request.json();
    await removeExpense(id);
    return NextResponse.json({ message: 'Expense removed successfully' });
  } catch (error) {
    console.error('Error removing expense:', error);
    return NextResponse.json({ error: 'Failed to remove expense' }, { status: 500 });
  }
}
