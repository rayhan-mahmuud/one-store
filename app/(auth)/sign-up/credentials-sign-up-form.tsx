"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { signUpWithCredentials } from "@/lib/actions/user-actions";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useActionState } from "react";

export default function CredentialsSignUpForm() {
  const [state, action, isPending] = useActionState(signUpWithCredentials, {
    success: false,
    message: "",
  });

  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/";

  const SignUpButton = () => {
    return (
      <Button className="w-full" variant="default" disabled={isPending}>
        {isPending ? "Submitting..." : "Sign Up"}
      </Button>
    );
  };

  return (
    <form action={action}>
      <input type="hidden" name="callbackUrl" value={callbackUrl} />
      <div className="space-y-6">
        <div>
          <Label htmlFor="name">Name</Label>
          <Input
            id="name"
            name="name"
            type="text"
            required
            autoComplete="name"
            defaultValue={state?.inputs?.name}
          />
          {state.fieldErrors?.name && (
            <p className="my-2 text-sm text-destructive">
              {state.fieldErrors.name}
            </p>
          )}
        </div>
        <div>
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            name="email"
            type="email"
            required
            autoComplete="email"
            defaultValue={state?.inputs?.email}
          />
          {state.fieldErrors?.email && (
            <p className="my-2 text-sm text-destructive">
              {state.fieldErrors.email}
            </p>
          )}
        </div>
        <div>
          <Label htmlFor="password">Password</Label>
          <Input
            id="password"
            name="password"
            type="password"
            required
            autoComplete="password"
            defaultValue=""
          />
          {state.fieldErrors?.password && (
            <p className="my-2 text-sm text-destructive">
              {state.fieldErrors.password}
            </p>
          )}
        </div>
        <div>
          <Label htmlFor="confirmPassword">Confirm Password</Label>
          <Input
            id="confirmPassword"
            name="confirmPassword"
            type="password"
            required
            autoComplete="confirmPassword"
            defaultValue=""
          />
          {state.fieldErrors?.confirmPassword && (
            <p className="my-2 text-sm text-destructive">
              {state.fieldErrors.confirmPassword}
            </p>
          )}
        </div>
        <SignUpButton />
        {state && !state.success && (
          <div className="text-center text-destructive">{state.message}</div>
        )}
        <p className="text-xs text-center text-muted-foreground">
          Already have an account?{" "}
          <Link href="/sign-in" target="_self" className="link">
            Sign In
          </Link>
        </p>
      </div>
    </form>
  );
}
