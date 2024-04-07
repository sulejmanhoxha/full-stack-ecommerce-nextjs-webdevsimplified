"use client";

import { deleteOrder } from "@/app/admin/_actions/orders";
import { useRouter } from "next/navigation";
import { useTransition } from "react";

import { DropdownMenuItem } from "@/components/ui/dropdown-menu";

export function DeleteOrderDropdownItem({ id }: { id: string }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  return (
    <DropdownMenuItem
      className="text-destructive focus:bg-destructive focus:text-destructive-foreground"
      disabled={isPending}
      onClick={() => {
        startTransition(async () => {
          await deleteOrder(id);
          router.refresh();
        });
      }}
    >
      Delete
    </DropdownMenuItem>
  );
}
