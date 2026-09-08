"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export type ProfileEditState = {
  error?: string;
};

export async function updateProfile(
  _prevState: ProfileEditState,
  formData: FormData
): Promise<ProfileEditState> {
  const displayName = String(formData.get("display_name") || "").trim();
  const bio = String(formData.get("bio") || "").trim();

  if (!displayName) {
    return { error: "Display name can't be empty." };
  }
  if (bio.length > 280) {
    return { error: "Bio must be 280 characters or fewer." };
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return { error: "You must be logged in." };
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("username")
    .eq("id", user.id)
    .single();

  const { error } = await supabase
    .from("profiles")
    .update({ display_name: displayName, bio: bio || null })
    .eq("id", user.id);

  if (error) {
    return { error: "Couldn't save changes — try again." };
  }

  redirect(`/profile/${profile?.username}`);
}
