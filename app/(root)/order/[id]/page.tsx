import { getOrderById } from "@/lib/actions/order-actions";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import OrderDetailsContent from "./order-details-content";
import { ShippingAddress } from "@/types";

export const metadata: Metadata = {
  title: "Order Details",
};

export default async function OrderDetailsPage(props: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await props.params;

  const order = await getOrderById(id);
  if (!order) notFound();

  return (
    <>
      <OrderDetailsContent
        order={{
          ...order,
          shippingAddress: order.shippingAddress as ShippingAddress,
        }}
      />
    </>
  );
}
