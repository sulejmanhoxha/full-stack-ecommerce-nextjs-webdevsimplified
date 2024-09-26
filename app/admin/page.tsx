import { formatCurrency, formatNumber } from "@/lib/formatters";
import { prisma } from "@/lib/prismaClient";

import { Card, CardContent, CardDescription, CardHeader } from "@/components/ui/card";

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

async function getUsersData() {
  const [userCount, orderData] = await Promise.all([
    await prisma.user.count(),
    await prisma.order.aggregate({
      _sum: { pricePaidInCents: true },
    }),
  ]);

  return {
    userCount,
    averageValuePerUser: userCount === 0 ? 0 : (orderData._sum.pricePaidInCents || 0) / userCount / 100, // Convert cents to dollars
  };
}

async function getProductData() {
  const [activeCount, inactiveCount] = await Promise.all([
    await prisma.product.count({ where: { isAvailableForPurchase: true } }),
    await prisma.product.count({ where: { isAvailableForPurchase: false } }),
  ]);

  return {
    activeCount,
    inactiveCount,
  };
}

export default async function AdminDashboard() {
  const [salesData, usersData, productData] = await Promise.all([getSalesData(), getUsersData(), getProductData()]);
  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
      <DashboardCard
        title="Sales"
        subtitle={`${formatNumber(salesData.numberOfSales)} Orders`}
        body={formatCurrency(salesData.amount)}
      />

      <DashboardCard
        title="Customer"
        subtitle={`${formatCurrency(usersData.averageValuePerUser)} Average Value`}
        body={formatNumber(usersData.userCount)}
      />

      <DashboardCard
        title="Active Products"
        subtitle={`${formatNumber(productData.inactiveCount)} Inactive`}
        body={formatNumber(productData.activeCount)}
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
        <CardDescription>{subtitle}</CardDescription>
      </CardHeader>
      <CardContent>
        <p>{body}</p>
      </CardContent>
    </Card>
  );
}
