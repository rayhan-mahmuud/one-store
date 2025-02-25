"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { addItemToCart, removeItemFromCart } from "@/lib/actions/cart-actions";
import { formatCurrency } from "@/lib/utils";
import { Cart, CartItem } from "@/types";
import { ArrowRight, Loader, Minus, Plus } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { toast } from "sonner";

export default function CartTable({ cart }: { cart?: Cart }) {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  async function handleAddToCartClick(item: CartItem) {
    startTransition(async () => {
      const res = await addItemToCart(item);
      if (!res.success) {
        toast.error(res.message);
        return;
      }
      toast.success(res.message);
      return;
    });
  }

  async function handleRemoveFromCartClick(productId: string) {
    startTransition(async () => {
      const res = await removeItemFromCart(productId);

      if (!res.success) {
        toast.error(res.message);
        return;
      }
      toast.success(res.message);
      return;
    });
  }

  async function handleProceedToCheckout() {
    startTransition(() => {
      router.push("/shipping-address");
    });
  }

  return (
    <>
      <h1 className="py-4 h2-bold">Shopping Cart</h1>
      {!cart || cart.items.length === 0 ? (
        <div>
          <p className="py-4">
            Cart is empty!{" "}
            <Link href="/" className="cursor-pointer">
              Go shopping!
            </Link>
          </p>
        </div>
      ) : (
        <div className="grid md:grid-cols-4 md:gap-5">
          <div className="overflow-x-auto md:col-span-3">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Product</TableHead>
                  <TableHead className="text-center">Quantity</TableHead>
                  <TableHead className="text-right">Price</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {cart.items.map((item) => (
                  <TableRow key={item.slug}>
                    <TableCell>
                      <Link
                        href={`/products/${item.slug}`}
                        className="flex items-center"
                      >
                        <Image
                          src={item.image}
                          alt={item.name}
                          height={50}
                          width={50}
                        />
                        <span className="px-2">{item.name}</span>
                      </Link>
                    </TableCell>
                    <TableCell className="text-center">
                      <Button
                        disabled={isPending}
                        type="button"
                        variant="outline"
                        onClick={() =>
                          handleRemoveFromCartClick(item.productId)
                        }
                      >
                        {isPending ? (
                          <Loader className="h-4 w-4 animate-spin" />
                        ) : (
                          <Minus className="w-4 h-4" />
                        )}
                      </Button>
                      <span className="px-2">{item.qty}</span>
                      <Button
                        disabled={isPending}
                        type="button"
                        variant="outline"
                        onClick={() => handleAddToCartClick(item)}
                      >
                        {isPending ? (
                          <Loader className="h-4 w-4 animate-spin" />
                        ) : (
                          <Plus className="w-4 h-4" />
                        )}
                      </Button>
                    </TableCell>
                    <TableCell>
                      <p className="text-right">${item.price}</p>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          <Card>
            <CardContent className="  p-4 mx-3 ">
              <div className="text-lg pb-4 flex justify-between">
                Subtotal ({cart.items.reduce((a, c) => a + c.qty, 0)}):
                <span className="font-semibold">
                  {" "}
                  {formatCurrency(cart.totalPrice)}
                </span>
              </div>

              <Button
                disabled={isPending}
                type="button"
                variant="default"
                className="w-full mt-8"
                onClick={handleProceedToCheckout}
              >
                {isPending ? (
                  <Loader className="h-4 w-4 animate-spin" />
                ) : (
                  <>
                    <ArrowRight /> Proceed to Checkout
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        </div>
      )}
    </>
  );
}
