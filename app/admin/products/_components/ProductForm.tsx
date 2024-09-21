"use client";

import { addProduct, updateProduct } from "@/app/admin/_actions/products";
import { Product } from "@prisma/client";
import Image from "next/image";
import { useState } from "react";
import { useFormState, useFormStatus } from "react-dom";

import { formatCurrency } from "@/lib/formatters";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export function ProductForm({ product }: { product: Product | null }) {
  const [error, action] = useFormState(
    product == null ? addProduct : updateProduct.bind(null, product.id),
    {},
  );
  const [priceInCents, setPriceInCents] = useState<number | undefined>(
    product?.priceInCents,
  );

  return (
    <form action={action} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="name">Name</Label>
        <Input
          type="text"
          id="name"
          name="name"
          required
          defaultValue={product?.name || ""}
        />
        {error.name && <p className="text-destructive">{error.name}</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          name="description"
          required
          defaultValue={product?.description || ""}
        />
        {error.description && (
          <p className="text-destructive">{error.description}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="priceInCents">Price in cents</Label>
        <Input
          type="number"
          min={200}
          id="priceInCents"
          name="priceInCents"
          required
          onChangeCapture={(e) =>
            setPriceInCents(Number(e.currentTarget.value))
          }
          defaultValue={product?.priceInCents || ""}
        />
        {error.priceInCents && (
          <p className="text-destructive">{error.priceInCents}</p>
        )}

        <p>
          {" "}
          The price in dollars: {formatCurrency((priceInCents || 0) / 100)}
        </p>
      </div>

      <div className="space-y-2">
        <Label htmlFor="file">File</Label>
        <Input
          type="file"
          accept="video/*"
          multiple={false}
          id="file"
          name="file"
          required={product === null}
        />
        {error.file && <p className="text-destructive">{error.file}</p>}

        {product != null && (
          <div className="text-muted-foreground">{product.filePath}</div>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="image">image</Label>
        <Input
          type="file"
          accept="image/*"
          multiple={false}
          id="image"
          name="image"
          required={product === null}
        />
        {error.image && <p className="text-destructive">{error.image}</p>}

        {product != null && (
          <Image
            src={product.imagePath}
            alt={`Product image : ${product.name}`}
            width={400}
            height={400}
          />
        )}
      </div>

      <SubmitButton />
    </form>
  );
}

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button disabled={pending} type="submit">
      {pending ? "Saving..." : "Save"}
    </Button>
  );
}
