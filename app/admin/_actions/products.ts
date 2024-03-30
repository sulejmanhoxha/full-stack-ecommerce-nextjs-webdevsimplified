"use server";

import fs from "fs/promises";
import { redirect } from "next/navigation";
import { z } from "zod";

import { NewProductSchema } from "@/zod/schemas";

import { prisma } from "@/lib/prismaClient";

export const addProduct = async (values: z.infer<typeof NewProductSchema>) => {
  console.log("test");

  const result = NewProductSchema.safeParse(values);
  console.log(result);
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
};
