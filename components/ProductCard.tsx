import { Description } from "@radix-ui/react-toast";
import Image from "next/image";
import { Link } from 'next-view-transitions'

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

type ProductCardProps = {
  id: string;
  name: string;
  priceInCents: number;
  description: string;
  imagePath: string;
};

export function ProductCard({
  id,
  name,
  priceInCents,
  description,
  imagePath,
}: ProductCardProps) {
  return (
    <Card className="flex flex-col overflow-hidden">
      <div className="relative aspect-video h-auto w-full">
        <Image src={imagePath} fill alt={`Product image - ${name}`} />
      </div>
      <CardHeader>
        <CardTitle>{name}</CardTitle>
        <CardDescription>{formatCurrency(priceInCents / 100)}</CardDescription>
      </CardHeader>

      <CardContent className="flex-grow">
        <p className="line-clamp-4">{description}</p>
      </CardContent>

      <CardFooter className="flex-grow">
        <Button size={"lg"} className="w-full" asChild>
          <Link href={`/products/${id}/purchase`} className="space-x-2">
            Purchase
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
}

export function ProductCardSkeleton() {
  return (
    <Card className="flex animate-pulse flex-col overflow-hidden">
      <div className="aspect-video w-full bg-gray-300"></div>
      <CardHeader>
        <CardTitle>
          <div className="h-6 w-3/4 rounded-full bg-gray-300"></div>
        </CardTitle>
        <CardDescription>
          <div className="h-4 w-1/2 rounded-full bg-gray-300"></div>
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-2">
        <div className="h-4 w-full rounded-full bg-gray-300"></div>
        <div className="h-4 w-full rounded-full bg-gray-300"></div>
        <div className="h-4 w-3/4 rounded-full bg-gray-300"></div>
      </CardContent>

      <CardFooter>
        <Button className="w-full" disabled size="lg"></Button>
      </CardFooter>
    </Card>
  );
}
