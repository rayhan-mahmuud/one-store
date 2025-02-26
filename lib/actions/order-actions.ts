"use server";

import { auth } from "@/auth";
import { isRedirectError } from "next/dist/client/components/redirect-error";
import { getUserById } from "./user-actions";
import { getUserCart } from "./cart-actions";
import { insertOrderSchema } from "../validators";
import { convertToPlainObject, formatZodErrors } from "../utils";
import { prisma } from "@/db/prisma";
import { CartItem } from "@/types";

//Create order and order items
export async function createOrder() {
  try {
    const session = await auth();
    if (!session) throw new Error("User is not authenticated!");

    const userId = session.user?.id;
    if (!userId) throw new Error("User not found!");
    const user = await getUserById(userId);
    if (!user) throw new Error("User not found!");

    const cart = await getUserCart();
    //Redirect back users if cart or user infos are not avlaible
    if (!cart || cart.items.length === 0) {
      return {
        success: false,
        message: "",
        redirectTo: "/cart",
      };
    }
    if (!user.address) {
      return {
        success: false,
        message: "",
        redirectTo: "/shipping-address",
      };
    }
    if (!user.paymentMethod) {
      return {
        success: false,
        message: "",
        redirectTo: "/payment-method",
      };
    }

    //Create order
    const orderRes = insertOrderSchema.safeParse({
      userId: user.id,
      itemsPrice: cart.itemsPrice,
      totalPrice: cart.totalPrice,
      shippingPrice: cart.shippingPrice,
      taxPrice: cart.taxPrice,
      shippingAddress: user.address,
      paymentMethod: user.paymentMethod,
    });

    if (!orderRes.success) {
      return {
        success: false,
        meassage: formatZodErrors(orderRes.error),
      };
    }

    const order = orderRes.data;

    //Transection for inserting order and order items to db

    const insertOrderId = await prisma.$transaction(async (tx) => {
      //Create the order
      const insertedOrder = await tx.order.create({ data: order });

      //Create order items
      for (const item of cart.items as CartItem[]) {
        await tx.orderItem.create({
          data: {
            ...item,
            orderId: insertedOrder.id,
            price: item.price,
          },
        });
      }

      //Clearing the cart
      await tx.cart.update({
        where: { id: cart.id },
        data: {
          items: [],
          itemsPrice: 0,
          taxPrice: 0,
          shippingPrice: 0,
          totalPrice: 0,
        },
      });
      return insertedOrder.id;
    });

    if (!insertOrderId) throw new Error("Failed to place order!");
    return {
      success: true,
      message: "Oderder created succesfully!",
      redirectTo: `/order/${insertOrderId}`,
    };
  } catch (error) {
    if (isRedirectError(error)) throw error;
    return {
      success: false,
      message: "An unknown error occured!",
    };
  }
}

//Get order by id

export async function getOrderById(orderId: string) {
  const order = await prisma.order.findFirst({
    where: { id: orderId },
    include: {
      orderItems: true,
      user: { select: { name: true, email: true } },
    },
  });

  return convertToPlainObject(order);
}
