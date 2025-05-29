export interface SalesMetric {
  title: string;
  value: string;
  change?: string;
  icon: React.ElementType;
}

export interface TimeSeriesDataPoint {
  date: string; // Format: "YYYY-MM-DD" or "Month 'YY" or "Wk X"
  sales: number;
}

export interface SalesTrendData {
  daily: TimeSeriesDataPoint[];
  weekly: TimeSeriesDataPoint[];
  monthly: TimeSeriesDataPoint[];
}

export interface BreakdownDataPoint {
  name: string;
  value: number;
  fill?: string; // Optional color for charts
}

export interface SalesBreakdownData {
  byTier: BreakdownDataPoint[];
  byLocation: BreakdownDataPoint[];
  byPlatform: BreakdownDataPoint[];
}

export interface Transaction {
  id: string;
  customer_name: string;
  date: string; // ISO date string
  trafficAmount: string; // e.g., "Unlimited", "500 GB"
  durationMonths: number;
  price: number;
}

export interface Expense {
  id: string;
  server: 'DE' | 'IR';
  date: string; // ISO date string
  price: number;
}

export interface DashboardData {
  salesMetrics: SalesMetric[];
  salesTrend: SalesTrendData;
  salesBreakdown: SalesBreakdownData;
  recentTransactions: Transaction[];
  expenses: Expense[]; // Added expenses here
}

// Schema types for forms
import { z } from 'zod';

export const SaleFormSchema = z.object({
  customer_name: z.string().min(1, "Customer name is required"),
  date: z.date({ required_error: "Date is required" }),
  trafficAmount: z.string().min(1, "Traffic amount is required"),
  durationMonths: z.coerce.number().min(1, "Duration must be at least 1 month"),
  price: z.coerce.number().positive("Price must be a positive number"),
});
export type SaleFormData = z.infer<typeof SaleFormSchema>;

export const ExpenseFormSchema = z.object({
  server: z.enum(["DE", "IR"], { required_error: "Server location is required" }),
  date: z.date({ required_error: "Date is required" }),
  price: z.coerce.number().positive("Price must be a positive number"),
});
export type ExpenseFormData = z.infer<typeof ExpenseFormSchema>;
