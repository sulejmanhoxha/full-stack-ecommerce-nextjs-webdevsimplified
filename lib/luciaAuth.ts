import { PrismaAdapter } from "@lucia-auth/adapter-prisma";
import { User } from "@prisma/client";
import { Lucia } from "lucia";
import { cookies } from "next/headers";
import { cache } from "react";

import { prisma } from "@/lib/prismaClient";

const adapter = new PrismaAdapter(prisma.session, prisma.user);

export const lucia = new Lucia(adapter, {
  sessionCookie: {
    attributes: {
      // set to `true` when using HTTPS
      secure: process.env.NODE_ENV === "production",
    },
  },
  // IMPORTANT: IF YOU WANT OTHER ATTRIBUTES OF THE USER
  // TO BE RETURNED BY LUCIA, YOU HAVE TO LIST THEM HERE

  getUserAttributes: (attributes) => {
    return {
      email: attributes.email,
    };
  },
});

export const validateRequest = cache(async () => {
  const sessionId = cookies().get(lucia.sessionCookieName)?.value ?? null;

  if (!sessionId)
    return {
      user: null,
      session: null,
    };

  const { user, session } = await lucia.validateSession(sessionId);
  try {
    if (session && session.fresh) {
      const sessionCookie = lucia.createSessionCookie(session.id);
      cookies().set(
        sessionCookie.name,
        sessionCookie.value,
        sessionCookie.attributes,
      );
    }
    if (!session) {
      const sessionCookie = lucia.createBlankSessionCookie();
      cookies().set(
        sessionCookie.name,
        sessionCookie.value,
        sessionCookie.attributes,
      );
    }
  } catch (e) {
    // Next.js throws error when attempting to set cookies when rendering page
    console.log("lucia validateRequest error: ", e);
  }
  return {
    user,
    session,
  };
});

declare module "lucia" {
  interface Register {
    Lucia: typeof lucia;

    // UNCOMMENT THIS ASWELL FOR THE USER ATTIBUTES
    DatabaseUserAttributes: DatabaseUserAttributes;
  }
}

interface DatabaseUserAttributes {
  email: string;
}
