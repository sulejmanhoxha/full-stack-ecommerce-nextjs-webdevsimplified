"use client";

import { createPaymentIntent, userOrderExists } from "@/app/actions/orders";
import { DiscountCodeType, Product } from "@prisma/client";
import { Elements, LinkAuthenticationElement, PaymentElement, useElements, useStripe } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { User } from "lucia";
import Image from "next/image";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { FormEvent, useRef, useState } from "react";

import { getDiscountedAmount } from "@/lib/discountCodeHelper";
import { formatCurrency, formatDiscountCode } from "@/lib/formatters";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type CheckoutFormProps = {
  user: User;
  amount: number;
  product: Product;
  discountCode?: {
    id: string;
    discountAmount: number;
    discountType: DiscountCodeType;
  };
};

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY as string);

export function CheckoutForm({ user, product, amount, discountCode }: CheckoutFormProps) {
  return (
    <Elements options={{ amount, mode: "payment", currency: "USD" }} stripe={stripePromise}>
      <PaymentForm user={user} priceInCents={amount} productId={product.id} discountCode={discountCode} />
    </Elements>
  );
}

function PaymentForm({
  user,
  priceInCents,
  productId,
  discountCode,
}: {
  user: User;
  priceInCents: number;
  productId: string;
  discountCode?: {
    id: string;
    discountAmount: number;
    discountType: DiscountCodeType;
  };
}) {
  const stripe = useStripe();
  const elements = useElements();
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string>();

  const discountCodeRef = useRef<HTMLInputElement>(null);
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();
  const coupon = searchParams.get("coupon");

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();

    if (stripe == null || elements == null || user == null) return;

    setIsLoading(true);

    const orderExists = await userOrderExists(user.email, productId);

    const formSubmit = await elements.submit();

    if (formSubmit.error != null) {
      setErrorMessage(formSubmit.error.message);
      setIsLoading(false);
      return;
    }

    const paymentIntent = await createPaymentIntent(user.email, productId, discountCode?.id);

    if (paymentIntent.error != null) {
      setErrorMessage(paymentIntent.error);
      setIsLoading(false);
      return;
    }

    stripe
      .confirmPayment({
        elements,
        clientSecret: paymentIntent.clientSecret,
        confirmParams: {
          return_url: `${process.env.NEXT_PUBLIC_SERVER_URL}/stripe/purchase-success`,
        },
      })
      .then(({ error }) => {
        if (error.type === "card_error" || error.type === "validation_error") {
          setErrorMessage(error.message);
        } else {
          setErrorMessage("An unknown error occurred");
        }
      })
      .finally(() => setIsLoading(false));
  }
  return (
    <form onSubmit={handleSubmit}>
      <Card>
        <CardHeader>
          <CardTitle>Checkout</CardTitle>
          <CardDescription className="text-destructive">
            {errorMessage && <div>{errorMessage}</div>}

            {coupon != null && discountCode == null && <div>Invalid discount code</div>}
          </CardDescription>
        </CardHeader>

        <CardContent>
          <PaymentElement />
          {/* <div className="mt-4">
            {/* kja krijen nji field per email, munesh mi rujt emailin e userit psh. 
            <LinkAuthenticationElement
              onChange={(e) => setEmail(e.value.email)}
            />
          </div> */}

          <div className="mt-4 space-y-2">
            <Label htmlFor="discountCode">Coupon</Label>
            <div className="flex items-center gap-4">
              <Input
                type="text"
                id="discountCode"
                name="discountCode"
                className="w-full max-w-xs "
                defaultValue={coupon || ""}
                ref={discountCodeRef}
              />
              <Button
                type="button"
                onClick={() => {
                  const params = new URLSearchParams(searchParams);
                  params.set("coupon", discountCodeRef.current?.value || "");
                  router.push(`${pathname}?${params.toString()}`);
                }}
              >
                Apply
              </Button>

              {discountCode ? (
                <div className="text-muted-foreground">{formatDiscountCode(discountCode)} discount</div>
              ) : (
                ""
              )}
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <Button className="w-full" size="lg" disabled={stripe == null || elements == null || isLoading}>
            {isLoading ? "Purchasing..." : `Purchase - ${formatCurrency(priceInCents / 100)}`}
          </Button>
        </CardFooter>
      </Card>
    </form>
  );
}
