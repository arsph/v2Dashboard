'use client';

import { useEffect, useState } from 'react';
import { getSales, addSale } from '@/lib/db';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function TestPage() {
  const [sales, setSales] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [addingSale, setAddingSale] = useState(false);
  const [dbStatus, setDbStatus] = useState<string>('Checking...');

  useEffect(() => {
    // Check database connection
    const checkConnection = async () => {
      try {
        const result = await getSales();
        setDbStatus('Database is connected');
      } catch (err) {
        console.error('Database connection error:', err);
        setDbStatus('Database connection failed');
      }
    };
    checkConnection();
  }, []);

  useEffect(() => {
    const fetchSales = async () => {
      try {
        console.log('Fetching sales...');
        const data = await getSales();
        console.log('Sales data:', data);
        setSales(data);
        setError(null);
      } catch (err) {
        console.error('Error fetching sales:', err);
        setError(err instanceof Error ? err.message : 'Failed to fetch sales');
      } finally {
        setLoading(false);
      }
    };

    fetchSales();
  }, []);

  const handleAddTestSale = async () => {
    setAddingSale(true);
    try {
      const testSale = {
        customer_name: 'Test Customer',
        date: new Date().toISOString(),
        traffic_amount: 1000,
        duration_months: 1,
        price: 100
      };
      console.log('Adding test sale:', testSale);
      await addSale(testSale);
      const updatedSales = await getSales();
      setSales(updatedSales);
    } catch (err) {
      console.error('Error adding test sale:', err);
      setError(err instanceof Error ? err.message : 'Failed to add test sale');
    } finally {
      setAddingSale(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4">Loading sales data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Database Connection Status</CardTitle>
        </CardHeader>
        <CardContent>
          <p className={`mb-4 ${dbStatus.includes('connected') ? 'text-green-500' : 'text-red-500'}`}>
            {dbStatus}
          </p>
          <Button
            onClick={handleAddTestSale}
            disabled={addingSale}
            className="w-full sm:w-auto"
          >
            {addingSale ? 'Adding...' : 'Add Test Sale'}
          </Button>
        </CardContent>
      </Card>

      {error && (
        <Card className="mb-6 border-red-500">
          <CardHeader>
            <CardTitle className="text-red-500">Error</CardTitle>
          </CardHeader>
          <CardContent>
            <p>{error}</p>
            <Button 
              onClick={() => window.location.reload()} 
              className="mt-4"
            >
              Retry
            </Button>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Sales List</CardTitle>
        </CardHeader>
        <CardContent>
          {sales.length === 0 ? (
            <p className="text-muted-foreground">No sales found</p>
          ) : (
            <div className="space-y-4">
              {sales.map((sale) => (
                <Card key={sale.id}>
                  <CardContent className="pt-6">
                    <div className="grid gap-2">
                      <p><strong>Customer:</strong> {sale.customer_name}</p>
                      <p><strong>Date:</strong> {new Date(sale.date).toLocaleDateString()}</p>
                      <p><strong>Price:</strong> ${sale.price}</p>
                      <p><strong>Traffic:</strong> {sale.traffic_amount}</p>
                      <p><strong>Duration:</strong> {sale.duration_months} months</p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
} 