import { auth } from "@/auth";
import CheckoutSteps from "@/components/shared/checkout-steps";
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
import { getUserCart } from "@/lib/actions/cart-actions";
import { getUserById } from "@/lib/actions/user-actions";
import { formatCurrency } from "@/lib/utils";
import { ShippingAddress } from "@/types";
import { Edit } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";
import PlaceOrderForm from "./place-order-form";

export default async function PlaceOrderPage() {
  const cart = await getUserCart();
  const session = await auth();
  const userId = session?.user?.id;
  if (!userId) throw new Error("User not found!");
  const user = await getUserById(userId);
  if (!user) throw new Error("User not found!");

  if (!cart || cart.items.length === 0) redirect("/cart");

  if (!user.address) redirect("/shipping-address");
  if (!user.paymentMethod) redirect("/payment-method");

  const userAddress = user.address as ShippingAddress;

  return (
    <>
      <CheckoutSteps current={3} />
      <h1 className="py-4 text-center h2-bold">Place Order</h1>
      <div className="grid md:grid-cols-3 md:gap-5">
        <div className="md:col-span-2 overflow-x-auto space-y-4">
          <Card>
            <CardContent className="p-4 gap-4">
              <h2 className="text-xl pb-4">Shipping Address</h2>
              <p>{userAddress.fullName}</p>
              <p>
                {userAddress.address1},{" "}
                {userAddress?.address2 ? `${userAddress.address2},` : ""}
              </p>
              <p>
                {`${userAddress.city}-${userAddress.postalCode}, ${userAddress.country}`}
              </p>
              <Link href={"/shipping-address"}>
                <Button variant="outline" className="text-center mt-4">
                  <Edit />
                  Edit
                </Button>
              </Link>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 gap-4">
              <h2 className="text-xl pb-4">Payment Method</h2>
              <p>{user.paymentMethod}</p>
              <Link href={"/payment-method"}>
                <Button variant="outline" className="text-center mt-4">
                  <Edit />
                  Edit
                </Button>
              </Link>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 gap-4">
              <h2 className="text-xl pb-4">Order Items</h2>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Item</TableHead>
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
                          <p>{item.name}</p>
                        </Link>
                      </TableCell>
                      <TableCell className="text-center">{item.qty}</TableCell>
                      <TableCell className="text-right">
                        ${item.price}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
        <div>
          <Card>
            <CardContent className="p-4 gap-4 space-y-2">
              <div className="flex flex-between">
                <div>Items price:</div>
                <div>{formatCurrency(cart.itemsPrice)}</div>
              </div>
              <div className="flex flex-between">
                <div> Tax:</div>
                <div>{formatCurrency(cart.taxPrice)}</div>
              </div>
              <div className="flex flex-between">
                <div>Shipping cost:</div>
                <div>{formatCurrency(cart.shippingPrice)}</div>
              </div>
              <div className="flex flex-between border-t">
                <div>Total:</div>
                <div>{formatCurrency(cart.totalPrice)}</div>
              </div>
              <PlaceOrderForm />
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
}
