import { Product } from "@prisma/client";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { Suspense } from "react";

import { cache } from "@/lib/cache";
import { prisma } from "@/lib/prismaClient";

import { Button } from "@/components/ui/button";

import { ProductCard, ProductCardSkeleton } from "@/components/ProductCard";

export default function Homepage() {
  return (
    <main className="space-y-12">
      <ProductGridSection
        title="Most popular"
        productFetcher={getMostPopularProducts}
      />
      <ProductGridSection title="Newest" productFetcher={getNewestProducts} />
    </main>
  );
}
const getMostPopularProducts = cache(
  async () => {
    return await prisma.product.findMany({
      where: {
        isAvailableForPurchase: true,
      },
      orderBy: {
        order: {
          _count: "desc",
        },
      },
      take: 6,
    });
  },
  ["/", "getMostPopularProducts"],
  { revalidate: 60 * 60 * 24 },
);

const getNewestProducts = cache(
  async () => {
    return await prisma.product.findMany({
      where: {
        isAvailableForPurchase: true,
      },
      orderBy: { createdAt: "desc" },
      take: 6,
    });
  },
  ["/", "getNewestProducts"],
  { revalidate: 60 * 60 * 24 },
);

type ProductGridProps = {
  title: string;
  productFetcher: () => Promise<Product[]>;
};

function ProductGridSection({ productFetcher, title }: ProductGridProps) {
  return (
    <section className="space-y-4">
      <div className="flex justify-between">
        <h2 className="text-3xl font-bold">{title}</h2>
        <Button variant={"outline"} asChild>
          <Link href={"/products"} className="space-x-2">
            <span>View All</span>
            <ArrowRight className="size-4" />
          </Link>
        </Button>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Suspense
          fallback={
            <>
              <ProductCardSkeleton />
              <ProductCardSkeleton />
              <ProductCardSkeleton />
            </>
          }
        >
          <ProductSuspense productFetcher={productFetcher} />
        </Suspense>
      </div>
    </section>
  );
}

async function ProductSuspense({
  productFetcher,
}: {
  productFetcher: () => Promise<Product[]>;
}) {
  return (await productFetcher()).map((product) => (
    <ProductCard key={product.id} {...product} />
  ));
}
