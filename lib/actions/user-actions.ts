"use server";

import { auth, signIn, signOut } from "@/auth";
import {
  paymentMethodSchema,
  signInFormSchema,
  signUpFormSchema,
} from "../validators";
import { isRedirectError } from "next/dist/client/components/redirect-error";
import { prisma } from "@/db/prisma";
import { PaymentMethod } from "@/types";
import { formatZodErrors } from "../utils";
import { hash } from "../encrypt";

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
    newUser.password = await hash(newUser.password);

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

// Update user payment method

export async function updateUserPaymentMethod(data: PaymentMethod) {
  try {
    const session = await auth();
    const currentUser = await prisma.user.findFirst({
      where: { id: session?.user?.id },
    });

    if (!currentUser) throw new Error("User not found!");

    const paymentMethodResult = paymentMethodSchema.safeParse(data);

    if (!paymentMethodResult.success) {
      return {
        success: false,
        message: formatZodErrors(paymentMethodResult.error),
      };
    }

    const paymentMethod = paymentMethodResult.data;
    await prisma.user.update({
      where: { id: currentUser.id },
      data: {
        paymentMethod: paymentMethod.type,
      },
    });

    return {
      success: true,
      message: "User payment method updated successfully!",
    };
  } catch (error) {
    return {
      success: false,
      message: "An error occured!",
    };
  }
}
