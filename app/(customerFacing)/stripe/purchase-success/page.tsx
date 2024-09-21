import { Link } from "next-view-transitions";
import Image from "next/image";
import { notFound } from "next/navigation";
import Stripe from "stripe";

import { formatCurrency } from "@/lib/formatters";
import { prisma } from "@/lib/prismaClient";

import { Button } from "@/components/ui/button";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string);

export default async function SuccessPage({
  searchParams,
}: {
  searchParams: { payment_intent: string };
}) {
  const paymentIntent = await stripe.paymentIntents.retrieve(
    searchParams.payment_intent,
  );

  if (paymentIntent.metadata.productId == null) return notFound();

  const product = await prisma.product.findUnique({
    where: { id: paymentIntent.metadata.productId },
  });

  if (product == null) return notFound();

  const isSuccess = paymentIntent.status === "succeeded";
  return (
    <div className="mx-auto w-full max-w-5xl space-y-8">
      <h1 className="text-4xl font-bold">
        {isSuccess ? "Success!" : "Error!"}
      </h1>
      <div className="items-center gap-4 md:flex">
        <div className="relative aspect-video flex-shrink-0 md:w-1/3">
          <Image
            src={product.imagePath}
            alt={product.name}
            fill
            className="object-cover"
          />
        </div>
        <div className="space-y-2">
          <div className="text-lg">
            {formatCurrency(product.priceInCents / 100)}
          </div>
          <h1 className="text-2xl font-bold"> {product.name}</h1>
          <div className="line-clamp-3 text-muted-foreground">
            {product.description}
          </div>
        </div>

        <Button className="mt-4" size={"lg"} asChild>
          {isSuccess ? (
            <a
              href={`/products/download/${await createDownloadVerification(
                product.id,
              )}`}
            >
              Download
            </a>
          ) : (
            <Link href={`/products/${product.id}/purchase`}>Try Again</Link>
          )}
        </Button>
      </div>
    </div>
  );
}

async function createDownloadVerification(productId: string) {
  // ka me njat 24 sahat prej kur isht kriju
  return (
    await prisma.downloadVerification.create({
      data: {
        productId,
        expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24),
      },
    })
  ).id;
}
