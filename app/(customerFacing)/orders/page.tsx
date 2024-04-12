import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";

import { formatCurrency, formatDate } from "@/lib/formatters";
import { validateRequest } from "@/lib/luciaAuth";
import { prisma } from "@/lib/prismaClient";

import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export default async function OrdersPage() {
  const { user } = await validateRequest();
  if (!user) {
    return redirect("/signin");
  }

  const userOrders = await prisma.order.findMany({
    where: {
      user: {
        email: user.email,
      },
    },
    select: {
      product: true,
      id: true,
      createdAt: true,
      pricePaidInCents: true,
    },
  });

  console.log(userOrders);

  return (
    <main>
      <h1 className="text-4xl font-semibold">Orders</h1>

      {userOrders.length === 0 && <p>You have not placed any orders yet.</p>}
      {userOrders.length > 0 && (
        <Table>
          <TableCaption>The list of your orders.</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead>Product Name</TableHead>
              <TableHead>Price paid</TableHead>
              <TableHead>Date paid</TableHead>
              <TableHead>Download link</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {userOrders.map((order) => (
              <TableRow key={order.id}>
                <TableCell>{order.product.name}</TableCell>
                <TableCell>{formatCurrency(order.pricePaidInCents)}</TableCell>
                <TableCell>{formatDate(order.createdAt)}</TableCell>
                <TableCell>
                  <Button asChild>
                    <Link href={`/orders/${order.product.id}/download`}>
                      Download
                    </Link>
                  </Button>
                </TableCell>
              </TableRow>
            ))}
            <TableRow></TableRow>
          </TableBody>
        </Table>
      )}
    </main>
  );
}
