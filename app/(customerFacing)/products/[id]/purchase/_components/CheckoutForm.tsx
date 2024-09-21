"use client";

import { userOrderExists } from "@/app/actions/orders";
import { Product } from "@prisma/client";
import {
  Elements,
  LinkAuthenticationElement,
  PaymentElement,
  useElements,
  useStripe,
} from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { User } from "lucia";
import Image from "next/image";
import { FormEvent, useState } from "react";

import { formatCurrency } from "@/lib/formatters";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

type CheckoutFormProps = {
  user: User;
  product: Product;
  clientSecret: string;
};

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY as string,
);

export function CheckoutForm({
  user,
  product,
  clientSecret,
}: CheckoutFormProps) {
  return (
    <Elements options={{ clientSecret }} stripe={stripePromise}>
      <PaymentForm
        user={user}
        priceInCents={product.priceInCents}
        productId={product.id}
      />
    </Elements>
  );
}

function PaymentForm({
  user,
  priceInCents,
  productId,
}: {
  user: User;
  priceInCents: number;
  productId: string;
}) {
  const stripe = useStripe();
  const elements = useElements();
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string>();
  // const [email, setEmail] = useState<string>("");

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();

    // if (stripe == null || elements == null || email == null) return;
    if (stripe == null || elements == null) return;
    if (stripe == null || elements == null) return;

    setIsLoading(true);

    const orderExists = await userOrderExists(user.email, productId);

    if (orderExists) {
      setErrorMessage(
        "You have already purchased this product. Try downloading it from the My Orders page",
      );
      setIsLoading(false);
      return;
    }
    // check for existing order
    stripe
      .confirmPayment({
        elements,
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
          {errorMessage && (
            <CardDescription className="text-destructive">
              {errorMessage}
            </CardDescription>
          )}
        </CardHeader>

        <CardContent>
          <PaymentElement />
          {/* <div className="mt-4">
            {/* kja krijen nji field per email, munesh mi rujt emailin e userit psh. 
            <LinkAuthenticationElement
              onChange={(e) => setEmail(e.value.email)}
            />
          </div> */}
        </CardContent>
        <CardFooter>
          <Button
            className="w-full"
            size="lg"
            disabled={stripe == null || elements == null || isLoading}
          >
            {isLoading
              ? "Purchasing..."
              : `Purchase - ${formatCurrency(priceInCents / 100)}`}
          </Button>
        </CardFooter>
      </Card>
    </form>
  );
}
