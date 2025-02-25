"use client";

import { Cart, CartItem } from "@/types";
import { Button } from "@/components/ui/button";
import { Loader, Minus, PlusIcon } from "lucide-react";
import { toast } from "sonner";
import { addItemToCart, removeItemFromCart } from "@/lib/actions/cart-actions";
import { useRouter } from "next/navigation";
import { useTransition } from "react";

export default function AddToCart({
  cart,
  item,
}: {
  cart?: Cart;
  item: CartItem;
}) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  async function handleAddToCartClick() {
    startTransition(async () => {
      const res = await addItemToCart(item);
      if (!res.success) {
        toast.error(res.message);
        return;
      }

      toast.success(res.message, {
        action: {
          label: "Go to Cart",
          onClick: () => router.push("/cart"),
        },
      });
    });
  }

  async function handleRemoveItemFromCart() {
    startTransition(async () => {
      const res = await removeItemFromCart(item.productId);

      if (!res.success) {
        toast.error(res.message);
        return;
      }
      toast.success(res.message);
      return;
    });
  }

  const existInCart = cart
    ? (cart.items as CartItem[]).find(
        (inCart) => inCart.productId === item.productId
      )
    : undefined;

  return existInCart ? (
    <div>
      <Button
        type="button"
        variant="outline"
        onClick={handleRemoveItemFromCart}
      >
        {isPending ? (
          <Loader className="h-4 w-4 animate-spin" />
        ) : (
          <Minus className="h-4 w-4" />
        )}
      </Button>
      <span className="mx-2">{existInCart.qty}</span>
      <Button type="button" variant="outline" onClick={handleAddToCartClick}>
        {isPending ? (
          <Loader className="h-4 w-4 animate-spin" />
        ) : (
          <PlusIcon className="h-4 w-4" />
        )}
      </Button>
    </div>
  ) : (
    <Button
      type="button"
      variant="default"
      className="w-full"
      onClick={handleAddToCartClick}
    >
      <PlusIcon /> Add to Cart
    </Button>
  );
}
