import { BestProductsChart } from "@/app/admin/_components/BestProductsChart";
import { CouponUsageChart } from "@/app/admin/_components/CouponUsageChart";
import { SalesChart } from "@/app/admin/_components/SalesChart";

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

async function getChartSalesData() {
  const salesOverTime = await prisma.order.findMany({
    select: {
      createdAt: true,
      pricePaidInCents: true,
    },
    where: {
      createdAt: {
        gte: new Date(new Date().setFullYear(new Date().getFullYear() - 1)), // Last year
      },
    },
    orderBy: {
      createdAt: "asc",
    },
  });

  return salesOverTime;
}

async function bestSellingProducts() {
  const result = await prisma.product.findMany({
    select: {
      name: true,
      _count: {
        select: { order: true },
      },
    },
    orderBy: {
      order: {
        _count: "desc",
      },
    },
    take: 5, // adjusted for top 5 products
  });

  const topSellingProducts = result.map((data) => {
    return { name: data.name, orders: data._count.order };
  });

  return topSellingProducts;
}

async function couponUSage() {
  const result = await prisma.discountCode.findMany({
    where: {
      isActive: true,
    },
    select: {
      code: true,
      _count: {
        select: { orders: true },
      },
    },
    orderBy: {
      orders: {
        _count: "desc",
      },
    },
    take: 5, // adjusted for top 5  coupons
  });

  const discountCodeUsage = result.map((data) => {
    return { coupon: data.code, usage: data._count.orders };
  });

  return discountCodeUsage;
}

export type TbestSellingProducts = Awaited<ReturnType<typeof bestSellingProducts>>;
export type TcouponUSage = Awaited<ReturnType<typeof couponUSage>>;
export type TsalesOverTime = Awaited<ReturnType<typeof getChartSalesData>>;

export default async function AdminDashboard() {
  const [salesData, usersData, productData, chartSalesData, topSellingProducts, discountCodeUsage] = await Promise.all([
    getSalesData(),
    getUsersData(),
    getProductData(),
    getChartSalesData(),
    bestSellingProducts(),
    couponUSage(),
  ]);

  return (
    <>
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

      <div className="mt-10 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        <SalesChart data={chartSalesData} />
        <BestProductsChart data={topSellingProducts} />
        <CouponUsageChart data={discountCodeUsage} />
      </div>
    </>
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
