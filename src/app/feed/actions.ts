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
  const imageDataUrl = String(formData.get("image_data_url") || "").trim();

  if (!content && !imageDataUrl) {
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

  // Photo attach is optional -- a failed upload shouldn't block posting
  // the text, so this is best-effort, same pattern as the avatar upload.
  let imageUrl: string | null = null;
  if (imageDataUrl.startsWith("data:image/")) {
    try {
      const [meta, base64] = imageDataUrl.split(",");
      const contentType = meta.match(/data:(.*);base64/)?.[1] || "image/jpeg";
      const ext = contentType.split("/")[1] || "jpg";
      const bytes = Buffer.from(base64, "base64");
      const path = `${user.id}/${Date.now()}.${ext}`;

      const { error: uploadError } = await supabase.storage
        .from("post-images")
        .upload(path, bytes, { contentType, upsert: true });

      if (!uploadError) {
        const {
          data: { publicUrl },
        } = supabase.storage.from("post-images").getPublicUrl(path);
        imageUrl = publicUrl;
      }
    } catch {
      // Non-fatal -- post the text without the photo.
    }
  }

  const { error } = await supabase
    .from("posts")
    .insert({ author_id: user.id, content, image_url: imageUrl });

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

    // Notify the post's author -- but only on a new like, not an
    // unlike, and never notify someone about their own like.
    const { data: post } = await supabase
      .from("posts")
      .select("author_id")
      .eq("id", postId)
      .maybeSingle();
    if (post && post.author_id !== user.id) {
      await supabase.from("notifications").insert({
        user_id: post.author_id,
        actor_id: user.id,
        type: "like",
        post_id: postId,
      });
    }
  }

  revalidatePath("/feed");
  revalidatePath("/profile/[username]", "page");
}

export type CommentItem = {
  id: string;
  content: string;
  created_at: string;
  author: {
    username: string;
    display_name: string;
    avatar_url: string | null;
    avatar_color: string | null;
  } | null;
};

export async function getComments(postId: string): Promise<CommentItem[]> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("comments")
    .select(
      "id, content, created_at, author:profiles!comments_author_id_fkey(username, display_name, avatar_url, avatar_color)"
    )
    .eq("post_id", postId)
    .is("deleted_at", null)
    .order("created_at", { ascending: true });

  return (data as unknown as CommentItem[]) ?? [];
}

export type CommentState = { error?: string };

export async function addComment(
  postId: string,
  _prev: CommentState,
  formData: FormData
): Promise<CommentState> {
  const content = String(formData.get("content") || "").trim();
  if (!content) return { error: "Write something before commenting." };
  if (content.length > 1000) return { error: "Comments are limited to 1000 characters." };

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "You must be logged in to comment." };

  const { data: comment, error } = await supabase
    .from("comments")
    .insert({ post_id: postId, author_id: user.id, content })
    .select("id")
    .single();

  if (error) return { error: "Couldn't post that comment — try again." };

  const { data: post } = await supabase
    .from("posts")
    .select("author_id")
    .eq("id", postId)
    .maybeSingle();
  if (post && post.author_id !== user.id) {
    await supabase.from("notifications").insert({
      user_id: post.author_id,
      actor_id: user.id,
      type: "comment",
      post_id: postId,
      comment_id: comment?.id ?? null,
    });
  }

  revalidatePath("/feed");
  revalidatePath("/profile/[username]", "page");
  return {};
}
