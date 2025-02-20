"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { signUpWithCredentials } from "@/lib/actions/user-actions";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useActionState, useRef } from "react";
import { useFormStatus } from "react-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { signUpFormSchema } from "@/lib/validators";

const SignUpButton = () => {
  const { pending } = useFormStatus();
  return (
    <Button className="w-full" variant="default" disabled={pending}>
      {pending ? "Submitting..." : "Sign Up"}
    </Button>
  );
};

export default function CredentialsSignUpForm() {
  const [data, action] = useActionState(signUpWithCredentials, {
    success: false,
    message: "",
  });

  const signUpFormRef = useRef<HTMLFormElement>(null);

  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/";

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(signUpFormSchema),
  });

  return (
    <form
      action={action}
      ref={signUpFormRef}
      onSubmit={handleSubmit(() => signUpFormRef.current?.submit())}
    >
      <input type="hidden" name="callbackUrl" value={callbackUrl} />
      <div className="space-y-6">
        <div>
          <Label htmlFor="name">Name</Label>
          <Input
            id="name"
            {...register("name")}
            type="text"
            required
            autoComplete="name"
            defaultValue=""
          />
          {errors.name && (
            <p className="my-2 text-sm text-destructive">
              {errors.name?.message}
            </p>
          )}
        </div>
        <div>
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            {...register("email")}
            type="email"
            required
            autoComplete="email"
            defaultValue=""
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
            {...register("password")}
            type="password"
            required
            autoComplete="password"
            defaultValue=""
          />
          {errors.password && (
            <p className="my-2 text-sm text-destructive">
              {errors.password?.message}
            </p>
          )}
        </div>
        <div>
          <Label htmlFor="confirmPassword">Confirm Password</Label>
          <Input
            id="confirmPassword"
            {...register("confirmPassword")}
            type="password"
            required
            autoComplete="confirmPassword"
            defaultValue=""
          />
          {errors.confirmPassword && (
            <p className="my-2 text-sm text-destructive">
              {errors.confirmPassword?.message}
            </p>
          )}
        </div>
        <SignUpButton />
        {data && !data.success && (
          <div className="text-center text-destructive">{data.message}</div>
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
