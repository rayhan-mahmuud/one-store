import CartTable from "./carte-table";
import { getUserCart } from "@/lib/actions/cart-actions";

export default async function CartPage() {
  const cart = await getUserCart();

  return (
    <>
      <CartTable cart={cart} />
    </>
  );
}
