"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export type ProfileEditState = {
  error?: string;
};

const AVATAR_COLORS = ["red", "gold", "blue", "purple", "cyan"] as const;

export async function updateProfile(
  _prevState: ProfileEditState,
  formData: FormData
): Promise<ProfileEditState> {
  const displayName = String(formData.get("display_name") || "").trim();
  const bio = String(formData.get("bio") || "").trim();
  const avatarColor = String(formData.get("avatar_color") || "gold");
  const avatarDataUrl = String(formData.get("avatar_data_url") || "").trim();
  const removePhoto = String(formData.get("remove_avatar_photo") || "") === "1";

  if (!displayName) {
    return { error: "Display name can't be empty." };
  }
  if (bio.length > 280) {
    return { error: "Bio must be 280 characters or fewer." };
  }
  if (!(AVATAR_COLORS as readonly string[]).includes(avatarColor)) {
    return { error: "Invalid avatar color." };
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

  const updates: Record<string, string | null> = {
    display_name: displayName,
    bio: bio || null,
    avatar_color: avatarColor,
  };

  if (avatarDataUrl.startsWith("data:image/")) {
    const match = avatarDataUrl.match(/^data:(image\/\w+);base64,(.+)$/);
    if (!match) {
      return { error: "Couldn't process that photo — try again." };
    }
    const [, contentType, base64] = match;
    const ext = contentType === "image/png" ? "png" : "jpg";
    const path = `${user.id}/avatar.${ext}`;
    const bytes = Buffer.from(base64, "base64");
    const { error: uploadError } = await supabase.storage
      .from("avatars")
      .upload(path, bytes, { contentType, upsert: true });
    if (uploadError) {
      return { error: "Couldn't upload that photo — try again." };
    }
    const {
      data: { publicUrl },
    } = supabase.storage.from("avatars").getPublicUrl(path);
    updates.avatar_url = `${publicUrl}?v=${Date.now()}`;
  } else if (removePhoto) {
    updates.avatar_url = null;
  }

  const { error } = await supabase
    .from("profiles")
    .update(updates)
    .eq("id", user.id);

  if (error) {
    return { error: "Couldn't save changes — try again." };
  }

  redirect(`/profile/${profile?.username}`);
}
