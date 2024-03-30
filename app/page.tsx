import { redirect } from "next/navigation";

import { signOut } from "@/actions/auth.actions";

import { validateRequest } from "@/lib/luciaAuth";

import { Button } from "@/components/ui/button";

export default async function Home() {
  const { user } = await validateRequest();

  if (!user) {
    return redirect("/signin");
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <p>Protected route</p>
      <p>{JSON.stringify(user)}</p>
      <form action={signOut}>
        <Button type="submit">Sign out</Button>
      </form>
    </main>
  );
}
