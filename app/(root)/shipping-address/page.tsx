import { auth } from "@/auth";
import { getUserCart } from "@/lib/actions/cart-actions";
import { getUserById } from "@/lib/actions/user-actions";
import { redirect } from "next/navigation";
import ShippingAddressForm from "./shipping-address-form";
import { ShippingAddress } from "@/types";
import CheckoutSteps from "@/components/shared/checkout-steps";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Shipping Details",
};

export default async function ShippingAddressPage() {
  const cart = await getUserCart();
  if (!cart || cart.items.length === 0) redirect("/cart");

  const session = await auth();
  const userId = session?.user?.id;

  if (!userId) throw new Error("User not found");

  const user = await getUserById(userId as string);
  if (!user) throw new Error("User not found");

  return (
    <>
      <CheckoutSteps current={1} />
      <ShippingAddressForm address={user.address as ShippingAddress} />
    </>
  );
}
