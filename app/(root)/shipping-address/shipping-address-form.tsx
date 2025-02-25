"use client";

import { shippingAddressSchema } from "@/lib/validators";
import { ShippingAddress } from "@/types";
import { SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { DefaultShippingAddressValue } from "@/lib/constants";
import { useRouter } from "next/navigation";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useTransition } from "react";
import { ArrowRight, Loader } from "lucide-react";
import { updateUserAddress } from "@/lib/actions/cart-actions";
import { toast } from "sonner";

export default function ShippingAddressForm({
  address,
}: {
  address: ShippingAddress;
}) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const form = useForm<z.infer<typeof shippingAddressSchema>>({
    resolver: zodResolver(shippingAddressSchema),
    defaultValues: address || DefaultShippingAddressValue,
  });

  const onSubmit: SubmitHandler<z.infer<typeof shippingAddressSchema>> = async (
    values
  ) => {
    startTransition(async () => {
      const res = await updateUserAddress(values);
      if (!res.success) {
        toast.error(res.message);
        return;
      }
      router.push("/payment-method");
    });
  };

  return (
    <>
      <div className="max-w-md mx-auto space-y-4">
        <h1 className="h2-bold mt-4">Shipping Address</h1>
        <p className="text-sm text-muted-foreground">
          Enter your shipping address details below
        </p>
        <Form {...form}>
          <form method="post" onSubmit={form.handleSubmit(onSubmit)}>
            <div className="flex flex-col md:flex-row gap-5">
              <FormField
                control={form.control}
                name="fullName"
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormLabel>Full Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Full name..." {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="flex flex-col md:flex-row gap-5">
              <FormField
                control={form.control}
                name="address1"
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormLabel>Address Line 1</FormLabel>
                    <FormControl>
                      <Input placeholder="Address..." {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="flex flex-col md:flex-row gap-5">
              <FormField
                control={form.control}
                name="address2"
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormLabel>Address Line 2</FormLabel>
                    <FormControl>
                      <Input placeholder="Address..." {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="flex flex-col md:flex-row gap-5">
              <FormField
                control={form.control}
                name="city"
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormLabel>City</FormLabel>
                    <FormControl>
                      <Input placeholder="City..." {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="flex flex-col md:flex-row gap-5">
              <FormField
                control={form.control}
                name="country"
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormLabel>Country</FormLabel>
                    <FormControl>
                      <Input placeholder="Country..." {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="flex flex-col md:flex-row gap-5">
              <FormField
                control={form.control}
                name="postalCode"
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormLabel>Postal Code</FormLabel>
                    <FormControl>
                      <Input placeholder="Postal Code..." {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="flex justify-center w-full mt-3">
              <Button type="submit" variant="default" disabled={isPending}>
                {isPending ? (
                  <Loader className="w-4 h-4 animate-spin" />
                ) : (
                  <>
                    <ArrowRight />
                    Continue
                  </>
                )}
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </>
  );
}
