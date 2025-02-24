"use server";

import { auth } from "@/auth";
import { prisma } from "@/db/prisma";
import { CartItem } from "@/types";
import { cookies } from "next/headers";
import { convertToPlainObject, formatZodErrors, round2 } from "../utils";
import { cartItemSchema, insertCartSchema } from "../validators";
import { revalidatePath } from "next/cache";
import { Prisma } from "@prisma/client";

//Calculating cart prices
function calculatePrices(items: CartItem[]) {
  const itemsPrice = round2(
    items.reduce((acc, item) => acc + Number(item.price) * item.qty, 0)
  );
  const shippingPrice = round2(itemsPrice > 100 ? 10 : 20);
  const taxPrice = round2(0.15 * itemsPrice);
  const totalPrice = round2(itemsPrice + shippingPrice + taxPrice);

  return {
    itemsPrice: itemsPrice.toFixed(2),
    shippingPrice: shippingPrice.toFixed(2),
    taxPrice: taxPrice.toFixed(2),
    totalPrice: totalPrice.toFixed(2),
  };
}

export async function addItemToCart(data: CartItem) {
  try {
    // Check for Cart cookie
    const sessionCartId = (await cookies()).get("sessionCartId")?.value;
    if (!sessionCartId) throw new Error("Cart session not found!");

    // Get user id from session
    const session = await auth();
    const userId = session?.user?.id ? (session.user.id as string) : undefined;

    // Get user cart
    const cart = await getUserCart();

    // Validate item and get the product from database

    const itemResult = cartItemSchema.safeParse(data);

    if (!itemResult.success) {
      return {
        success: false,
        message: "There was an issue in validating the product!",
        error: formatZodErrors(itemResult.error),
      };
    }
    const item = itemResult.data;

    const product = await prisma.product.findFirst({
      where: { id: item.productId },
    });
    if (!product) throw new Error("Product not found!");

    // create new cart if cart not found
    if (!cart) {
      const newCartResult = insertCartSchema.safeParse({
        userId: userId,
        items: [item],
        sessionCartId: sessionCartId,
        ...calculatePrices([item]),
      });
      if (!newCartResult.success) {
        return {
          success: false,
          message: "There was an issue in validating the Cart!",
          error: formatZodErrors(newCartResult.error),
        };
      }

      const newCart = newCartResult.data;
      // Add new cart to the database
      await prisma.cart.create({
        data: newCart,
      });

      //Revalidate product page
      revalidatePath(`/product/${product.slug}`);
      return {
        success: true,
        message: `${product.name} added to cart successfully!`,
      };
    } else {
      // Check if the product exist in the cart
      const existInCart = (cart.items as CartItem[]).find(
        (inCart) => inCart.productId === item.productId
      );
      if (existInCart) {
        //If in cart update qty
        if (product.stock < existInCart.qty + 1) {
          throw new Error("Not enough stock!");
        }
        (cart.items as CartItem[]).find(
          (inCart) => inCart.productId === item.productId
        )!.qty = existInCart.qty + 1;
      } else {
        //If not in cart add to cart
        if (product.stock < 1) {
          throw new Error("Not enough stock!");
        }
        cart.items.push(item);
      }
      //Save cart to database
      await prisma.cart.update({
        where: { id: cart.id },
        data: {
          items: cart.items as Prisma.CartUpdateitemsInput[],
          ...calculatePrices(cart.items as CartItem[]),
        },
      });
      return {
        success: true,
        message: `${product.name} is ${
          existInCart ? "updated in" : "added in"
        } cart`,
      };
    }
  } catch (error) {
    return {
      success: false,
      message: "There was an issue!",
    };
  }
}

export async function getUserCart() {
  // Check for Cart cookie
  const sessionCartId = (await cookies()).get("sessionCartId")?.value;
  if (!sessionCartId) throw new Error("Cart session not found!");

  // Get user id from session
  const session = await auth();
  const userId = session?.user?.id ? (session.user.id as string) : undefined;

  const cart = await prisma.cart.findFirst({
    where: userId ? { userId: userId } : { sessionCartId: sessionCartId },
  });

  if (!cart) return undefined;

  return convertToPlainObject({
    ...cart,
    items: cart.items as CartItem[],
    itemsPrice: cart.itemsPrice.toString(),
    totalPrice: cart.totalPrice.toString(),
    shippingPrice: cart.shippingPrice.toString(),
    taxPrice: cart.taxPrice.toString(),
  });
}
