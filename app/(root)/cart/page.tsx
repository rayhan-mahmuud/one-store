import { Metadata } from "next";
import CartTable from "./carte-table";
import { getUserCart } from "@/lib/actions/cart-actions";

export const metadata: Metadata = {
  title: "Cart",
};

export default async function CartPage() {
  const cart = await getUserCart();

  return (
    <>
      <CartTable cart={cart} />
    </>
  );
}
