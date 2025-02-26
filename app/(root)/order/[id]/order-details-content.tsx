import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formatCurrency, formatDateTime, formatId } from "@/lib/utils";
import Image from "next/image";
import { Order } from "@/types";
import Link from "next/link";

export default function OrderDetailsContent({ order }: { order: Order }) {
  const {
    id,
    shippingAddress,
    orderItems,
    itemsPrice,
    shippingPrice,
    taxPrice,
    totalPrice,
    paymentMethod,
    paidAt,
    isPaid,
    isDelivered,
    deliveredAt,
  } = order;

  return (
    <>
      <h1 className="py-4 text-2xl">Order{formatId(id)}</h1>
      <div className="grid md:grid-cols-3 md:gap-5">
        <div className="col-span-2 overflow-x-auto space-y-4">
          <Card>
            <CardContent className="p-4 gap-4">
              <h2 className="text-xl pb-4">Payment Method</h2>
              <p className="mb-3">{paymentMethod}</p>
              {isPaid ? (
                <Badge variant="secondary">
                  Paid at {formatDateTime(paidAt!).formattedDateTime}
                </Badge>
              ) : (
                <Badge variant="destructive">Unpaid</Badge>
              )}
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 gap-4">
              <h2 className="text-xl pb-4">Shipping Address</h2>
              <p>{shippingAddress.fullName}</p>
              <p>
                {shippingAddress.address1},{" "}
                {shippingAddress?.address2
                  ? `${shippingAddress.address2},`
                  : ""}
              </p>
              <p className="mb-3">
                {`${shippingAddress.city}-${shippingAddress.postalCode}, ${shippingAddress.country}`}
              </p>
              {isDelivered ? (
                <Badge variant="secondary">
                  Paid at {formatDateTime(deliveredAt!).formattedDateTime}
                </Badge>
              ) : (
                <Badge variant="destructive">Pending Delivery</Badge>
              )}
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
                  {orderItems.map((item) => (
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
                <div>{formatCurrency(itemsPrice)}</div>
              </div>
              <div className="flex flex-between">
                <div> Tax:</div>
                <div>{formatCurrency(taxPrice)}</div>
              </div>
              <div className="flex flex-between">
                <div>Shipping cost:</div>
                <div>{formatCurrency(shippingPrice)}</div>
              </div>
              <div className="flex flex-between border-t">
                <div>Total:</div>
                <div>{formatCurrency(totalPrice)}</div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
}
