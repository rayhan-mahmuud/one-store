"use client";

import { Button } from "@/components/ui/button";
import { createOrder } from "@/lib/actions/order-actions";
import { Check, Loader } from "lucide-react";
import { useRouter } from "next/navigation";
import { useFormStatus } from "react-dom";

const PlaceOrderButton = () => {
  const { pending } = useFormStatus();

  return (
    <Button variant="default" disabled={pending} className="w-full mt-8">
      {pending ? <Loader className="w-4 h-4 animate-spin" /> : <Check />} Place
      Order
    </Button>
  );
};

export default function PlaceOrderForm() {
  const router = useRouter();

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    const res = await createOrder();
    if (res.redirectTo) {
      router.push(res.redirectTo);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full text-center">
      <PlaceOrderButton />
    </form>
  );
}
