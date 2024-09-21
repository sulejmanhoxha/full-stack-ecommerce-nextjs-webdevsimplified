import { z } from "zod";

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
