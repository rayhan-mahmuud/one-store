import { z } from "zod";
import { formatNumWithDecimal } from "./utils";
import { PAYMENT_METHODS } from "./constants";

const currency = z
  .string()
  .refine(
    (value) => /^\d+(\.\d{2})?$/.test(formatNumWithDecimal(Number(value))),
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

//Validator for user sign in form

export const signInFormSchema = z.object({
  email: z.string().email("Enter valid email address!"),
  password: z.string().min(6, "Password must be atleast 6 charecters!"),
});

//Validator for user sign upform

export const signUpFormSchema = z
  .object({
    name: z.string().min(3, "Name should be atleast 3 charecters!"),
    email: z.string().email("Enter valid email address!"),
    password: z.string().min(6, "Password must be atleast 6 charecters!"),
    confirmPassword: z
      .string()
      .min(6, "Password must be atleast 6 charecters!"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Password don't match!",
    path: ["confirmPassword"],
  });

//Cart validators

export const cartItemSchema = z.object({
  productId: z.string().min(1, "Product Id is required!"),
  name: z.string().min(1, "Name is required!"),
  slug: z.string().min(1, "Slug is required!"),
  qty: z.number().int().nonnegative("Quantity should be positive number"),
  image: z.string().min(1, "Image is required!"),
  price: currency,
});

export const insertCartSchema = z.object({
  userId: z.string().optional().nullable(),
  items: z.array(cartItemSchema),
  itemsPrice: currency,
  totalPrice: currency,
  shippingPrice: currency,
  taxPrice: currency,
  sessionCartId: z.string().min(1, "Session Cart Id is required!"),
});

// Shipping Address

export const shippingAddressSchema = z.object({
  fullName: z.string().min(3, "Full name should be atleast 3 charecters!"),
  address1: z.string().min(3, "Address should be atleast 3 charecters!"),
  address2: z.string().optional(),
  city: z.string().min(3, "City name should be atleast 3 charecters!"),
  country: z.string().min(3, "Country name should be atleast 3 charecters!"),
  postalCode: z.string().min(4, "Enter a valid postal code!"),
});

// Payment method

export const paymentMethodSchema = z
  .object({
    type: z.string().min(1, "Payment method is required!"),
  })
  .refine((data) => PAYMENT_METHODS.includes(data.type), {
    path: ["type"],
    message: "Payment method must be within supported methods!",
  });

// Insert Order schema

export const insertOrderSchema = z.object({
  userId: z.string().min(1, "User is required!"),
  itemsPrice: currency,
  totalPrice: currency,
  shippingPrice: currency,
  taxPrice: currency,
  paymentMethod: z.string().refine((data) => PAYMENT_METHODS.includes(data), {
    message: "Invalid payment method!",
  }),
  shippingAddress: shippingAddressSchema,
});

// Order item schema

export const orderItemSchema = z.object({
  orderId: z.string().min(1, "Order Id is required!"),
  productId: z.string().min(1, "Product Id is required!"),
  name: z.string().min(1, "Name is required!"),
  slug: z.string().min(1, "Slug is required!"),
  qty: z.number().int().nonnegative("Quantity should be positive number"),
  image: z.string().min(1, "Image is required!"),
  price: currency,
});
