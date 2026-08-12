"use server";

import { signIn } from "@/auth";
import { AuthError } from "next-auth";

export async function authenticate(
  prevState: string | undefined,
  formData: FormData,
) {
  try {
    const data = Object.fromEntries(formData);
    // Use the explicit object pattern instead of passing FormData directly to ensure we can specify redirectTo
    await signIn("credentials", { ...data, redirectTo: "/dashboard" });
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case "CredentialsSignin":
          return "Invalid email or password.";
        default:
          return "Something went wrong during sign in.";
      }
    }
    // Auth.js handles successful redirects by throwing an error. We must rethrow it.
    throw error;
  }
}
