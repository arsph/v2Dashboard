import { NextResponse } from 'next/server';
import { getSales, addSale, removeSale } from '@/lib/db';

interface Env {
  DB: D1Database;
}

export async function GET(request: Request) {
  const env = { DB: process.env.DB as unknown as D1Database }; // Access D1 via process.env
  try {
    const sales = await getSales(env);
    return NextResponse.json(sales);
  } catch (error) {
    console.error('Error fetching sales:', error);
    return NextResponse.json({ error: 'Failed to fetch sales' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const env = { DB: process.env.DB as unknown as D1Database }; // Access D1 via process.env
  try {
    const data = await request.json();
    const newSale = await addSale(env, data);
    return NextResponse.json(newSale, { status: 201 });
  } catch (error) {
    console.error('Error adding sale:', error);
    return NextResponse.json({ error: 'Failed to add sale' }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  const env = { DB: process.env.DB as unknown as D1Database }; // Access D1 via process.env
  try {
    const { id } = await request.json();
    await removeSale(env, id);
    return NextResponse.json({ message: 'Sale removed successfully' });
  } catch (error) {
    console.error('Error removing sale:', error);
    return NextResponse.json({ error: 'Failed to remove sale' }, { status: 500 });
  }
}
