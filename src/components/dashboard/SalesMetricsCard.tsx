import type { SalesMetric } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface SalesMetricsCardProps {
  metric: SalesMetric;
}

export function SalesMetricsCard({ metric }: SalesMetricsCardProps) {
  const Icon = metric.icon;
  return (
    <Card className="shadow-lg">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{metric.title}</CardTitle>
        <Icon className="h-5 w-5 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{metric.value}</div>
        {metric.change && (
          <p className="text-xs text-muted-foreground pt-1">{metric.change}</p>
        )}
      </CardContent>
    </Card>
  );
}
