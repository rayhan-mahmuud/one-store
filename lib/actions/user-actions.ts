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
    const user = signInFormSchema.parse({
      email: formData.get("email"),
      password: formData.get("password"),
    });
    await signIn("credentials", user);
    return { success: true, message: "Successfully Logged In!" };
  } catch (error) {
    if (isRedirectError(error)) {
      throw error;
    }
    return { success: false, message: "Invalid email or password!" };
  }
}

export async function userSignOut() {
  await signOut();
}

export async function signUpWithCredentials(
  prevState: unknown,
  formData: FormData
) {
  try {
    const newUser = signUpFormSchema.parse({
      name: formData.get("name"),
      email: formData.get("email"),
      password: formData.get("password"),
      confirmPassword: formData.get("confirmPassword"),
    });
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
  } catch (error) {
    if (isRedirectError(error)) {
      throw error;
    }

    return { success: false, message: "User registration failed!" };
  }
}
