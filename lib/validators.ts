import { z } from "zod";
import { formatNumWithDecimal } from "./utils";

const currency = z
  .string()
  .refine(
    (value) => /^\d+(\.d{2})?$/.test(formatNumWithDecimal(Number(value))),
    "Price must be exactly 2 decimal places!"
  );

//Validator for inserting products
export const insertProductSchema = z.object({
  name: z.string().min(3, "Name should be atleast 3 charecters!"),
  slug: z.string().min(3, "Slug should be atleast 3 charecters!"),
  category: z.string().min(3, "Category should be atleast 3 charecters!"),
  description: z.string().min(6, "Description should be atleast 3 charecters!"),
  images: z.array(z.string()).min(1, "Product should have atleast 1 image!"),
  brand: z.string().min(3, "Brand name should be atleast 3 charecters!"),
  stock: z.coerce.number(),
  isFeatured: z.boolean(),
  banner: z.string().nullable(),
  price: currency,
});
