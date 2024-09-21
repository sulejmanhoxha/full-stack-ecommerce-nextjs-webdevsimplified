import { PageHeader } from "@/app/admin/_components/PageHeader";
import { DeleteDropdownItem } from "@/app/admin/products/_components/ProductActions";
import { DeleteUserDropdownItem } from "@/app/admin/users/_components/UserActions";
import { MoreVertical } from "lucide-react";

import { formatCurrency, formatNumber } from "@/lib/formatters";
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

export default function UsersPage() {
  return (
    <>
      <PageHeader>Customers</PageHeader>
      <UsersTable />
    </>
  );
}

async function UsersTable() {
  const users = await prisma.user.findMany({
    select: {
      id: true,
      email: true,
      orders: {
        select: {
          pricePaidInCents: true,
        },
      },
    },

    orderBy: {
      orders: {
        _count: "desc",
      },
    },
  });

  if (users.length === 0) return <p>No users found</p>;
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Email</TableHead>
          <TableHead>Orders</TableHead>
          <TableHead>Value</TableHead>

          <TableHead className="w-0">
            <span className="sr-only ">Actions</span>
          </TableHead>
        </TableRow>
      </TableHeader>

      <TableBody>
        {users.map((user) => (
          <TableRow key={user.id}>
            <TableCell>{user.email}</TableCell>

            <TableCell>{formatNumber(user.orders.length)}</TableCell>
            <TableCell>
              {formatCurrency(
                user.orders.reduce((sum, o) => o.pricePaidInCents + sum, 0) /
                  100,
              )}
            </TableCell>

            <TableCell className="text-center">
              <DropdownMenu>
                <DropdownMenuTrigger>
                  <MoreVertical />
                  <span className="sr-only">Actions</span>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem>
                    <DeleteUserDropdownItem id={user.id} />
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
