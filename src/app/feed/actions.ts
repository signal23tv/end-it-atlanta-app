"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

export type PostState = {
  error?: string;
};

export async function createPost(
  _prevState: PostState,
  formData: FormData
): Promise<PostState> {
  const content = String(formData.get("content") || "").trim();

  if (!content) {
    return { error: "Write something before posting." };
  }
  if (content.length > 2000) {
    return { error: "Posts are limited to 2000 characters." };
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "You must be logged in to post." };
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("id")
    .eq("id", user.id)
    .maybeSingle();

  if (!profile) {
    return {
      error:
        "Your account is missing a profile, so posts can't be linked to you yet. This can happen on older test accounts — contact the site owner to get it fixed.",
    };
  }

  const { error } = await supabase
    .from("posts")
    .insert({ author_id: user.id, content });

  if (error) {
    return { error: "Couldn't post that — try again." };
  }

  revalidatePath("/feed");
  return {};
}

export async function toggleLike(postId: string, currentlyLiked: boolean) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return;

  if (currentlyLiked) {
    await supabase
      .from("likes")
      .delete()
      .eq("post_id", postId)
      .eq("user_id", user.id);
  } else {
    await supabase.from("likes").insert({ post_id: postId, user_id: user.id });
  }

  revalidatePath("/feed");
  revalidatePath("/profile/[username]", "page");
}
