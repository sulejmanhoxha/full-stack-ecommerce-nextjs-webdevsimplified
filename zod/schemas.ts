import { z } from "zod";

export const SignUpSchema = z
  .object({
    username: z.string().min(2).max(50),
    email: z.string().min(2).max(50).email(),
    password: z
      .string()
      .min(8, { message: "Password must be at least 8 characters long" }),
    confirmPassword: z
      .string()
      .min(8, { message: "Password must be at least 8 characters long" }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export const SignInSchema = z.object({
  username: z.string().min(2).max(50),
  password: z
    .string()
    .min(8, { message: "Password must be at least 8 characters long" }),
});

const fileSchema = z.instanceof(File, { message: "Required" });
const imageSchema = fileSchema.refine(
  (file) => file.size === 0 || file.type.startsWith("image/"),
);

export const NewProductSchema = z.object({
  name: z.string().min(2).max(50).trim(),
  description: z.string().min(8, {
    message: "The description must be at least 8 characters long",
  }),
  priceInCents: z.coerce
    .number()
    .int()
    .min(200, { message: "The minimum price for a product is 2 dolars" })
    .positive({ message: "The price must be a positive number" }),

  file: fileSchema.refine((file) => file.size > 0, "Required."),
  image: imageSchema.refine((file) => file.size > 0, "Required."),
});

export const UpdateProductSchema = NewProductSchema.extend({
  file: fileSchema.optional(),
  image: imageSchema.optional(),
});
