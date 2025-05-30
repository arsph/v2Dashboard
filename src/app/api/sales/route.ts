import { NextResponse } from 'next/server';
import { getSales, addSale, removeSale } from '@/lib/db';

export async function GET() {
  try {
    const sales = await getSales();
    return NextResponse.json(sales);
  } catch (error) {
    console.error('Error fetching sales:', error);
    return NextResponse.json({ error: 'Failed to fetch sales' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const data = await request.json();
    const newSaleId = await addSale(data);
    return NextResponse.json({ id: newSaleId }, { status: 201 });
  } catch (error) {
    console.error('Error adding sale:', error);
    return NextResponse.json({ error: 'Failed to add sale' }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { id } = await request.json();
    await removeSale(id);
    return NextResponse.json({ message: 'Sale removed successfully' });
  } catch (error) {
    console.error('Error removing sale:', error);
    return NextResponse.json({ error: 'Failed to remove sale' }, { status: 500 });
  }
}
