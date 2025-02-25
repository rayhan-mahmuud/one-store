export const APP_NAME = process.env.NEXT_PUBLIC_APP_NAME || "OneStore";
export const APP_DESCRIPTION =
  process.env.NEXT_PUBLIC_APP_DESCRIPTION ||
  "A modern e-commerce platform built with Next.js";

export const SERVER_URL =
  process.env.NEXT_PUBLIC_SERVER_URL || "http://localhost:3000/";

export const LATEST_PRODUCTS_LIMIT =
  Number(process.env.LATEST_PRODUCTS_LIMIT) || 4;

export const DefaultShippingAddressValue = {
  fullName: "",
  address1: "",
  address2: "",
  city: "",
  country: "",
  postalCode: "",
};

export const CHECKOUT_STEPS_ARRAY = [
  "Login",
  "Shipping Details",
  "Payment Method",
  "Place Order",
];
