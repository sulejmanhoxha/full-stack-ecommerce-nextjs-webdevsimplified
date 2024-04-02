import { redirect } from "next/navigation";

import { validateRequest } from "@/lib/luciaAuth";

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

  return (
    <>
      <Nav>
        <NavLink href="/admin">Dashboard</NavLink>
        <NavLink href="/admin/products">Products</NavLink>
        <NavLink href="/admin/users">Customers</NavLink>
        <NavLink href="/admin/orders">Sales</NavLink>
      </Nav>
      <div className="container my-6">{children}</div>
    </>
  );
}
