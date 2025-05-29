"use client";

import * as React from 'react';
import { Pie, PieChart, ResponsiveContainer, Cell, Tooltip } from 'recharts';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import type { SalesBreakdownData, BreakdownDataPoint } from '@/lib/types';
import { Layers, MapPin, AppWindow } from 'lucide-react';
import {
  ChartConfig,
  ChartContainer,
  ChartTooltipContent,
} from '@/components/ui/chart';

interface SalesBreakdownChartsProps {
  data: SalesBreakdownData;
}

const defaultChartConfig: ChartConfig = {
  value: {
    label: 'Count',
  },
};

const BreakdownSection: React.FC<{ title: string; data: BreakdownDataPoint[]; icon: React.ElementType; chartConfig: ChartConfig }> = ({ title, data, icon: Icon, chartConfig }) => {
  const totalValue = React.useMemo(() => {
    return data.reduce((acc, curr) => acc + curr.value, 0)
  }, [data]);
  
  return (
    <div className="flex flex-col items-center">
      <div className="flex items-center gap-2 mb-2">
        <Icon className="h-5 w-5 text-muted-foreground" />
        <h4 className="font-medium text-sm">{title}</h4>
      </div>
      <div className="w-full h-[150px]">
        <ChartContainer config={chartConfig} className="mx-auto aspect-square h-full">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Tooltip
                cursor={false}
                content={<ChartTooltipContent hideLabel nameKey="name" />}
              />
              <Pie
                data={data}
                dataKey="value"
                nameKey="name"
                innerRadius={30}
                outerRadius={50}
                strokeWidth={2}
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.fill || `hsl(var(--chart-${index + 1}))`} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
        </ChartContainer>
      </div>
      <ul className="mt-3 w-full text-xs text-muted-foreground space-y-1">
        {data.map((item) => (
           <li key={item.name} className="flex items-center justify-between">
             <div className="flex items-center gap-1.5">
               <span
                 className="size-2 shrink-0 rounded-[2px]"
                 style={{ backgroundColor: item.fill || `hsl(var(--chart-${data.indexOf(item) + 1}))` }}
               />
               {item.name}
             </div>
             <span>{((item.value / totalValue) * 100).toFixed(1)}%</span>
           </li>
        ))}
      </ul>
    </div>
  );
};

export function SalesBreakdownCharts({ data }: SalesBreakdownChartsProps) {
  const tierChartConfig = React.useMemo(() => {
    const config: ChartConfig = {};
    data.byTier.forEach(item => {
      config[item.name] = { label: item.name, color: item.fill };
    });
    return config;
  }, [data.byTier]);

  const locationChartConfig = React.useMemo(() => {
    const config: ChartConfig = {};
    data.byLocation.forEach(item => {
      config[item.name] = { label: item.name, color: item.fill };
    });
    return config;
  }, [data.byLocation]);
  
  const platformChartConfig = React.useMemo(() => {
    const config: ChartConfig = {};
    data.byPlatform.forEach(item => {
      config[item.name] = { label: item.name, color: item.fill };
    });
    return config;
  }, [data.byPlatform]);

  return (
    <Card className="shadow-lg h-full">
      <CardHeader>
        <CardTitle>Sales Breakdowns</CardTitle>
        <CardDescription>Detailed view of sales segments</CardDescription>
      </CardHeader>
      <CardContent className="grid grid-cols-1 gap-8">
        <BreakdownSection title="By Subscription Tier" data={data.byTier} icon={Layers} chartConfig={tierChartConfig} />
        <BreakdownSection title="By Geographic Location" data={data.byLocation} icon={MapPin} chartConfig={locationChartConfig} />
        <BreakdownSection title="By Platform" data={data.byPlatform} icon={AppWindow} chartConfig={platformChartConfig} />
      </CardContent>
    </Card>
  );
}
