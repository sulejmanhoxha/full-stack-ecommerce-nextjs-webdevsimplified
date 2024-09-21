"use server";

import { generateEmailVerificationCode } from "@/app/(auth)/_actions/generateEmailVerificationCode.action";
import { SignUpSchema } from "@/app/(auth)/_schemas/zod.schemas";
import * as argon2d from "argon2";
import { cookies } from "next/headers";
import { z } from "zod";

import { lucia } from "@/lib/luciaAuth";
import { prisma } from "@/lib/prismaClient";

export const signUp = async (values: z.infer<typeof SignUpSchema>) => {
  try {
    SignUpSchema.parse(values);
  } catch (error: any) {
    return {
      error: error.message,
    };
  }

  const hashedPassword = await argon2d.hash(values.password);

  try {
    const user = await prisma.user.create({
      data: {
        email: values.email,
        password: hashedPassword,
      },
      select: { id: true, email: true },
    });

    await generateEmailVerificationCode(user.id, user.email);

    // await resend.emails.send({
    //   from: `Support <${process.env.SENDER_EMAIL}>`,
    //   to: user.email,
    //   subject: "Email verification code",
    //   react: EmailVerificationCodeEmail({ validationCode: verificationCode }),
    // });

    // {
    //   expiresAt: 60 * 60 * 24 * 30,
    // }
    const session = await lucia.createSession(user.id, {});

    const sessionCookie = lucia.createSessionCookie(session.id);

    cookies().set(
      sessionCookie.name,
      sessionCookie.value,
      sessionCookie.attributes,
    );

    return {
      success: true,
      data: {
        userId: user.id,
      },
    };
  } catch (error: any) {
    return {
      error: error?.message,
    };
  }
};
