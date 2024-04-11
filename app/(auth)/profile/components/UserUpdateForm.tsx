"use client";

import { updateUser } from "@/app/(auth)/_actions/updateUser.action";
import { UserUpdateSchema } from "@/app/(auth)/_schemas/zod.schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { User } from "lucia";
import { redirect } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import { toast } from "../../../../components/ui/use-toast";

export function UserUpdateForm({ user }: { user: User }) {
  const form = useForm<z.infer<typeof UserUpdateSchema>>({
    resolver: zodResolver(UserUpdateSchema),
    defaultValues: {
      email: user.email,
      logoutFromOtherDevices: false,
    },
  });

  async function onSubmit(values: z.infer<typeof UserUpdateSchema>) {
    // check if all values are undefined
    if (Object.values(values).every((value) => value === undefined)) {
      return;
    }
    const res = await updateUser(values);
    toast({
      description: res.message,
      variant: res.success ? "default" : "destructive",
    });
    redirect("/");
  }

  return (
    <>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input
                    placeholder="email@example.com"
                    type="email"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="oldPassword"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Old password</FormLabel>
                <FormControl>
                  <Input
                    placeholder="&#9679;&#9679;&#9679;&#9679;&#9679;"
                    type="password"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="newPassword"
            render={({ field }) => (
              <FormItem>
                <FormLabel>New Password</FormLabel>
                <FormControl>
                  <Input
                    placeholder="&#9679;&#9679;&#9679;&#9679;&#9679;"
                    type="password"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="confirmPassword"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Confirm Password</FormLabel>
                <FormControl>
                  <Input
                    placeholder="&#9679;&#9679;&#9679;&#9679;&#9679;"
                    type="password"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Label className="mt-2 flex items-center gap-2">
            <Checkbox
              onCheckedChange={(value: boolean) => {
                form.setValue("logoutFromOtherDevices", value, {
                  shouldValidate: true,
                });
              }}
            />{" "}
            Logout from other devices
          </Label>
          <Button type="submit">Submit</Button>
        </form>
      </Form>
    </>
  );
}
