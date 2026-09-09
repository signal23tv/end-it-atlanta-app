"use server";

import { createClient } from "@/lib/supabase/server";
import { getBlockedUserIds } from "@/app/moderation/actions";

export type DiscoverResult = {
  id: string;
  username: string;
  display_name: string;
  avatar_url: string | null;
  bio: string | null;
  city: string | null;
  is_following: boolean;
};

/**
 * Real search over real profiles -- matches on username or display
 * name (case-insensitive, partial match). Excludes yourself and
 * anyone you've blocked. Capped at 20 results; empty/whitespace
 * queries return nothing rather than the whole user table.
 */
export async function searchProfiles(rawQuery: string): Promise<DiscoverResult[]> {
  const query = rawQuery.trim();
  if (!query) return [];

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const blockedIds = await getBlockedUserIds();

  const escaped = query.replace(/[%_]/g, (m) => `\\${m}`);
  let dbQuery = supabase
    .from("profiles")
    .select("id, username, display_name, avatar_url, bio, city")
    .or(`username.ilike.%${escaped}%,display_name.ilike.%${escaped}%`)
    .limit(20);

  if (user) dbQuery = dbQuery.neq("id", user.id);
  if (blockedIds.length > 0) {
    dbQuery = dbQuery.not("id", "in", `(${blockedIds.join(",")})`);
  }

  const { data, error } = await dbQuery;
  if (error || !data) return [];

  let followingIds = new Set<string>();
  if (user && data.length > 0) {
    const { data: myFollows } = await supabase
      .from("follows")
      .select("following_id")
      .eq("follower_id", user.id)
      .in(
        "following_id",
        data.map((p) => p.id)
      );
    followingIds = new Set((myFollows ?? []).map((f) => f.following_id));
  }

  return data.map((p) => ({
    ...p,
    is_following: followingIds.has(p.id),
  }));
}
