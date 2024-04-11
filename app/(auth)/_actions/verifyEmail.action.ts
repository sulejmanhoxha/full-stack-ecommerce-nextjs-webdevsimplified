"use server";

import { isWithinExpirationDate } from "@/lib/date";
import { prisma } from "@/lib/prismaClient";

export async function verifyVerificationCode(
  userId: string,
  userEmail: string,
  code: string,
) {
  const databaseVerificationCode = await prisma.emailVerificationCode.findFirst(
    {
      where: {
        userId: userId,
        email: userEmail,
      },
    },
  );

  if (!databaseVerificationCode || databaseVerificationCode.code !== code) {
    return false;
  }

  await prisma.emailVerificationCode.deleteMany({
    where: {
      userId: userId,
      email: userEmail,
    },
  });

  if (!isWithinExpirationDate(databaseVerificationCode.expiresAt)) {
    return false;
  }
  if (databaseVerificationCode.email !== userEmail) {
    return false;
  }

  await prisma.user.update({
    where: {
      id: userId,
    },
    data: {
      emailVerified: true,
    },
  });

  return true;
}
