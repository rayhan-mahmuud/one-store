import ws from "ws";
import { PrismaClient } from "@prisma/client";
import { PrismaNeon } from "@prisma/adapter-neon";
import { Pool, neonConfig } from "@neondatabase/serverless";

const prismaClientSingleton = () => {
  neonConfig.webSocketConstructor = ws;
  const connectionString = `${process.env.DATABASE_URL}`;

  const pool = new Pool({ connectionString });
  const adapter = new PrismaNeon(pool);
  const prisma = new PrismaClient({ adapter }).$extends({
    result: {
      product: {
        price: {
          compute(product) {
            return product.price.toString();
          },
        },
        rating: {
          compute(product) {
            return product.rating.toString();
          },
        },
      },
      cart: {
        itemsPrice: {
          needs: { itemsPrice: true },
          compute(cart) {
            return cart.itemsPrice.toString();
          },
        },
        shippingPrice: {
          needs: { shippingPrice: true },
          compute(cart) {
            return cart.shippingPrice.toString();
          },
        },
        taxPrice: {
          needs: { taxPrice: true },
          compute(cart) {
            return cart.taxPrice.toString();
          },
        },
        totalPrice: {
          needs: { totalPrice: true },
          compute(cart) {
            return cart.totalPrice.toString();
          },
        },
      },
      order: {
        itemsPrice: {
          needs: { itemsPrice: true },
          compute(cart) {
            return cart.itemsPrice.toString();
          },
        },
        shippingPrice: {
          needs: { shippingPrice: true },
          compute(cart) {
            return cart.shippingPrice.toString();
          },
        },
        taxPrice: {
          needs: { taxPrice: true },
          compute(cart) {
            return cart.taxPrice.toString();
          },
        },
        totalPrice: {
          needs: { totalPrice: true },
          compute(cart) {
            return cart.totalPrice.toString();
          },
        },
      },
      orderItem: {
        price: {
          compute(cart) {
            return cart.price.toString();
          },
        },
      },
    },
  });

  return prisma;
};

declare const globalThis: {
  prismaGlobal: ReturnType<typeof prismaClientSingleton>;
} & typeof global;

export const prisma = globalThis.prismaGlobal ?? prismaClientSingleton();

if (process.env.NODE_ENV !== "production") globalThis.prismaGlobal = prisma;
