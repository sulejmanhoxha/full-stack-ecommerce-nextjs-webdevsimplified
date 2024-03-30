import { prisma } from "@/lib/prismaClient";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
} from "@/components/ui/card";

async function getSalesData() {
  const data = await prisma.order.aggregate({
    _sum: { pricePaidInCents: true },
    _count: true,
  });

  return {
    amount: (data._sum.pricePaidInCents || 0) / 100, // Convert cents to dollars
    numberOfSales: data._count,
  };
}

export default async function AdminDashboard() {
  const salesData = await getSalesData();
  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
      <DashboardCard
        title="Sales"
        subtitle={salesData.numberOfSales}
        body={salesData.amount}
      />
    </div>
  );
}

type DashboardCardProps = {
  title: string;
  subtitle: string;
  body: string;
};

function DashboardCard({ title, subtitle, body }: DashboardCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardHeader>{title}</CardHeader>
      </CardHeader>
      <CardDescription>{subtitle}</CardDescription>
      <CardContent>
        <p>{body}</p>
      </CardContent>
    </Card>
  );
}
