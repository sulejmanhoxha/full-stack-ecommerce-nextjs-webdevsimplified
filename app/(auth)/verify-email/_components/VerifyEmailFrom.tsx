"use client";

import { verifyVerificationCode } from "@/app/(auth)/_actions/verifyEmail.action";
import { VerifyEmailSchema } from "@/app/(auth)/_schemas/zod.schemas";
import { ResendCodeButton } from "@/app/(auth)/verify-email/_components/ResendCodeButton";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { toast } from "@/components/ui/use-toast";

export function VerifyEmailForm({
  userId,
  userEmail,
}: {
  userId: string;
  userEmail: string;
}) {
  const router = useRouter();
  const form = useForm<z.infer<typeof VerifyEmailSchema>>({
    resolver: zodResolver(VerifyEmailSchema),
    defaultValues: {
      code: "",
    },
  });

  async function onSubmit(values: z.infer<typeof VerifyEmailSchema>) {
    const res = await verifyVerificationCode(userId, userEmail, values.code);
    if (!res) {
      toast({
        variant: "destructive",
        description: "Failed to verify email.",
      });
    } else {
      toast({
        variant: "default",
        description: "Email verified!",
      });
      router.push("/");
    }
  }

  return (
    <>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="code"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Verification code</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button type="submit" className="w-full">
            Verify
          </Button>
        </form>
      </Form>
      <ResendCodeButton userId={userId} userEmail={userEmail} />
    </>
  );
}
