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

type RawProfile = {
  id: string;
  username: string;
  display_name: string;
  avatar_url: string | null;
  bio: string | null;
  city: string | null;
};

async function hydrateFollowing(
  supabase: Awaited<ReturnType<typeof createClient>>,
  userId: string | undefined,
  rows: RawProfile[]
): Promise<DiscoverResult[]> {
  let followingIds = new Set<string>();
  if (userId && rows.length > 0) {
    const { data: myFollows } = await supabase
      .from("follows")
      .select("following_id")
      .eq("follower_id", userId)
      .in(
        "following_id",
        rows.map((p) => p.id)
      );
    followingIds = new Set((myFollows ?? []).map((f) => f.following_id));
  }
  return rows.map((p) => ({ ...p, is_following: followingIds.has(p.id) }));
}

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
  return hydrateFollowing(supabase, user?.id, data);
}

/**
 * Real members to browse with no search term typed yet -- most
 * recently joined, real accounts only (no fabricated "suggested for
 * you" ranking). Same blocked/self exclusions as search.
 */
export async function listRecentProfiles(): Promise<DiscoverResult[]> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const blockedIds = await getBlockedUserIds();

  let dbQuery = supabase
    .from("profiles")
    .select("id, username, display_name, avatar_url, bio, city")
    .order("created_at", { ascending: false })
    .limit(12);

  if (user) dbQuery = dbQuery.neq("id", user.id);
  if (blockedIds.length > 0) {
    dbQuery = dbQuery.not("id", "in", `(${blockedIds.join(",")})`);
  }

  const { data, error } = await dbQuery;
  if (error || !data) return [];
  return hydrateFollowing(supabase, user?.id, data);
}
