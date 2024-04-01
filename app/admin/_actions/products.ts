"use server";

import fs from "fs/promises";
import { notFound, redirect } from "next/navigation";

import { NewProductSchema } from "@/zod/schemas";

import { prisma } from "@/lib/prismaClient";

export async function addProduct(prevState: unknown, values: FormData) {
  const result = NewProductSchema.safeParse(
    Object.fromEntries(values.entries()),
  );

  if (result.success === false) {
    return result.error.formErrors.fieldErrors;
  }

  const data = result.data;

  fs.mkdir("products", { recursive: true });
  const filePath = `products/${crypto.randomUUID()}-${data.file.name}`;
  await fs.writeFile(filePath, Buffer.from(await data.file.arrayBuffer()));

  fs.mkdir("public/products", { recursive: true });
  const imagePath = `/products/${crypto.randomUUID()}-${data.image.name}`;
  await fs.writeFile(
    `public${imagePath}`,
    Buffer.from(await data.image.arrayBuffer()),
  );

  await prisma.product.create({
    data: {
      name: data.name,
      description: data.description,
      priceInCents: data.priceInCents,
      filePath,
      imagePath,
    },
  });

  redirect("/admin/products");
}

export async function toggleProductAvailability(
  id: string,
  isAvailableForPurchase: boolean,
) {
  await prisma.product.update({
    where: { id },
    data: {
      isAvailableForPurchase,
    },
  });
}

export async function deleteProduct(id: string) {
  const product = await prisma.product.delete({
    where: { id },
  });

  if (product) {
    return notFound();
  }
}
