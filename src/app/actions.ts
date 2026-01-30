"use server";

import { encodedRedirect } from "@/utils/utils";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { createClient } from '@/supabase/server'
import { v4 as uuidv4 } from 'uuid';
import { Storage } from '@google-cloud/storage';

 export const signUpAction = async (formData: FormData) => {

  const bucketName = process.env.GCS_BUCKET_NAME;
  const projectId = process.env.GCP_PROJECT_ID;
  const clientEmail = process.env.GCP_CLIENT_EMAIL;
  const serviceAccountBase64 = process.env.GCP_SERVICE_ACCOUNT_BASE64;

  const email = formData.get("email")?.toString();
  const password = formData.get("password")?.toString();
  const fullName = formData.get("full_name")?.toString() || '';
  const supabase = await createClient();
  const origin = headers().get("origin");

  if (!email || !password) {
    return encodedRedirect(
      "error",
      "/sign-up",
      "Email and password are required",
    );
  }

  // GCS vars are optional for signup. If missing, we simply skip the write.
  const hasGcs = Boolean(
    bucketName && projectId && clientEmail && serviceAccountBase64,
  );

  const {
    data: { user },
    error,
  } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: `${origin}/auth/callback`,
      data: {
        full_name: fullName,
        email: email,
      },
    },
  });

  if (error) {
    console.error(error.code + " " + error.message);
    console.log("After signUp", error);
    return encodedRedirect("error", "/sign-up", error.message);
  }

  if (!user) {
    return encodedRedirect(
      "error",
      "/sign-up",
      "Sign up succeeded but no user was returned.",
    );
  }

  // Create a user profile row (best-effort)
  try {
    const { error: updateError } = await supabase.from("users").insert({
      id: user.id,
      name: fullName,
      full_name: fullName,
      email,
      user_id: user.id,
      token_identifier: user.id,
      created_at: new Date().toISOString(),
    });

    if (updateError) {
      console.error("Error updating user profile:", updateError);
    }
  } catch (err) {
    console.error("Error in user profile creation:", err);
  }

  // Optional: Write a tiny marker file to GCS (best-effort)
  if (hasGcs) {
    try {
      const decodedServiceAccount = JSON.parse(
        Buffer.from(serviceAccountBase64!, "base64").toString("utf-8"),
      );

      const storage = new Storage({
        projectId: projectId!,
        credentials: {
          client_email: clientEmail!,
          private_key: decodedServiceAccount.private_key,
        },
      });

      const bucket = storage.bucket(bucketName!);
      const filename = `${uuidv4()}.txt`;
      const file = bucket.file(filename);
      const buffer = Buffer.from(email, "utf-8");

      await file.save(buffer, {
        metadata: { contentType: "text/plain; charset=utf-8" },
      });

      const publicUrl = file.publicUrl();
      console.log(`Public URL: ${publicUrl}`);
    } catch (err) {
      console.error("Error writing marker file to GCS:", err);
    }
  }

  return encodedRedirect(
    "success",
    "/sign-up",
    "Thanks for signing up! Please check your email for a verification link.",
  );
};

export const signInAction = async (formData: FormData) => {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const supabase = await createClient();

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    return encodedRedirect("error", "/sign-in", error.message);
  }

  return redirect("/dashboard");
};

export const forgotPasswordAction = async (formData: FormData) => {
  const email = formData.get("email")?.toString();
  const supabase = await createClient();
  const origin = headers().get("origin");
  const callbackUrl = formData.get("callbackUrl")?.toString();

  if (!email) {
    return encodedRedirect("error", "/forgot-password", "Email is required");
  }

  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${origin}/auth/callback?redirect_to=/protected/reset-password`,
  });

  if (error) {
    console.error(error.message);
    return encodedRedirect(
      "error",
      "/forgot-password",
      "Could not reset password",
    );
  }

  if (callbackUrl) {
    return redirect(callbackUrl);
  }

  return encodedRedirect(
    "success",
    "/forgot-password",
    "Check your email for a link to reset your password.",
  );
};

export const resetPasswordAction = async (formData: FormData) => {
  const supabase = await createClient();

  const password = formData.get("password") as string;
  const confirmPassword = formData.get("confirmPassword") as string;

  if (!password || !confirmPassword) {
    encodedRedirect(
      "error",
      "/protected/reset-password",
      "Password and confirm password are required",
    );
  }

  if (password !== confirmPassword) {
    encodedRedirect(
      "error",
      "/dashboard/reset-password",
      "Passwords do not match",
    );
  }

  const { error } = await supabase.auth.updateUser({
    password: password,
  });

  if (error) {
    encodedRedirect(
      "error",
      "/dashboard/reset-password",
      "Password update failed",
    );
  }

  encodedRedirect("success", "/protected/reset-password", "Password updated");
};

export const signOutAction = async () => {
  const supabase = await createClient();
  await supabase.auth.signOut();
  return redirect("/sign-in");
};