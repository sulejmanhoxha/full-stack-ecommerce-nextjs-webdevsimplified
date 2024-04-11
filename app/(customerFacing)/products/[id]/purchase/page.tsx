import { CheckoutForm } from "@/app/(customerFacing)/products/[id]/purchase/_components/CheckoutForm";
import { notFound } from "next/navigation";
import Stripe from "stripe";

import { prisma } from "@/lib/prismaClient";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string);

export default async function PurchasePage({
  params: { id },
}: {
  params: { id: string };
}) {
  const product = await prisma.product.findUnique({
    where: {
      id: id,
    },
  });

  if (product === null) {
    return notFound();
  }

  const paymentIntent = await stripe.paymentIntents.create({
    amount: product.priceInCents,
    currency: "USD",
    metadata: { productId: product.id },
  });

  if (paymentIntent.client_secret == null) {
    throw Error("Stripe failed to create payment intent");
  }
  return (
    <CheckoutForm
      product={product}
      clientSecret={paymentIntent.client_secret}
    />
  );
}
