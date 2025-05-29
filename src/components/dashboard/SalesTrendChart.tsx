
"use client";

import * as React from 'react';
import { Bar, BarChart, CartesianGrid, XAxis, YAxis, ResponsiveContainer } from 'recharts';
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import type { SalesTrendData } from '@/lib/types';

interface SalesTrendChartProps {
  data: SalesTrendData;
}

const chartConfig: ChartConfig = {
  sales: {
    label: 'Sales',
    color: 'hsl(var(--accent))',
  },
};

function CustomTooltip({ active, payload, label }: any) {
  if (active && payload && payload.length) {
    return (
      <div className="rounded-lg border bg-background p-2 shadow-sm">
        <div className="grid grid-cols-1 gap-1.5">
          <span className="text-sm font-semibold text-foreground">{label}</span>
          <span className="text-sm text-muted-foreground">
            Sales:
            <span className="ml-2 font-mono font-medium text-foreground">
              {payload[0].value.toLocaleString()} T
            </span>
          </span>
        </div>
      </div>
    );
  }
  return null;
}

export function SalesTrendChart({ data }: SalesTrendChartProps) {
  const monthlyData = data.monthly;

  return (
    <Card className="shadow-lg">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <div>
          <CardTitle>Monthly Sales Trends</CardTitle>
          <CardDescription>Overview of monthly sales performance (Last 6 Months)</CardDescription>
        </div>
      </CardHeader>
      <CardContent className="pb-4">
        <div className="h-[350px]">
          <ChartContainer config={chartConfig} className="h-full w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={monthlyData} margin={{ top: 5, right: 20, left: -20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
                <XAxis 
                  dataKey="date" 
                  tickLine={false} 
                  axisLine={false} 
                  tickMargin={8}
                  style={{ fontSize: '0.75rem', fill: 'hsl(var(--muted-foreground))' }}
                />
                <YAxis 
                  tickLine={false} 
                  axisLine={false} 
                  tickMargin={8}
                  tickFormatter={(value) => `${(value / 1000)}k T`}
                  style={{ fontSize: '0.75rem', fill: 'hsl(var(--muted-foreground))' }}
                />
                <ChartTooltip content={<CustomTooltip />} cursor={{ fill: "hsl(var(--card))" }}/>
                <Bar dataKey="sales" fill="var(--color-sales)" radius={4} />
              </BarChart>
            </ResponsiveContainer>
          </ChartContainer>
        </div>
      </CardContent>
    </Card>
  );
}
