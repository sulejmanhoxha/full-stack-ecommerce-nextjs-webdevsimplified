import { redirect } from "next/navigation";

import { validateRequest } from "@/lib/luciaAuth";

export default async function OrdersPage() {
  const { user } = await validateRequest();
  if (!user) {
    return redirect("/signin");
  }

  return <h1>Orderss</h1>;
}
