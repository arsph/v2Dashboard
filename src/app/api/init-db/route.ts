import { NextResponse } from 'next/server';
import { initDatabase } from '@/lib/db';

export async function GET() {
  try {
    console.log('API: Starting database initialization...');
    await initDatabase();
    console.log('API: Database initialization completed successfully');
    return NextResponse.json({ 
      success: true,
      message: 'Database initialized successfully' 
    });
  } catch (error) {
    console.error('API: Error initializing database:', error);
    return NextResponse.json(
      { 
        success: false,
        error: 'Failed to initialize database',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
} 