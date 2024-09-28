"use client";

import { getChartSalesData } from "@/app/admin/page";
import { TrendingUp } from "lucide-react";
import { CartesianGrid, Line, LineChart, XAxis } from "recharts";

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";

const chartConfig = {
  sum: {
    label: "Sum",
    color: "hsl(var(--chart-1))",
  },
} satisfies ChartConfig;

export function SalesChart({ data }: { data: Awaited<ReturnType<typeof getChartSalesData>> }) {
  const sales = data;

  const chartData = Array.from({ length: 12 }, (_, index) => {
    const monthDate = new Date();
    monthDate.setMonth(monthDate.getMonth() - index); // Go back in months

    const monthName = monthDate.toLocaleString("default", { month: "long" });

    const monthData = sales.map((data) => {
      if (
        data.createdAt.getMonth() === monthDate.getMonth() &&
        data.createdAt.getFullYear() === monthDate.getFullYear()
      ) {
        return data.pricePaidInCents;
      }
      return 0;
    });

    const sum = monthData.reduce((acc, curr) => acc + curr, 0) / 100; // Convert cents to dollars
    return {
      month: monthName,
      sum,
    };
  }).reverse(); // Reverse to start from the earliest month

  return (
    <Card>
      <CardHeader>
        <CardTitle>Sales</CardTitle>
        <CardDescription>A line chart showing the total revenue every month.</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <LineChart
            accessibilityLayer
            data={chartData}
            margin={{
              left: 12,
              right: 12,
            }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="month"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tickFormatter={(value) => value.slice(0, 3)}
            />
            <ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel />} />
            <Line dataKey="sum" type="linear" stroke="var(--color-sum)" strokeWidth={2} dot={false} />
          </LineChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
