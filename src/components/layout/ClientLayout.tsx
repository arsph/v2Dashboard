'use client';

import { useEffect } from 'react';

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  useEffect(() => {
    const initDb = async () => {
      try {
        console.log('Layout: Attempting to initialize database...');
        const response = await fetch('/api/init-db');
        if (!response.ok) {
          throw new Error('Failed to initialize database');
        }
        console.log('Layout: Database initialized successfully');
      } catch (error) {
        console.error('Layout: Error during database initialization:', error);
      }
    };

    initDb();
  }, []);

  return <>{children}</>;
} 