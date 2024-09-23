import { PageHeader } from "@/app/admin/_components/PageHeader";
import { DiscountCodeForm } from "@/app/admin/discount-codes/_components/DiscountCodeForm";

import { prisma } from "@/lib/prismaClient";

export default async function NewDisountCodePage() {
  const products = await prisma.product.findMany({
    select: {
      name: true,
      id: true,
    },
    orderBy: {
      name: "asc",
    },
  });
  return (
    <>
      <PageHeader>Add Discount Code</PageHeader>
      <DiscountCodeForm products={products} />
    </>
  );
}
