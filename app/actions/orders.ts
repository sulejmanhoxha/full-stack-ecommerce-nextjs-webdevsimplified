"use server";

import { prisma } from "@/lib/prismaClient";

export async function userOrderExists(username: string, productId: string) {
  return (
    (await prisma.order.findFirst({
      where: {
        user: { username },
        productId,
      },
      select: {
        id: true,
      },
    })) != null
  );
}
