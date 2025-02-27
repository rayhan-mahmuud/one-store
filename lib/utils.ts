import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { ZodError } from "zod";
import qs from "query-string";

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

//Format currency in cart total
const CURRENCY_FORMATTER = new Intl.NumberFormat("en-US", {
  currency: "USD",
  style: "currency",
  minimumFractionDigits: 2,
});

export function formatCurrency(price: number | string) {
  if (typeof price === "number") {
    return CURRENCY_FORMATTER.format(price);
  } else if (typeof price === "string") {
    return CURRENCY_FORMATTER.format(Number(price));
  } else return "Nan";
}

//Shorten Id

export function formatId(id: string) {
  return `##${id.substring(id.length - 6)}`;
}

//Format date and time

export function formatDateTime(dateString: Date) {
  const date = new Date(dateString);

  // Format full date and time (12-hour format with AM/PM)
  const formattedDateTime = new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "numeric",
    minute: "numeric",
    second: "numeric",
    hour12: true,
  }).format(date);

  // Format date only
  const formattedDate = new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(date);

  // Format time only (12-hour format)
  const formattedTime = new Intl.DateTimeFormat("en-US", {
    hour: "numeric",
    minute: "numeric",
    second: "numeric",
    hour12: true,
  }).format(date);

  return {
    formattedDateTime,
    formattedDate,
    formattedTime,
  };
}

//Format query for pagination handling

export function formUrlQuery({
  params,
  key,
  value,
}: {
  params: string;
  key: string;
  value: string | null;
}) {
  const query = qs.parse(params);
  query[key] = value;

  return qs.stringifyUrl(
    {
      url: window.location.pathname,
      query: query,
    },
    {
      skipNull: true,
    }
  );
}
