import PurchaseReceiptEmail from "@/app/email/PurchaseReceipt";
import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";
import Stripe from "stripe";

import { validateRequest } from "@/lib/luciaAuth";
import { prisma } from "@/lib/prismaClient";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string);
const resend = new Resend(process.env.RESEND_API_KEY as string);

export async function POST(req: NextRequest) {
  const event = await stripe.webhooks.constructEvent(
    await req.text(),
    req.headers.get("stripe-signature") as string,
    process.env.STRIPE_WEBHOOK_SECRET as string,
  );

  const { user } = await validateRequest();

  if (event.type === "charge.succeeded") {
    const charge = event.data.object;
    const productId = charge.metadata.productId;
    // const email = charge.billing_details.email;
    const pricePaidInCents = charge.amount;

    const product = await prisma.product.findUnique({
      where: { id: productId },
    });
    if (product == null || user == null) {
      return new NextResponse("Bad Request", { status: 400 });
    }

    // upsert will create a new user if one doesn't exist
    // const userFields = {
    //   email,
    //   orders: { create: { productId, pricePaidInCents } },
    // };
    // const {
    //   orders: [order],
    // } = await prisma.user.upsert({
    //   where: { email },
    //   create: userFields,
    //   update: userFields,
    //   select: { orders: { orderBy: { createdAt: "desc" }, take: 1 } },
    // });

    const order = await prisma.order.create({
      data: {
        userId: user.id,
        productId,
        pricePaidInCents,
      },
    });

    const downloadVerification = await prisma.downloadVerification.create({
      data: {
        productId,
        expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24),
      },
    });

    await resend.emails.send({
      from: `Support <${process.env.SENDER_EMAIL}>`,
      to: user.email,
      subject: "Order Confirmation",
      react: PurchaseReceiptEmail({
        order,
        product,
        downloadVerificationId: downloadVerification.id,
      }),
    });
  }

  return new NextResponse();
}
