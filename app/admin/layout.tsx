import { signOut } from "@/app/(auth)/_actions/signOut";
import { notFound, redirect } from "next/navigation";

import { validateRequest } from "@/lib/luciaAuth";

import { Button } from "@/components/ui/button";

import { Nav, NavLink } from "@/components/Nav";

// force dynamic, we dont want to cache the admin pages
export const dynamic = "force-dynamic";

export default async function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // only authenticated users can access the admin pages
  const { user } = await validateRequest();
  if (!user) {
    return redirect("/signin");
  }

  if (!(user.role === "admin")) {
    return notFound();
  }

  return (
    <>
      <Nav>
        <NavLink href="/admin">Dashboard</NavLink>
        <NavLink href="/admin/products">Products</NavLink>
        <NavLink href="/admin/users">Customers</NavLink>
        <NavLink href="/admin/orders">Sales</NavLink>

        <form className="ml-4 self-center" action={signOut}>
          <Button variant={"destructive"} type="submit">
            Sign out
          </Button>
        </form>
      </Nav>
      <div className="container my-6 transition-all duration-500">
        {children}
      </div>
    </>
  );
}
