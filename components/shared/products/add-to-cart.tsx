"use client";

import { CartItem } from "@/types";
import { Button } from "@/components/ui/button";
import { PlusIcon } from "lucide-react";
import { toast } from "sonner";
import { addItemToCart } from "@/lib/actions/cart-actions";
import { useRouter } from "next/navigation";

export default function AddToCart({ item }: { item: CartItem }) {
  const router = useRouter();

  async function handleAddToCartClick() {
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
  }

  return (
    <Button variant="default" className="w-full" onClick={handleAddToCartClick}>
      <PlusIcon /> Add to Cart
    </Button>
  );
}
