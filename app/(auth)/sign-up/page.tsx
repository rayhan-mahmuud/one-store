import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { APP_NAME } from "@/lib/constants";
import Image from "next/image";
import Link from "next/link";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import CredentialsSignUpForm from "./credentials-sign-up-form";

export const metadata = {
  title: "Sign Up",
};

export default async function SignUpPage(props: {
  searchParams: Promise<{ callbackUrl: string }>;
}) {
  const session = await auth();

  const { callbackUrl } = await props.searchParams;

  if (session) redirect(callbackUrl || "/");

  return (
    <div className=" w-full max-w-md mx-auto">
      <Card>
        <CardHeader className="space-y-4">
          <Link href="/" className="flex-center">
            <Image
              src="/images/logo.svg"
              alt={`${APP_NAME}`}
              width={80}
              height={80}
              priority
            />
          </Link>
          <CardTitle className="text-center">Create Account</CardTitle>
          <CardDescription className="text-center">
            Enter the informations below to sign up.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <CredentialsSignUpForm />
        </CardContent>
      </Card>
    </div>
  );
}
