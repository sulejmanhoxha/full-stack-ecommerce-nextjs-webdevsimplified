import { z } from "zod";

export const SignUpSchema = z
  .object({
    username: z.string().min(2).max(50),
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

<<<<<<< HEAD
  file: fileSchema.refine((file) => file.size > 0, "Required."),
  image: imageSchema.refine((file) => file.size > 0, "Required."),
=======
  file: z.object({
    name: z.string(),
    size: z.number(),
    type: z.string()
  })
  .refine((file) => file.size <= 10000000 && ["video/mp4","video/mov"].includes(file.type),"file: Only .mp4, .mov files of 10MB or less are accepted."),
  image: z.array(
    z.object({
      name: z.string(),
      size: z.number(),
      type: z.string()
  }))
  .refine((files) => files.every((file) => file.size <= 50000000&& ["image/png","image/jpeg","image/jpg"].includes(file.type)),"Item image: Only .jpeg, .jpg, .png files of 5MB or less are accepted.")

>>>>>>> 7e5053c79cbdbb3581770227811fe503c5846b33
});

export const UpdateProductSchema = NewProductSchema.extend({
  file: fileSchema.optional(),
  image: imageSchema.optional(),
});
