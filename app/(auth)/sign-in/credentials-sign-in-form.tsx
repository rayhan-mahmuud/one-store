"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { signInWithCredentials } from "@/lib/actions/user-actions";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useActionState } from "react";

export default function CredentialsSignInForm() {
  const [state, action, isPending] = useActionState(signInWithCredentials, {
    success: false,
    message: "",
  });
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/";

  const SignInButton = () => {
    return (
      <Button className="w-full" variant="default" disabled={isPending}>
        {isPending ? "Signing in..." : "Sign In"}
      </Button>
    );
  };

  return (
    <form action={action}>
      <input type="hidden" name="callbackUrl" value={callbackUrl} />
      <div className="space-y-6">
        <div>
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            name="email"
            type="email"
            required
            autoComplete="email"
          />
          {state?.fieldErrors?.email && (
            <p className="my-2 text-sm text-destructive">
              {state?.fieldErrors.email}
            </p>
          )}
        </div>
        <div>
          <Label htmlFor="password">Password</Label>
          <Input
            id="password"
            name="name"
            type="password"
            required
            autoComplete="password"
          />
        </div>
        <SignInButton />
        {state && !state.success && (
          <div className="text-center text-destructive">{state.message}</div>
        )}
        <p className="text-xs text-center text-muted-foreground">
          Don&apos;t have an account?{" "}
          <Link href="/sign-up" target="_self" className="link">
            Sign Up
          </Link>
        </p>
      </div>
    </form>
  );
}
