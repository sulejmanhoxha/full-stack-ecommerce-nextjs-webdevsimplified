import { CheckoutForm } from "@/app/(customerFacing)/products/[id]/purchase/_components/CheckoutForm";
import Image from "next/image";
import { notFound, redirect } from "next/navigation";

import { getDiscountedAmount, usableDiscountCodeWhere } from "@/lib/discountCodeHelper";
import { formatCurrency } from "@/lib/formatters";
import { validateRequest } from "@/lib/luciaAuth";
import { prisma } from "@/lib/prismaClient";

export default async function PurchasePage({
  params: { id },
  searchParams: { coupon },
}: {
  params: { id: string };
  searchParams: { coupon: string };
}) {
  const product = await prisma.product.findUnique({
    where: {
      id: id,
    },
  });

  if (product === null) {
    return notFound();
  }

  const { user } = await validateRequest();

  if (!user) {
    return redirect("/signin");
  }

  const discountCode = coupon ? await getDiscountCode(coupon, product.id) : undefined;

  const amount = discountCode == null ? product.priceInCents : getDiscountedAmount(discountCode, product.priceInCents);
  const isDiscounted = amount !== product.priceInCents;

  return (
    <>
      <div className="mx-auto w-full max-w-5xl space-y-8">
        <div className="items-center gap-4 md:flex">
          <div className="relative aspect-video flex-shrink-0 md:w-1/3">
            <Image src={product.imagePath} alt={product.name} fill priority sizes="300px" className="object-cover" />
          </div>
          <div className="space-y-2">
            <div className="flex items-baseline gap-4 text-lg">
              <div className={isDiscounted ? "text-sm text-muted-foreground line-through" : ""}>
                {formatCurrency(product.priceInCents / 100)}
              </div>
              {isDiscounted ? <div>{formatCurrency(amount / 100)}</div> : ""}
            </div>
            <h1 className="text-2xl font-bold"> {product.name}</h1>
            <div className="line-clamp-3 text-muted-foreground">{product.description}</div>
          </div>
        </div>

        <CheckoutForm amount={amount} user={user} product={product} discountCode={discountCode || undefined} />
      </div>
    </>
  );
}

function getDiscountCode(coupon: string, productId: string) {
  return prisma.discountCode.findUnique({
    select: { id: true, discountAmount: true, discountType: true },
    where: { ...usableDiscountCodeWhere(productId), code: coupon },
  });
}
