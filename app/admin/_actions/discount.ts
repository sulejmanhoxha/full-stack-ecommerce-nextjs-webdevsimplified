"use server";

import { DiscountCodeType } from "@prisma/client";
import { notFound, redirect } from "next/navigation";
import { z } from "zod";

import { prisma } from "@/lib/prismaClient";

const addSchema = z
  .object({
    code: z.string().min(1),
    discountAmount: z.coerce.number().int().min(1),
    discountType: z.nativeEnum(DiscountCodeType),
    allProducts: z.coerce.boolean(),
    productIds: z.array(z.string()).optional(),
    expiresAt: z.preprocess(
      (value) => (value === "" ? undefined : value),
      z.coerce.date().min(new Date()).optional(),
    ),
    limit: z.preprocess(
      (value) => (value === "" ? undefined : value),
      z.coerce.number().int().min(1).optional(),
    ),
  })
  .refine(
    (data) =>
      data.discountAmount <= 100 ||
      data.discountType !== DiscountCodeType.PERCENTAGE,
    {
      message: "Percentage discount must be less than or equal to 100",
      path: ["discountAmount"],
    },
  )
  .refine((data) => !data.allProducts || data.productIds == null, {
    message: "Cannot select products when all products is selected",
    path: ["productIds"],
  })
  .refine((data) => data.allProducts || data.productIds != null, {
    message: "Must select products when all products is not selected",
    path: ["productIds"],
  });

export async function addDiscountCode(prevState: unknown, formData: FormData) {
  const productIds = formData.getAll("productIds");
  const result = addSchema.safeParse({
    ...Object.fromEntries(formData.entries()),
    productIds: productIds.length > 0 ? productIds : undefined,
  });

  if (result.success === false) return result.error.formErrors.fieldErrors;

  const data = result.data;

  prisma.discountCode.create({
    data: {
      code: data.code,
      discountAmount: data.discountAmount,
      discountType: data.discountType,
      allProducts: data.allProducts,
      expiresAt: data.expiresAt,
      limit: data.limit,
      products:
        data.productIds != null
          ? {
              connect: data.productIds.map((id) => ({ id })),
            }
          : undefined,
    },
  });

  redirect("/admin/discount-codes");
}

export async function toggleDiscountCodeActive(id: string, isActive: boolean) {
  await prisma.discountCode.update({ where: { id }, data: { isActive } });
}

export async function deleteDiscountCode(id: string) {
  const discountCode = await prisma.discountCode.delete({ where: { id } });

  if (discountCode == null) return notFound();

  return discountCode;
}