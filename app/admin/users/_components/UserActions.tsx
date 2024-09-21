"use client";

import { deleteUser } from "@/app/admin/_actions/users";
import { useRouter } from "next/navigation";
import { useTransition } from "react";

import { DropdownMenuItem } from "@/components/ui/dropdown-menu";

export function DeleteUserDropdownItem({ id }: { id: string }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  return (
    <DropdownMenuItem
      className="text-destructive focus:bg-destructive focus:text-destructive-foreground"
      disabled={isPending}
      onClick={() => {
        startTransition(async () => {
          await deleteUser(id);
          router.refresh();
        });
      }}
    >
      Delete
    </DropdownMenuItem>
  );
}
