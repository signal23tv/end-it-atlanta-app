"use server";

import { createClient } from "@/lib/supabase/server";

export type SignupState = {
  error?: string;
  success?: boolean;
};

const USERNAME_RE = /^[a-z0-9_]{3,24}$/;

export async function signup(
  _prevState: SignupState,
  formData: FormData
): Promise<SignupState> {
  const email = String(formData.get("email") || "").trim();
  const password = String(formData.get("password") || "");
  const username = String(formData.get("username") || "")
    .trim()
    .toLowerCase();
  const displayName = String(formData.get("display_name") || "").trim();

  if (!email || !password || !username || !displayName) {
    return { error: "All fields are required." };
  }
  if (!USERNAME_RE.test(username)) {
    return {
      error:
        "Username must be 3-24 characters: lowercase letters, numbers, and underscores only.",
    };
  }
  if (password.length < 8) {
    return { error: "Password must be at least 8 characters." };
  }

  const supabase = await createClient();

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        username,
        display_name: displayName,
      },
    },
  });

  if (error) {
    // Supabase returns a generic "already registered" style message;
    // pass it through rather than guessing at specifics.
    return { error: error.message };
  }

  // Supabase intentionally returns a 200 with no error for an email
  // that's already registered (to avoid leaking which emails exist).
  // The tell is an empty identities array. Without this check the
  // form would show "check your email" even though nothing was sent
  // and no account was created or changed.
  if (data.user && data.user.identities && data.user.identities.length === 0) {
    return {
      error:
        "An account with that email already exists. Try logging in instead, or use \"Forgot password\" on the login page.",
    };
  }

  return { success: true };
}
