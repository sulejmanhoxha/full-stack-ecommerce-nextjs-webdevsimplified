import { PageHeader } from "@/app/admin/_components/PageHeader";
import {
  ActiveToggleDropdown,
  DeleteDropdownItem,
} from "@/app/admin/products/_components/ProductActions";
import { CheckCircle2, MoreVertical, XCircle } from "lucide-react";
import Link from "next/link";

import { formatCurrency, formatNumber } from "@/lib/formatters";
import { prisma } from "@/lib/prismaClient";

import { Button } from "@/components/ui/button";
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

export default function AdminProductsPage() {
  return (
    <>
      <div className="mb-4 flex items-center justify-center gap-4">
        <PageHeader>Products</PageHeader>
        <Button asChild>
          <Link href="/admin/products/new">Add Product</Link>
        </Button>
      </div>

      <ProductsTable />
    </>
  );
}

async function ProductsTable() {
  const products = await prisma.product.findMany({
    select: {
      id: true,
      name: true,
      priceInCents: true,
      isAvailableForPurchase: true,
      _count: { select: { order: true } },
    },

    orderBy: {
      name: "asc",
    },
  });

  if (products.length === 0) return <p>No products found</p>;
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="w-0">
            <span className="sr-only ">Available For Purchase</span>
          </TableHead>

          <TableHead>Name</TableHead>
          <TableHead>Price</TableHead>
          <TableHead>Orders</TableHead>

          <TableHead className="w-0">
            <span className="sr-only ">Actions</span>
          </TableHead>
        </TableRow>
      </TableHeader>

      <TableBody>
        {products.map((product) => (
          <TableRow key={product.id}>
            <TableCell>
              {product.isAvailableForPurchase ? (
                <>
                  <CheckCircle2 />
                  <span className="sr-only">Available</span>
                </>
              ) : (
                <>
                  <XCircle className="stroke-destructive" />
                  <span className="sr-only">Unavailable</span>
                </>
              )}
            </TableCell>

            <TableCell>{product.name}</TableCell>

            <TableCell>{formatCurrency(product.priceInCents)}</TableCell>

            <TableCell>{formatNumber(product._count.order)}</TableCell>

            <TableCell>
              <DropdownMenu>
                <DropdownMenuTrigger>
                  <MoreVertical />
                  <span className="sr-only">Actions</span>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem asChild>
                    <a href={`/admin/products/${product.id}/download`} download>
                      Download
                    </a>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href={`/admin/products/${product.id}/edit`}>
                      Edit
                    </Link>
                  </DropdownMenuItem>

                  <ActiveToggleDropdown
                    id={product.id}
                    isAvailableForPurchase={product.isAvailableForPurchase}
                  />
                  {/* kete dona mi ba disabled nase ky product ka orders, se nase ka orders ather sguxen mi fshi */}
                  <DeleteDropdownItem
                    id={product.id}
                    disabled={product._count.order > 0}
                  />
                </DropdownMenuContent>
              </DropdownMenu>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
