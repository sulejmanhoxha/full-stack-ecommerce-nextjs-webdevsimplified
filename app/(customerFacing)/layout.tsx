import { validateRequest } from "@/lib/luciaAuth";

import { Nav, NavLink } from "@/components/Nav";

export default async function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { user } = await validateRequest();

  return (
    <>
      <Nav>
        <NavLink href="/">Home</NavLink>
        <NavLink href="/products">Products</NavLink>
        <NavLink href="/orders">My Orders</NavLink>
        {!user && (
          <>
            <NavLink href="/signin">Sign in</NavLink>
            <NavLink href="/signup">Sign up</NavLink>
          </>
        )}

        {user && (
          <>
            <NavLink href="/profile">Profile</NavLink>
          </>
        )}
      </Nav>
      <div className="container my-6 transition-all duration-500">
        {children}
      </div>
    </>
  );
}
