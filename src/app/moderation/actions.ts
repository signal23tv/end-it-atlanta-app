"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

export type ReportReason =
  | "spam"
  | "harassment"
  | "misinformation"
  | "explicit_content"
  | "other";

export type ReportTarget =
  | { postId: string }
  | { commentId: string }
  | { userId: string };

export type ReportState = { error?: string; success?: boolean };

/**
 * Files a real report row -- not a fake "thanks, we'll look into it"
 * toast with nothing behind it. Honest caveat (see
 * IMPLEMENTATION_STATUS.md): there is no in-app staff review queue
 * yet, so reports currently need to be reviewed directly in the
 * Supabase dashboard until that's built.
 */
export async function reportContent(
  target: ReportTarget,
  reason: ReportReason,
  details: string
): Promise<ReportState> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "You must be logged in to report something." };

  const { error } = await supabase.from("reports").insert({
    reporter_id: user.id,
    post_id: "postId" in target ? target.postId : null,
    comment_id: "commentId" in target ? target.commentId : null,
    reported_user_id: "userId" in target ? target.userId : null,
    reason,
    details: details.trim() || null,
  });

  if (error) return { error: "Couldn't file that report — try again." };
  return { success: true };
}

export async function toggleBlock(targetUserId: string, currentlyBlocked: boolean) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user || user.id === targetUserId) return;

  if (currentlyBlocked) {
    await supabase
      .from("blocks")
      .delete()
      .eq("blocker_id", user.id)
      .eq("blocked_id", targetUserId);
  } else {
    await supabase
      .from("blocks")
      .insert({ blocker_id: user.id, blocked_id: targetUserId });
    // Blocking someone also stops the one-way follow relationship in
    // either direction, so they immediately drop out of each other's
    // follow-based surfaces, not just the feed.
    await supabase
      .from("follows")
      .delete()
      .or(
        `and(follower_id.eq.${user.id},following_id.eq.${targetUserId}),and(follower_id.eq.${targetUserId},following_id.eq.${user.id})`
      );
  }

  revalidatePath("/feed");
  revalidatePath("/profile/[username]", "page");
}

export async function getBlockedUserIds(): Promise<string[]> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return [];

  const { data } = await supabase
    .from("blocks")
    .select("blocked_id")
    .eq("blocker_id", user.id);

  return (data ?? []).map((b) => b.blocked_id);
}
