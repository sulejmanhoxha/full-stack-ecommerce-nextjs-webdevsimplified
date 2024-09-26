import { UserUpdateForm } from "@/app/(auth)/profile/components/UserUpdateForm";
import { redirect } from "next/navigation";

import { validateRequest } from "@/lib/luciaAuth";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default async function ProfilePage() {
  const { user } = await validateRequest();

  if (!user) {
    return redirect("/");
  }

  return (
    <main className="flex min-h-screen items-center justify-center">
      <Card className="mx-auto max-w-sm">
        <CardHeader>
          <CardTitle className="text-2xl">Your profile</CardTitle>
          <CardDescription>
            Feel free to update your account information below. Only fill in the fields you wish to modify.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <UserUpdateForm user={user} />
        </CardContent>
      </Card>
    </main>
  );
}
