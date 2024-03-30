"use client";

import { addProduct } from "@/app/admin/_actions/products";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { NewProductSchema } from "@/zod/schemas";

import { formatCurrency } from "@/lib/formatters";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

export function ProductForm() {
  const form = useForm<z.infer<typeof NewProductSchema>>({
    resolver: zodResolver(NewProductSchema),
    defaultValues: {
      name: "",
      description: "",
      priceInCents: 200,
      file: undefined,
      image: undefined,
    },
  });

  const fileRef = form.register("file", { required: true });
  const fileRef2 = form.register("image", { required: true });

  const [priceInCents, setPriceInCents] = useState<number>(200);

  async function onSubmit(values: z.infer<typeof NewProductSchema>) {
    console.log(values);

    await addProduct(values);
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-2">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input placeholder="name" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Input placeholder="description" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="priceInCents"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Price in cents</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  min={200}
                  placeholder="100000"
                  onChangeCapture={(e) =>
                    setPriceInCents(Number(e.currentTarget.value))
                  }
                  {...field}
                />
              </FormControl>
              <FormDescription>
                The price in dollars:{" "}
                {formatCurrency((priceInCents || 0) / 100)}
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="file"
          render={({ field }) => (
            <FormItem>
              <FormLabel>File</FormLabel>
              <FormControl>
                <Input
                  accept="video/*"
                  type="file"
                  placeholder="video for product"
                  {...fileRef}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="image"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Image</FormLabel>
              <FormControl>
                <Input
                  accept="image/png, image/jpeg, image/jpg"
                  type="file"
                  placeholder="image for product"
                  {...fileRef2}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        {/* <SubmitButton isSubmitting={form.formState.isSubmitting} /> */}

        {/* <Button disabled={form.formState.isSubmitting} type="submit">
          {form.formState.isSubmitting ? "Saving..." : "Save"}
        </Button> */}
        <Button type="submit">save</Button>
      </form>
    </Form>
  );
}

// function SubmitButton({ isSubmitting }: { isSubmitting: boolean }) {
//   return (
//     <Button disabled={isSubmitting} type="submit">
//       {isSubmitting ? "Saving..." : "Save"}
//     </Button>
//   );
// }
