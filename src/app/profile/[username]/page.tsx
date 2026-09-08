import { notFound } from "next/navigation";
import Link from "next/link";
import Nav from "@/components/Nav";
import BottomNav from "@/components/BottomNav";
import ToddLauncher from "@/components/ToddLauncher";
import PostCard from "@/components/PostCard";
import FollowButton from "@/components/FollowButton";
import { createClient } from "@/lib/supabase/server";
import { getPostsByAuthor } from "@/lib/posts";

export default async function ProfilePage({
  params,
}: {
  params: Promise<{ username: string }>;
}) {
  const { username } = await params;
  const supabase = await createClient();

  const { data: profile } = await supabase
    .from("profiles")
    .select("id, username, display_name, avatar_url, bio, city, created_at")
    .eq("username", username)
    .single();

  if (!profile) notFound();

  const [{ count: followerCount }, { count: followingCount }, posts] =
    await Promise.all([
      supabase
        .from("follows")
        .select("*", { count: "exact", head: true })
        .eq("following_id", profile.id),
      supabase
        .from("follows")
        .select("*", { count: "exact", head: true })
        .eq("follower_id", profile.id),
      getPostsByAuthor(profile.id),
    ]);

  const {
    data: { user },
  } = await supabase.auth.getUser();

  let isFollowing = false;
  const isOwnProfile = user?.id === profile.id;
  if (user && !isOwnProfile) {
    const { data: existingFollow } = await supabase
      .from("follows")
      .select("follower_id")
      .eq("follower_id", user.id)
      .eq("following_id", profile.id)
      .maybeSingle();
    isFollowing = Boolean(existingFollow);
  }

  return (
    <>
      <Nav />
      <main className="flex-1 bg-black text-paper pb-24">
        <div className="max-w-2xl mx-auto px-4 py-6 flex flex-col gap-4">
          <section className="bg-white text-black border border-black/10 rounded-xl p-6 flex flex-col gap-2">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h1 className="text-4xl">{profile.display_name}</h1>
                <p className="text-muted">@{profile.username}</p>
              </div>
              {user && !isOwnProfile && (
                <FollowButton
                  targetUserId={profile.id}
                  username={profile.username}
                  initiallyFollowing={isFollowing}
                />
              )}
              {isOwnProfile && (
                <Link
                  href="/settings/profile"
                  className="border border-black/20 hover:border-gold font-bold uppercase tracking-wide text-sm rounded-md px-5 py-2 transition-colors"
                >
                  Edit profile
                </Link>
              )}
            </div>

            {profile.bio && <p>{profile.bio}</p>}

            <div className="flex gap-4 text-sm mt-1">
              <span>
                <strong>{followerCount ?? 0}</strong>{" "}
                <span className="text-muted">followers</span>
              </span>
              <span>
                <strong>{followingCount ?? 0}</strong>{" "}
                <span className="text-muted">following</span>
              </span>
              <span className="text-muted">{profile.city}</span>
            </div>
          </section>

          {posts.length === 0 ? (
            <p className="text-muted text-center py-12">No posts yet.</p>
          ) : (
            posts.map((post) => <PostCard key={post.id} post={post} />)
          )}
        </div>
      </main>
      <ToddLauncher />
      <BottomNav />
    </>
  );
}
