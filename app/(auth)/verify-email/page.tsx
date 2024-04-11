import { VerifyEmailForm } from "@/app/(auth)/verify-email/_components/VerifyEmailFrom";
import { redirect } from "next/navigation";

import { validateRequest } from "@/lib/luciaAuth";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default async function VerifyEmailPage() {
  const { user } = await validateRequest();

  if (!user) {
    return redirect("/signin");
  }

  if (user.emailVerified) {
    return redirect("/");
  }

  return (
    <main className="flex min-h-screen items-center justify-center">
      <Card className="mx-auto max-w-sm">
        <CardHeader>
          <CardTitle className="text-2xl">Verify Email</CardTitle>
          <CardDescription>
            A verification code has been sent to{" "}
            <span className="font-semibold text-foreground">{user.email}</span>.
            Please enter the verification code below. Check the spam folder if
            you can&apos;t find the email.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <VerifyEmailForm userId={user.id} userEmail={user.email} />
        </CardContent>
      </Card>
    </main>
  );
}
