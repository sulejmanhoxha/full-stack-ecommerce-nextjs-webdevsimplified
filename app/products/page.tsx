import { Product } from "@prisma/client";
import { Suspense } from "react";

import { cache } from "@/lib/cache";
import { prisma } from "@/lib/prismaClient";

import { ProductCard, ProductCardSkeleton } from "@/components/ProductCard";

export default function ProductsPage() {
  return (
    <main className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
      <Suspense
        fallback={
          <>
            <ProductCardSkeleton />
            <ProductCardSkeleton />
            <ProductCardSkeleton />
            <ProductCardSkeleton />
            <ProductCardSkeleton />
            <ProductCardSkeleton />
          </>
        }
      >
        <ProductSuspense productFetcher={getProducts} />
      </Suspense>
    </main>
  );
}

const getProducts = cache(
  async () => {
    return await prisma.product.findMany({
      where: {
        isAvailableForPurchase: true,
      },
      orderBy: {
        name: "asc",
      },
    });
  },
  ["/products", "getProducts"],
  { revalidate: 60 * 60 * 24 },
);

async function ProductSuspense({
  productFetcher,
}: {
  productFetcher: () => Promise<Product[]>;
}) {
  const products = await productFetcher();
  if (products.length === 0) return <p>No products found</p>;

  return products.map((product) => (
    <ProductCard key={product.id} {...product} />
  ));
}
