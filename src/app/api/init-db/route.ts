import { NextResponse } from 'next/server';
import { initDatabase } from '@/lib/db';

export async function GET() {
  try {
    console.log('API: Starting database initialization...');
    console.log('API: Environment variables check:', {
      hasPostgresUrl: !!process.env.POSTGRES_URL,
      postgresUrlLength: process.env.POSTGRES_URL?.length
    });
    
    await initDatabase();
    console.log('API: Database initialization completed successfully');
    return NextResponse.json({ 
      success: true,
      message: 'Database initialized successfully' 
    });
  } catch (error) {
    console.error('API: Error initializing database:', error);
    const errorDetails = error instanceof Error ? {
      name: error.name,
      message: error.message,
      stack: error.stack
    } : 'Unknown error';
    
    return NextResponse.json(
      { 
        success: false,
        error: 'Failed to initialize database',
        details: errorDetails
      },
      { status: 500 }
    );
  }
} 