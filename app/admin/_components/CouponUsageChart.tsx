"use client";

import { TcouponUSage } from "@/app/admin/page";
import { useMemo } from "react";
import { LabelList, Pie, PieChart } from "recharts";

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";

const COLORS = [
  "hsl(var(--chart-1))",
  "hsl(var(--chart-2))",
  "hsl(var(--chart-3))",
  "hsl(var(--chart-4))",
  "hsl(var(--chart-5))",
];

export function CouponUsageChart({ data }: { data: TcouponUSage }) {
  const chartData = useMemo(() => {
    return data.map((data, index) => {
      return { coupon: data.coupon, usage: data.usage, fill: COLORS[index] };
    });
  }, [data]); // Memoize chartData based on data

  const chartConfig = useMemo(() => {
    return {
      usage: {
        label: "Usage",
      },
      ...Object.fromEntries(chartData.map((data) => [data.coupon, { label: data.coupon, color: data.fill }])),
    } satisfies ChartConfig;
  }, [chartData]); // Memoize chartConfig based on chartData

  return (
    <Card className="flex flex-col">
      <CardHeader className="items-center pb-0">
        <CardTitle>Most Used Coupons</CardTitle>
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        <ChartContainer config={chartConfig} className="mx-auto aspect-square max-h-[250px]">
          <PieChart>
            <ChartTooltip content={<ChartTooltipContent nameKey="usage" hideLabel />} />
            <Pie data={chartData} label nameKey="usage" dataKey="usage">
              <LabelList
                dataKey="coupon"
                className="fill-background"
                stroke="none"
                fontSize={12}
                formatter={(value: keyof typeof chartConfig) => chartConfig[value]?.label}
              />
            </Pie>
          </PieChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
