"use server";

import { generateEmailVerificationCode } from "@/app/(auth)/_actions/generateEmailVerificationCode.action";
import { UserUpdateSchema } from "@/app/(auth)/_schemas/zod.schemas";
import * as argon2 from "argon2";
import { cookies } from "next/headers";
import { z } from "zod";

import { lucia, validateRequest } from "@/lib/luciaAuth";
import { prisma } from "@/lib/prismaClient";

export async function updateUser(values: z.infer<typeof UserUpdateSchema>) {
  try {
    try {
      UserUpdateSchema.parse(values);
    } catch (error: any) {
      return {
        success: false,
        message: error.message,
      };
    }

    const { user } = await validateRequest();
    if (!user) {
      return {
        success: false,
        message: "User not found",
      };
    }

    const userExists = await prisma.user.findFirst({
      where: {
        id: user.id,
      },
    });

    if (!userExists) {
      return {
        success: false,
        message: "User not found",
      };
    }

    type UpdatedUser = {
      email?: string;
      password?: string;
      emailVerified?: boolean;
    };

    const updatedUser: UpdatedUser = {};
    if (values.oldPassword) {
      const isValidPassword = await argon2.verify(
        userExists?.password!,
        values.oldPassword,
      );

      if (!isValidPassword) {
        return {
          success: false,
          message: "Invalid password",
        };
      }

      const hashedPassword = await argon2.hash(values.newPassword!);
      updatedUser.password = hashedPassword;
    }
    if (values.email) {
      if (values.email !== userExists.email) {
        updatedUser.email = values.email;
        await generateEmailVerificationCode(user.id, user.email);
        updatedUser.emailVerified = false;
      }
    }
    await prisma.user.update({
      where: {
        id: user.id,
      },
      data: {
        ...updatedUser,
      },
    });

    if (values.logoutFromOtherDevices) {
      await prisma.session.deleteMany({
        where: {
          userId: user.id,
        },
      });

      const session = await lucia.createSession(userExists.id, {});

      const sessionCookie = lucia.createSessionCookie(session.id);

      cookies().set(
        sessionCookie.name,
        sessionCookie.value,
        sessionCookie.attributes,
      );
    }

    return {
      success: true,
      message: "Password updated",
    };
  } catch (error: any) {
    return {
      success: false,
      message: error.message,
    };
  }
}
