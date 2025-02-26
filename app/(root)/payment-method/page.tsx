import CheckoutSteps from "@/components/shared/checkout-steps";
import PaymentMethodForm from "./payment-method-form";
import { auth } from "@/auth";
import { getUserById } from "@/lib/actions/user-actions";

export default async function PaymentMethodPage() {
  //Get current user
  const session = await auth();
  const userId = session?.user?.id;
  if (!userId) throw new Error("User not found!");
  const user = await getUserById(userId);
  if (!user) throw new Error("User not found!");

  return (
    <>
      <CheckoutSteps current={2} />
      <PaymentMethodForm paymentMethod={user.paymentMethod} />
    </>
  );
}
