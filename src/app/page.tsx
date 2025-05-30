'use client'; 

import * as React from 'react';
import { SalesMetricsCard } from '@/components/dashboard/SalesMetricsCard';
import { SalesTrendChart } from '@/components/dashboard/SalesTrendChart';
import { RecentTransactionsTable } from '@/components/dashboard/RecentTransactionsTable';
import { mockDashboardData } from '@/lib/data';
import type { DashboardData, SalesMetric, TimeSeriesDataPoint, SalesTrendData } from '@/lib/types'; 
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { PlusCircle, SidebarOpen, DollarSign, Users, Database } from 'lucide-react';
import { useTransactions } from '@/context/TransactionsContext';
import { useSidebar } from '@/components/ui/sidebar';


export default function DashboardPage() {
  const { sales, expenses } = useTransactions();
  const { toggleSidebar, isMobile } = useSidebar();
  const [monthlyRevenue, setMonthlyRevenue] = React.useState<number>(0);
  const [monthlySalesTrend, setMonthlySalesTrend] = React.useState<TimeSeriesDataPoint[]>([]);
  const [monthlyGBSold, setMonthlyGBSold] = React.useState<number>(0);

  React.useEffect(() => {
    const currentDate = new Date();
    const currentMonth = currentDate.getMonth();
    const currentYear = currentDate.getFullYear();

    const currentMonthSales = sales
      .filter(t => {
        const transactionDate = new Date(t.date);
        return transactionDate.getMonth() === currentMonth && transactionDate.getFullYear() === currentYear;
      })
      .reduce((sum, t) => sum + t.price, 0);

    const currentMonthExpenses = expenses
      .filter(e => {
        const expenseDate = new Date(e.date);
        return expenseDate.getMonth() === currentMonth && expenseDate.getFullYear() === currentYear;
      })
      .reduce((sum, e) => sum + e.price, 0);

    setMonthlyRevenue(currentMonthSales - currentMonthExpenses);

    const currentMonthGBSold = sales
      .filter(t => {
        const transactionDate = new Date(t.date);
        return transactionDate.getMonth() === currentMonth && 
               transactionDate.getFullYear() === currentYear &&
               // Assuming 'unlimited' is not a valid number for traffic_amount
               // If 'unlimited' needs special handling, this logic might need adjustment
               typeof t.traffic_amount === 'number';
      })
      .reduce((sum, t) => {
        return sum + t.traffic_amount;
      }, 0);

    setMonthlyGBSold(currentMonthGBSold);
  }, [sales, expenses]);

  React.useEffect(() => {
    const formatMonthYear = (date: Date): string => {
      const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      const month = months[date.getMonth()];
      const year = date.getFullYear().toString().slice(-2);
      return `${month} '${year}`;
    };

    const salesData: TimeSeriesDataPoint[] = [];
    const now = new Date();

    for (let i = 5; i >= 0; i--) { // Iterate from 5 months ago to current month
      const targetDate = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const monthYearStr = formatMonthYear(targetDate);
      
      const salesForMonth = sales
        .filter(t => {
          const transactionDate = new Date(t.date);
          return transactionDate.getFullYear() === targetDate.getFullYear() &&
                 transactionDate.getMonth() === targetDate.getMonth();
        })
        .reduce((sum, t) => sum + t.price, 0);
      
      salesData.push({ date: monthYearStr, sales: salesForMonth });
    }
    setMonthlySalesTrend(salesData);
  }, [sales]);

  const monthlyRevenueMetric: SalesMetric = {
    title: "Monthly Revenue",
    value: `${monthlyRevenue.toLocaleString()} T`,
    change: "Current month",
    icon: DollarSign,
  };

  const monthlyGBSoldMetric: SalesMetric = {
    title: "GB Sold",
    value: `${monthlyGBSold.toLocaleString()} GB`,
    change: "Current month",
    icon: Database,
  };

  const otherStaticMetrics = mockDashboardData.salesMetrics.filter(
    (metric: SalesMetric) => metric.title !== "Total Revenue" && metric.title !== "Monthly Revenue" && metric.title !== "Churn Rate"
  );

  const displayMetrics: SalesMetric[] = [monthlyRevenueMetric, monthlyGBSoldMetric, ...otherStaticMetrics];

  const salesTrendChartData: SalesTrendData = {
    monthly: monthlySalesTrend,
    daily: [], // Provide empty arrays for daily/weekly as SalesTrendData expects them
    weekly: [],
  };


  return (
    <div className="flex-1 space-y-6 p-4 md:p-8 pt-6 bg-background min-h-screen">
      <div className="flex items-center justify-between space-y-2">
        <div className="flex items-center gap-2">
          {isMobile && (
             <Button variant="ghost" size="icon" onClick={toggleSidebar} className="md:hidden">
                <SidebarOpen className="h-5 w-5" />
                <span className="sr-only">Toggle Sidebar</span>
            </Button>
          )}
          <h1 className="text-3xl font-bold tracking-tight text-foreground">v2Dashboard</h1>
        </div>
        <div className="flex items-center space-x-2">
          <Button asChild variant="outline">
            <Link href="/import-sales">
              <PlusCircle className="mr-2 h-4 w-4" />
              Add New Sale
            </Link>
          </Button>
          <Button asChild variant="outline">
            <Link href="/import-expenses">
              <PlusCircle className="mr-2 h-4 w-4" />
              Add New Expense
            </Link>
          </Button>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-2">
        {displayMetrics.map((metric) => (
            <SalesMetricsCard key={metric.title} metric={metric} />
          ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-1 gap-6"> 
        <div className="lg:col-span-1"> 
          <SalesTrendChart data={salesTrendChartData} />
        </div>
      </div>

      <div>
        <RecentTransactionsTable transactions={sales.slice(0, 5)} /> 
      </div>
    </div>
  );
}
