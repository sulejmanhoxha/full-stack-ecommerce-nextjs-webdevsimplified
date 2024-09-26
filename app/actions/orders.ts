"use server";

import Stripe from "stripe";

import { getDiscountedAmount, usableDiscountCodeWhere } from "@/lib/discountCodeHelper";
import { validateRequest } from "@/lib/luciaAuth";
import { prisma } from "@/lib/prismaClient";

export async function userOrderExists(email: string, productId: string) {
  return (
    (await prisma.order.findFirst({
      where: {
        user: { email },
        productId,
      },
      select: {
        id: true,
      },
    })) != null
  );
}

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string);

export async function createPaymentIntent(email: string, productId: string, discountCodeId?: string) {
  const product = await prisma.product.findUnique({
    where: {
      id: productId,
    },
  });

  if (product === null) {
    return { error: "Unexpected Error" };
  }
  const discountCode =
    discountCodeId == null
      ? null
      : await prisma.discountCode.findUnique({
          where: {
            ...usableDiscountCodeWhere(productId),
            id: discountCodeId,
          },
        });

  if (discountCode == null && discountCodeId != null) {
    return { error: "Coupon has expired" };
  }

  const { user } = await validateRequest();

  if (!user) {
    return { error: "Unauthorized" };
  }

  const existingOrder = await userOrderExists(user.email, productId);

  if (existingOrder != null) {
    return {
      error: "You have already purchased this product. Try downloading it from the My Orders page",
    };
  }

  const amount = discountCode == null ? product.priceInCents : getDiscountedAmount(discountCode, product.priceInCents);

  const paymentIntent = await stripe.paymentIntents.create({
    amount,
    currency: "USD",
    metadata: {
      productId: product.id,
      userId: user.id,
      discountCodeId: discountCode?.id || null,
    },
  });

  if (paymentIntent.client_secret == null) {
    return { error: "Unknown error" };
  }

  return { clientSecret: paymentIntent.client_secret };
}
