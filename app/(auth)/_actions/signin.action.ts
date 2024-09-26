"use server";

import { SignInSchema } from "@/app/(auth)/_schemas/zod.schemas";
import * as argon2 from "argon2";
import { cookies } from "next/headers";
import { z } from "zod";

import { lucia } from "@/lib/luciaAuth";
import { prisma } from "@/lib/prismaClient";

export const signIn = async (values: z.infer<typeof SignInSchema>) => {
  try {
    SignInSchema.parse(values);
  } catch (error: any) {
    return {
      error: error.message,
    };
  }

  const existingUser = await prisma.user.findUnique({
    where: {
      email: values.email,
    },
  });

  if (!existingUser) {
    return {
      error: "User not found",
    };
  }

  if (!existingUser.password) {
    return {
      error: "User not found",
    };
  }

  const isValidPassword = await argon2.verify(existingUser.password, values.password);

  if (!isValidPassword) {
    return {
      error: "Incorrect username or password",
    };
  }

  const session = await lucia.createSession(existingUser.id, {});

  const sessionCookie = lucia.createSessionCookie(session.id);

  cookies().set(sessionCookie.name, sessionCookie.value, sessionCookie.attributes);

  return {
    success: "Logged in successfully",
  };
};
