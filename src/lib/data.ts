import type { DashboardData, Expense, SalesMetric } from './types'; // Added SalesMetric
import { DollarSign, Users, TrendingDown, Layers, MapPin, AppWindow, Smartphone, Laptop, Tablet } from 'lucide-react';

const today = new Date();
const formatDate = (date: Date): string => date.toISOString().split('T')[0];
const formatMonthYear = (date: Date): string => {
  const month = date.toLocaleString('default', { month: 'short' });
  const year = date.getFullYear().toString().slice(-2);
  return `${month} '${year}`;
};

const mockExpenses: Expense[] = [
  { id: "exp_1", server: "DE", date: new Date(new Date().setDate(new Date().getDate() - 5)).toISOString(), price: 50 },
  { id: "exp_2", server: "IR", date: new Date(new Date().setDate(new Date().getDate() - 10)).toISOString(), price: 76 },
  { id: "exp_3", server: "DE", date: new Date(new Date().setMonth(new Date().getMonth() - 1)).toISOString(), price: 50 },
];

// Updated salesMetrics: Removed Total Revenue, Monthly Revenue will be dynamically added
const salesMetrics: SalesMetric[] = [
  // { title: "Total Revenue", value: "1,250,345 T", change: "+12.5% from last month", icon: DollarSign }, // This will be replaced by dynamic Monthly Revenue
];

export const mockDashboardData: DashboardData = {
  salesMetrics: salesMetrics,
  salesTrend: {
    daily: Array.from({ length: 30 }, (_, i) => {
      const date = new Date(today);
      date.setDate(today.getDate() - (29 - i));
      return { date: formatDate(date), sales: Math.floor(Math.random() * 5000) + 1000 };
    }),
    weekly: Array.from({ length: 12 }, (_, i) => {
      const date = new Date(today);
      date.setDate(today.getDate() - (11 - i) * 7);
      return { date: `Wk ${i + 1}`, sales: Math.floor(Math.random() * 30000) + 10000 };
    }),
    monthly: Array.from({ length: 12 }, (_, i) => {
      const date = new Date(today);
      date.setMonth(today.getMonth() - (11 - i));
      return { date: formatMonthYear(date), sales: Math.floor(Math.random() * 150000) + 50000 };
    }),
  },
  salesBreakdown: { 
    byTier: [
      { name: "Basic", value: 4500, fill: "hsl(var(--chart-1))" },
      { name: "Standard", value: 7800, fill: "hsl(var(--chart-2))" },
      { name: "Premium", value: 3489, fill: "hsl(var(--chart-3))" },
    ],
    byLocation: [
      { name: "North America", value: 6200, fill: "hsl(var(--chart-1))" },
      { name: "Europe", value: 5100, fill: "hsl(var(--chart-2))" },
      { name: "Asia", value: 3500, fill: "hsl(var(--chart-3))" },
      { name: "Other", value: 989, fill: "hsl(var(--chart-4))" },
    ],
    byPlatform: [
      { name: "Desktop", value: 8200, fill: "hsl(var(--chart-1))" },
      { name: "Mobile", value: 6500, fill: "hsl(var(--chart-2))" },
      { name: "Router", value: 1089, fill: "hsl(var(--chart-3))" },
    ],
  },
  recentTransactions: [
    { id: "txn_1", customer_name: "user_a@example.com", date: new Date(new Date().setDate(new Date().getDate() - 1)).toISOString(), traffic_amount: 0, durationMonths: 12, price: 100 },
    { id: "txn_2", customer_name: "user_b@example.com", date: new Date(new Date().setDate(new Date().getDate() - 2)).toISOString(), traffic_amount: 500, durationMonths: 1, price: 10 },
    { id: "txn_3", customer_name: "user_c@example.com", date: new Date(new Date().setDate(new Date().getDate() - 2)).toISOString(), traffic_amount: 100, durationMonths: 6, price: 30 },
    { id: "txn_4", customer_name: "user_d@example.com", date: new Date(new Date().setDate(new Date().getDate() - 3)).toISOString(), traffic_amount: 0, durationMonths: 1, price: 13 },
    { id: "txn_5", customer_name: "user_e@example.com", date: new Date(new Date().setDate(new Date().getDate() - 4)).toISOString(), traffic_amount: 500, durationMonths: 12, price: 90 },
  ],
  expenses: mockExpenses,
};
