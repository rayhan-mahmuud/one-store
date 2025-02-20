"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { signInWithCredentials } from "@/lib/actions/user-actions";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useActionState, useRef } from "react";
import { useFormStatus } from "react-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { signInFormSchema } from "@/lib/validators";

const SignInButton = () => {
  const { pending } = useFormStatus();
  return (
    <Button className="w-full" variant="default" disabled={pending}>
      {pending ? "Signing in..." : "Sign In"}
    </Button>
  );
};

export default function CredentialsSignInForm() {
  const [data, action] = useActionState(signInWithCredentials, {
    success: false,
    message: "",
  });
  const signInFormRef = useRef<HTMLFormElement>(null);

  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/";

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(signInFormSchema),
  });

  return (
    <form
      action={action}
      ref={signInFormRef}
      onSubmit={handleSubmit(() => signInFormRef.current?.submit())}
    >
      <input type="hidden" name="callbackUrl" value={callbackUrl} />
      <div className="space-y-6">
        <div>
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            required
            autoComplete="email"
            defaultValue=""
            {...register("email")}
          />
          {errors.email && (
            <p className="my-2 text-sm text-destructive">
              {errors.email?.message}
            </p>
          )}
        </div>
        <div>
          <Label htmlFor="password">Password</Label>
          <Input
            id="password"
            type="password"
            required
            autoComplete="password"
            defaultValue=""
            {...register("password")}
          />
        </div>
        <SignInButton />
        {data && !data.success && (
          <div className="text-center text-destructive">{data.message}</div>
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
