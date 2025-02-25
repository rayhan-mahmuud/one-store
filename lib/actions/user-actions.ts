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
  const rawData = {
    email: formData.get("email") as string,
    password: formData.get("password") as string,
  };
  try {
    const userResult = signInFormSchema.safeParse(rawData);
    if (!userResult.success) {
      return {
        success: false,
        message: "Invalid email or password!",
        fieldErrors: userResult.error.flatten().fieldErrors,
        inputs: rawData,
      };
    }
    const user = userResult.data;

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
  } catch (error) {
    if (isRedirectError(error)) {
      throw error;
    }
    return { success: false, message: "User registration failed!" };
  }
}

// Get user by userId

export async function getUserById(userId: string) {
  const user = await prisma.user.findFirst({
    where: { id: userId },
  });

  if (!user) return undefined;

  return user;
}
