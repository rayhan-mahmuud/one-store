"use server";

import { signIn, signOut } from "@/auth";
import { signInFormSchema, signUpFormSchema } from "../validators";
import { isRedirectError } from "next/dist/client/components/redirect-error";
import { hashSync } from "bcrypt-ts-edge";
import { prisma } from "@/db/prisma";

export async function signInWithCredentials(
  prevState: unknown,
  formData: FormData
) {
  try {
    const user = signInFormSchema.safeParse({
      email: formData.get("email"),
      password: formData.get("password"),
    });
    await signIn("credentials", user);
    return { success: true, message: "Successfully Logged In!" };
  } catch (error: any) {
    if (isRedirectError(error)) {
      throw error;
    } else if (error?.name === "ZodError") {
      // Flatten errors to send field-level errors
      const { fieldErrors } = error.flatten();
      return { success: false, fieldErrors };
    } else {
      return { success: false, message: "Invalid email or password!" };
    }
  }
}

export async function userSignOut() {
  await signOut();
}

export async function signUpWithCredentials(
  prevState: unknown,
  formData: FormData
) {
  const rawData = {
    name: formData.get("name") as string,
    email: formData.get("email") as string,
    password: formData.get("password") as string,
    confirmPassword: formData.get("confirmPassword") as string,
  };

  try {
    const newUserResult = signUpFormSchema.safeParse(rawData);

    if (!newUserResult.success) {
      return {
        success: false,
        message: "Please fix the errors above!",
        fieldErrors: newUserResult.error.flatten().fieldErrors,
        inputs: rawData,
      };
    }
    const newUser = newUserResult.data;
    const plainPassword = newUser.password;
    newUser.password = hashSync(newUser.password, 10);

    // Adding user to the database
    await prisma.user.create({
      data: {
        name: newUser.name,
        email: newUser.email,
        password: newUser.password,
      },
    });

    // Sigining in the user after registration
    await signIn("credentials", {
      email: newUser.email,
      password: plainPassword,
    });
    return { success: true, message: "User registered succesfully!" };
  } catch (error: any) {
    if (isRedirectError(error)) {
      throw error;
    }
    return { success: false, message: "User registration failed!" };
  }
}
