"use client";

import { bestSellingProducts } from "@/app/admin/page";
import { Bar, BarChart, CartesianGrid, XAxis } from "recharts";

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";

const chartConfig = {
  orders: {
    label: "Orders",
    color: "hsl(var(--chart-1))",
  },
  name: {
    label: "Name",
    color: "hsl(var(--chart-2))",
  },
} satisfies ChartConfig;

export function BestProductsChart({ data }: { data: Awaited<ReturnType<typeof bestSellingProducts>> }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Best Selling Products</CardTitle>
        <CardDescription>The top 5 best selling products.</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <BarChart accessibilityLayer data={data}>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="name"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              tickFormatter={(value) => value.slice(0, 10)}
            />
            <ChartTooltip cursor={false} content={<ChartTooltipContent indicator="dashed" />} />
            <Bar dataKey="orders" fill="var(--color-orders)" radius={8} />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
