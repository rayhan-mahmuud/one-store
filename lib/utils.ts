import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { ZodError } from "zod";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

//Convert Prisma object to JS object
export function convertToPlainObject<T>(value: T): T {
  return JSON.parse(JSON.stringify(value));
}

//Format the price
export function formatNumWithDecimal(num: number) {
  const [int, float] = num.toString().split(".");
  return float ? `${int}.${float.padEnd(2, "0")}` : `${int}.00`;
}

//Round numbers to 2 decimal places

export function round2(value: number | string) {
  if (typeof value === "number") {
    return Math.round((value + Number.EPSILON) * 100) / 100;
  } else if (typeof value === "string") {
    return Math.round((Number(value) + Number.EPSILON) * 100) / 100;
  } else throw new Error("Value is not a number or string!");
}

// Format zod validation errors as a single string
export function formatZodErrors(error: unknown): string {
  if (
    typeof error === "object" &&
    error !== null &&
    "name" in error &&
    error.name === "ZodError"
  ) {
    const zodError = error as ZodError;
    const flattenedErrors = zodError.flatten();
    const errorMessages = [
      ...Object.values(flattenedErrors.fieldErrors || {}).flat(),
      ...flattenedErrors.formErrors,
    ].join(", ");

    return errorMessages || "An unknown validation error occurred";
  }

  return "An unknown error occurred";
}
