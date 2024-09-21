import { PageHeader } from "@/app/admin/_components/PageHeader";
import { DeleteOrderDropdownItem } from "@/app/admin/orders/_components/OrderActions";
import { MoreVertical } from "lucide-react";

import { formatCurrency } from "@/lib/formatters";
import { prisma } from "@/lib/prismaClient";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export default function OrdersPage() {
  return (
    <>
      <PageHeader>Orders</PageHeader>
      <OrdersTable />
    </>
  );
}

async function OrdersTable() {
  const orders = await prisma.order.findMany({
    select: {
      id: true,
      pricePaidInCents: true,
      product: {
        select: {
          name: true,
        },
      },
      user: {
        select: {
          email: true,
        },
      },
    },

    orderBy: {
      createdAt: "desc",
    },
  });

  if (orders.length === 0) return <p>No orders found</p>;

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Products</TableHead>
          <TableHead>Customer</TableHead>
          <TableHead>Price Paid</TableHead>

          <TableHead className="w-0">
            <span className="sr-only ">Actions</span>
          </TableHead>
        </TableRow>
      </TableHeader>

      <TableBody>
        {orders.map((order) => (
          <TableRow key={order.id}>
            <TableCell>{order.product.name}</TableCell>

            <TableCell>{order.user.email}</TableCell>
            <TableCell>
              {formatCurrency(order.pricePaidInCents / 100)}
            </TableCell>

            <TableCell className="text-center">
              <DropdownMenu>
                <DropdownMenuTrigger>
                  <MoreVertical />
                  <span className="sr-only">Actions</span>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem>
                    <DeleteOrderDropdownItem id={order.id} />
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
