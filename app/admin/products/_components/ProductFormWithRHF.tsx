"use client";

import { addProduct } from "@/app/admin/_actions/products";
import { zodResolver } from "@hookform/resolvers/zod";
import { Product } from "@prisma/client";
import { useRef } from "react";
import { useFormState, useFormStatus } from "react-dom";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

const formSchema = z.object({
  name: z.string().min(2).max(50).trim(),
  description: z.string().min(8, {
    message: "The description must be at least 8 characters long",
  }),
  priceInCents: z.coerce
    .number()
    .int()
    .min(200, { message: "The minimum price for a product is 2 dolars" })
    .positive({ message: "The price must be a positive number" }),

  file: z
    .custom<File>((v) => v instanceof File, {
      message: "File is required",
    })
    .refine(
      (file) => file.size <= 10000000 && file.type.startsWith("video/"),
      "file: Only .mp4, .mov files of 10MB or less are accepted.",
    ),

  image: z
    .custom<File>((v) => v instanceof File, {
      message: "Image is required",
    })
    .refine(
      (file) => file.size <= 50000000 && file.type.startsWith("image/"),
      "Item image: Only .jpeg, .jpg, .png files of 5MB or less are accepted.",
    ),

  // if you need upload multiple Image
  // image: z.array(z.instanceof(File))
  // .refine((files) => files.every((file) => file.size <= 50000000&& ["image/png","image/jpeg","image/jpg"].includes(file.type))
  //     ,"Item image: Only .jpeg, .jpg, .png files of 5MB or less are accepted."
  // )
});

export default function ProductFormWithRHF({ product }: { product?: Product }) {
  const [error, formAction] = useFormState(addProduct, {});

  const inputRef = useRef<HTMLInputElement>(null);

  const form = useForm<z.output<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: product?.name || "",
      description: product?.description || "",
      priceInCents: product?.priceInCents || 200,
    },
  });

  return (
    <Form {...form}>
      <form action={formAction} className="space-y-4">
        <div className="grid grid-cols-2 gap-2">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input placeholder="name" {...field} />
                </FormControl>
                <FormMessage>{error.name && <p className="text-destructive">{error.name}</p>}</FormMessage>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="priceInCents"
            render={({ field }) => (
              <FormItem>
                <FormLabel>priceInCents</FormLabel>
                <FormControl>
                  <Input type="number" placeholder="priceInCents" {...field} />
                </FormControl>
                <FormMessage>{error.name && <p className="text-destructive">{error.name}</p>}</FormMessage>
              </FormItem>
            )}
          />
        </div>
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea placeholder="description" {...field} />
              </FormControl>
              <FormMessage>{error.description && <p className="text-destructive">{error.description}</p>}</FormMessage>
            </FormItem>
          )}
        />

        <div className="grid grid-cols-2 gap-2">
          <FormField
            control={form.control}
            name="file"
            render={({ field: { value, onChange, ...fieldProps } }) => (
              <FormItem>
                <FormLabel>File</FormLabel>
                <FormControl>
                  <Input
                    {...fieldProps}
                    placeholder="file"
                    type="file"
                    accept="video/*"
                    onChange={(event) => onChange(event.target.files && event.target.files[0])}
                  />
                </FormControl>
                <FormMessage>{error.file && <p className="text-destructive">{error.file}</p>}</FormMessage>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="image"
            render={({ field: { value, onChange, ...fieldProps } }) => (
              <FormItem>
                <FormLabel>Image</FormLabel>
                <FormControl>
                  <Input
                    {...fieldProps}
                    placeholder="images"
                    type="file"
                    accept=".jpg, .jpeg, .png"
                    onChange={(event) => onChange(event.target.files && event.target.files[0])}
                    // if you need upload multiple Image
                    // multiple
                    // onChange={(e) => onChange([...Array.from(e.target.files ?? [])])}
                  />
                </FormControl>
                <FormMessage>{error.image && <p className="text-destructive">{error.image}</p>}</FormMessage>
              </FormItem>
            )}
          />
        </div>
        <input ref={inputRef} type="submit" hidden />

        <Button onClick={form.handleSubmit(() => inputRef.current?.click())}>Save</Button>
      </form>
    </Form>
  );
}
