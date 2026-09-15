import { notFound } from "next/navigation";
import Link from "next/link";
import Nav from "@/components/Nav";
import BottomNav from "@/components/BottomNav";
import ToddLauncher from "@/components/ToddLauncher";
import ProfileTabs from "@/components/ProfileTabs";
import FollowButton from "@/components/FollowButton";
import MessageButton from "@/components/MessageButton";
import BlockButton from "@/components/BlockButton";
import ReportButton from "@/components/ReportButton";
import Avatar from "@/components/Avatar";
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
    .select("id, username, display_name, avatar_url, avatar_color, bio, city, created_at")
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
  let isBlocked = false;
  const isOwnProfile = user?.id === profile.id;
  if (user && !isOwnProfile) {
    const [{ data: existingFollow }, { data: existingBlock }] = await Promise.all([
      supabase
        .from("follows")
        .select("follower_id")
        .eq("follower_id", user.id)
        .eq("following_id", profile.id)
        .maybeSingle(),
      supabase
        .from("blocks")
        .select("id")
        .eq("blocker_id", user.id)
        .eq("blocked_id", profile.id)
        .maybeSingle(),
    ]);
    isFollowing = Boolean(existingFollow);
    isBlocked = Boolean(existingBlock);
  }

  const joinedLabel = profile.created_at
    ? new Date(profile.created_at).toLocaleDateString(undefined, {
        month: "long",
        year: "numeric",
      })
    : null;

  return (
    <>
      <Nav />
      <main className="eit-app flex-1 pb-24">
        <div className="eit-shell flex flex-col gap-4">
          <section className="rounded-xl overflow-hidden border border-[#304055] bg-[#101A28]">
            <div
              className="h-28"
              style={{
                backgroundImage:
                  "linear-gradient(180deg, rgb(6 11 19 / .35), rgb(6 11 19 / .9)), url(/assets/endit/v1/backgrounds/atmosphere-blue.svg)",
                backgroundSize: "cover",
                backgroundPosition: "center",
              }}
            />
            <div className="px-5 pb-5 -mt-10 flex flex-col gap-3">
              <div className="flex items-end justify-between gap-4">
                <div className="relative shrink-0">
                  {isOwnProfile ? (
                    <Link
                      href="/settings/profile"
                      aria-label="Change your photo"
                      className="group relative block rounded-full"
                    >
                      <Avatar
                        src={profile.avatar_url}
                        color={profile.avatar_color}
                        name={profile.display_name || profile.username}
                        size={80}
                        className="border-4 border-[#101A28]"
                      />
                      {/* Whole photo is tappable -- this overlay is just a
                          visible hint, not the only way in (the tiny
                          corner-badge-only version was easy to miss). */}
                      <span className="absolute inset-0 rounded-full bg-black/0 group-hover:bg-black/40 transition-colors flex items-center justify-center">
                        <span className="opacity-0 group-hover:opacity-100 text-[#F7FAFF] text-[10px] font-bold uppercase tracking-wide transition-opacity">
                          Edit
                        </span>
                      </span>
                      <span className="absolute -bottom-1 -right-1 w-8 h-8 rounded-full bg-gold border-2 border-[#101A28] flex items-center justify-center shadow">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src="/assets/endit/v1/icons/camera.svg"
                          alt=""
                          width={16}
                          height={16}
                          style={{ filter: "brightness(0)" }}
                        />
                      </span>
                    </Link>
                  ) : (
                    <Avatar
                      src={profile.avatar_url}
                      color={profile.avatar_color}
                      name={profile.display_name || profile.username}
                      size={80}
                      className="border-4 border-[#101A28]"
                    />
                  )}
                </div>
                {user && !isOwnProfile && (
                  <div className="flex flex-col items-end gap-1.5 pb-1">
                    <div className="flex items-center gap-2">
                      <FollowButton
                        targetUserId={profile.id}
                        username={profile.username}
                        initiallyFollowing={isFollowing}
                      />
                      {!isBlocked && <MessageButton targetUserId={profile.id} />}
                    </div>
                    <div className="flex items-center gap-3">
                      <ReportButton target={{ userId: profile.id }} label="Report user" />
                      <BlockButton targetUserId={profile.id} initiallyBlocked={isBlocked} />
                    </div>
                  </div>
                )}
                {isOwnProfile && (
                  <Link
                    href="/settings/profile"
                    className="border border-[#304055] hover:border-gold text-[#F7FAFF] font-bold uppercase tracking-wide text-sm rounded-md px-5 py-2 transition-colors mb-1"
                  >
                    Edit profile
                  </Link>
                )}
              </div>

              <div>
                <h1 className="text-3xl text-[#F7FAFF]">{profile.display_name}</h1>
                <p className="text-[#B3C2D4]">@{profile.username}</p>
              </div>

              <div className="flex gap-4 text-sm">
                <span className="text-[#F7FAFF]">
                  <strong>{followerCount ?? 0}</strong>{" "}
                  <span className="text-[#98ADC7]">followers</span>
                </span>
                <span className="text-[#F7FAFF]">
                  <strong>{followingCount ?? 0}</strong>{" "}
                  <span className="text-[#98ADC7]">following</span>
                </span>
              </div>
            </div>
          </section>

          <ProfileTabs
            bio={profile.bio}
            city={profile.city}
            joinedLabel={joinedLabel}
            posts={posts}
            isOwnProfile={isOwnProfile}
          />
        </div>
      </main>
      <ToddLauncher />
      <BottomNav />
    </>
  );
}
