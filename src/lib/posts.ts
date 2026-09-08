import { createClient } from "@/lib/supabase/server";
import type { Post } from "@/lib/types";

/**
 * Shared post-hydration: takes raw post rows (with author + embedded
 * count aggregates) and layers in "did the current user like this"
 * with a single extra query, since PostgREST can't express that in
 * one embedded select.
 */
async function hydratePosts(
  supabase: Awaited<ReturnType<typeof createClient>>,
  rawPosts: Array<{
    id: string;
    author_id: string;
    content: string;
    image_url: string | null;
    created_at: string;
    author: {
      id: string;
      username: string;
      display_name: string;
      avatar_url: string | null;
    } | null;
    likes: { count: number }[];
    comments: { count: number }[];
  }>
): Promise<Post[]> {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  let likedPostIds = new Set<string>();
  if (user && rawPosts.length > 0) {
    const { data: myLikes } = await supabase
      .from("likes")
      .select("post_id")
      .eq("user_id", user.id)
      .in(
        "post_id",
        rawPosts.map((p) => p.id)
      );
    likedPostIds = new Set((myLikes ?? []).map((l) => l.post_id));
  }

  return rawPosts
    .filter((p) => p.author !== null)
    .map((p) => ({
      id: p.id,
      author_id: p.author_id,
      content: p.content,
      image_url: p.image_url,
      created_at: p.created_at,
      author: p.author!,
      like_count: p.likes?.[0]?.count ?? 0,
      comment_count: p.comments?.[0]?.count ?? 0,
      liked_by_me: likedPostIds.has(p.id),
    }));
}

const POST_SELECT =
  "id, author_id, content, image_url, created_at, author:profiles!posts_author_id_fkey(id, username, display_name, avatar_url), likes(count), comments(count)";

export async function getFeedPosts(limit = 50): Promise<Post[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("posts")
    .select(POST_SELECT)
    .is("deleted_at", null)
    .order("created_at", { ascending: false })
    .limit(limit);

  if (error || !data) return [];
  return hydratePosts(supabase, data as never);
}

export async function getPostsByAuthor(
  authorId: string,
  limit = 50
): Promise<Post[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("posts")
    .select(POST_SELECT)
    .eq("author_id", authorId)
    .is("deleted_at", null)
    .order("created_at", { ascending: false })
    .limit(limit);

  if (error || !data) return [];
  return hydratePosts(supabase, data as never);
}
