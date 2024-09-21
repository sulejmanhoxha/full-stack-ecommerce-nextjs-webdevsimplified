"use server";

import EmailVerificationCodeEmail from "@/app/email/EmailVerificationCodeEmail";
import crypto from "crypto";
import { Resend } from "resend";

import { prisma } from "@/lib/prismaClient";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function generateEmailVerificationCode(
  userId: string,
  userEmail: string,
): Promise<string> {
  await prisma.emailVerificationCode.deleteMany({
    where: {
      userId: userId,
    },
  });

  const code = crypto.randomInt(0, 999999).toString();

  await prisma.emailVerificationCode.deleteMany({
    where: {
      userId: userId,
      email: userEmail,
    },
  });

  const databaseVerificationCode = await prisma.emailVerificationCode.create({
    data: {
      userId: userId,
      email: userEmail,
      code: code,
      expiresAt: new Date(Date.now() + 15 * 60 * 1000), // 15 minutes from now
    },
  });

  await resend.emails.send({
    from: "onboarding@resend.dev",
    to: "sulejman.hoxha2001@hotmail.com",
    subject: "Email verification code",
    react: EmailVerificationCodeEmail({
      validationCode: databaseVerificationCode.code,
    }),
  });

  return code;
}
