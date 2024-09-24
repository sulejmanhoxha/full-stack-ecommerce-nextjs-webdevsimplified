import { SignInForm } from "@/app/(auth)/signin/_components/SignInForm";
import { CheckoutForm } from "@/app/(customerFacing)/products/[id]/purchase/_components/CheckoutForm";
import { Link } from "next-view-transitions";
import Image from "next/image";
import { notFound, redirect } from "next/navigation";
import Stripe from "stripe";

import {
  getDiscountedAmount,
  usableDiscountCodeWhere,
} from "@/lib/discountCodeHelper";
import { formatCurrency } from "@/lib/formatters";
import { validateRequest } from "@/lib/luciaAuth";
import { prisma } from "@/lib/prismaClient";

import { Button } from "@/components/ui/button";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string);

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

  const discountCode = coupon
    ? await getDiscountCode(coupon, product.id)
    : undefined;

  const amount =
    discountCode == null
      ? product.priceInCents
      : getDiscountedAmount(discountCode, product.priceInCents);
  const isDiscounted = amount !== product.priceInCents;
  const { user } = await validateRequest();

  if (!user) {
    return redirect("/signin");
  }

  const paymentIntent = await stripe.paymentIntents.create({
    amount: product.priceInCents,
    currency: "USD",
    metadata: { productId: product.id, userId: user.id },
  });

  if (paymentIntent.client_secret == null) {
    throw Error("Stripe failed to create payment intent");
  }
  return (
    <>
      <div className="mx-auto w-full max-w-5xl space-y-8">
        <div className="items-center gap-4 md:flex">
          <div className="relative aspect-video flex-shrink-0 md:w-1/3">
            <Image
              src={product.imagePath}
              alt={product.name}
              fill
              priority
              sizes="300px"
              className="object-cover"
            />
          </div>
          <div className="space-y-2">
            <div className="flex items-baseline gap-4 text-lg">
              <div
                className={
                  isDiscounted
                    ? "text-sm text-muted-foreground line-through"
                    : ""
                }
              >
                {" "}
                {formatCurrency(product.priceInCents / 100)}
              </div>
              {isDiscounted ? <div>{formatCurrency(amount / 100)}</div> : ""}
            </div>
            <h1 className="text-2xl font-bold"> {product.name}</h1>
            <div className="line-clamp-3 text-muted-foreground">
              {product.description}
            </div>
          </div>
        </div>

        <CheckoutForm
          user={user}
          product={product}
          clientSecret={paymentIntent.client_secret}
          discountCode={discountCode || undefined}
        />
      </div>
    </>
  );
}

function getDiscountCode(coupon: string, productId: string) {
  return prisma.discountCode.findUnique({
    select: { id: true, discountAmount: true, discountType: true },
    where: { ...usableDiscountCodeWhere, code: coupon },
  });
}
