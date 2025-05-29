'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export default function InitPage() {
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState<string>('');

  const initializeDatabase = async () => {
    setStatus('loading');
    try {
      const response = await fetch('/api/init-db');
      const data = await response.json();
      
      if (response.ok) {
        setStatus('success');
        setMessage(data.message);
      } else {
        setStatus('error');
        setMessage(data.details || 'Failed to initialize database');
      }
    } catch (error) {
      setStatus('error');
      setMessage(error instanceof Error ? error.message : 'An unknown error occurred');
    }
  };

  return (
    <div className="container mx-auto py-10">
      <Card>
        <CardHeader>
          <CardTitle>Database Initialization</CardTitle>
          <CardDescription>
            Click the button below to initialize the database tables
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <Button 
              onClick={initializeDatabase}
              disabled={status === 'loading'}
            >
              {status === 'loading' ? 'Initializing...' : 'Initialize Database'}
            </Button>
            
            {status !== 'idle' && (
              <div className={`p-4 rounded-md ${
                status === 'success' ? 'bg-green-100 text-green-800' :
                status === 'error' ? 'bg-red-100 text-red-800' :
                'bg-gray-100 text-gray-800'
              }`}>
                {message}
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 