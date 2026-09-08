"use server";

import { createClient } from "@/lib/supabase/server";

export type WaitlistState = { error?: string; success?: boolean };

export async function joinNutJuiceWaitlist(
  _prev: WaitlistState,
  formData: FormData
): Promise<WaitlistState> {
  const email = String(formData.get("email") ?? "").trim();

  if (!email || !email.includes("@")) {
    return { error: "Enter a valid email address." };
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { error } = await supabase.from("nut_juice_waitlist").insert({
    email,
    user_id: user?.id ?? null,
  });

  if (error) {
    return { error: "Couldn't join the waitlist — try again in a moment." };
  }

  return { success: true };
}
