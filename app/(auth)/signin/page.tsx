import { SignInForm } from "@/app/(auth)/signin/_components/SignInForm";
import { redirect } from "next/navigation";

import { validateRequest } from "@/lib/luciaAuth";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default async function SignInPage() {
  const { user } = await validateRequest();

  if (user) {
    return redirect("/");
  }

  return (
    <main className="flex min-h-screen items-center justify-center">
      <Card className="mx-auto max-w-sm">
        <CardHeader>
          <CardTitle className="text-2xl">Signin</CardTitle>
          <CardDescription>Enter your email and password below to login to your account.</CardDescription>
        </CardHeader>
        <CardContent>
          <SignInForm />
        </CardContent>
      </Card>
    </main>
  );
}
