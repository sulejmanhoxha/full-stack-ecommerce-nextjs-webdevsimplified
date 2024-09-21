import fs from "fs/promises";
import { notFound, redirect } from "next/navigation";
import { NextRequest, NextResponse } from "next/server";

import { validateRequest } from "@/lib/luciaAuth";
import { prisma } from "@/lib/prismaClient";

export async function GET(
  req: NextRequest,
  {
    params: { productId },
  }: {
    params: {
      productId: string;
    };
  },
) {
  const { user } = await validateRequest();
  if (!user) {
    return redirect("/signin");
  }

  const isProductPurchased = await prisma.order.findFirst({
    where: {
      userId: user.id,
      productId: productId,
    },
  });

  if (isProductPurchased == null) {
    return notFound();
  }

  const product = await prisma.product.findUnique({
    where: {
      id: productId,
    },
  });

  if (!product) {
    return notFound();
  }

  const { size } = await fs.stat(product.filePath);
  const file = await fs.readFile(product.filePath);
  const extension = product.filePath.split(".").pop();

  return new NextResponse(file, {
    headers: {
      "Content-Disposition": `attachment; filename="${product.name}.${extension}"`,
      "Content-Length": size.toString(),
    },
  });
}
