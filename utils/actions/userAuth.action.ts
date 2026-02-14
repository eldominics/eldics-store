"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "../supabase/server";
import { emailValidationSchema } from "../zodvalidations/form-validations";

export async function login(formData: FormData) {
  const supabase = await createClient();
  // check email
  const email = formData.get("email") as string;

  const emailValidation = emailValidationSchema.safeParse({ email: email });
  if (!emailValidation.success) {
    console.log("Invalid email format");
    return;
  }

  const { error } = await supabase.auth.signInWithOtp({
    email: email,
    options: {
      shouldCreateUser: true,
    },
  });

  if (error) {
    console.log("Got errort signing in--->", error);
    revalidatePath("/");
    return { error: error.message };
  }

  revalidatePath("/");
}

export async function verifyToken(formData: FormData) {
  const supabase = await createClient();
  // check email
  const email = formData.get("email") as string;
  const token = formData.get("token") as string;

  const emailValidation = emailValidationSchema.safeParse({ email: email });
  if (!emailValidation.success) {
    console.log("Invalid email format");
    return;
  }

  const {
    data: { session },
    error,
  } = await supabase.auth.verifyOtp({
    email: email,
    token: token.trim(),
    type: "email",
  });

  if (error) {
    console.log("Got errort verifying OTP--->", error);
    return { error: error.message, session: null };
  }
  console.log("User session:", session);
  revalidatePath("/");
  return { error: null, session };
}

export async function signOut() {
  const supabase = await createClient();
  const { error } = await supabase.auth.signOut();

  if (error) {
    console.log("Error signing out:", error);
    return { error: error.message };
  }

  revalidatePath("/");
}
