import Nav from "@/components/Nav";
import BottomNav from "@/components/BottomNav";
import ToddLauncher from "@/components/ToddLauncher";
import { createClient } from "@/lib/supabase/server";

const WEIGHTS = {
  posts: 10,
  comments: 5,
  likesGiven: 1,
  followers: 5,
} as const;

export default async function RewardsPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  let counts = { posts: 0, comments: 0, likesGiven: 0, followers: 0 };

  if (user) {
    const [postsRes, commentsRes, likesRes, followersRes] = await Promise.all([
      supabase.from("posts").select("*", { count: "exact", head: true }).eq("author_id", user.id).is("deleted_at", null),
      supabase.from("comments").select("*", { count: "exact", head: true }).eq("author_id", user.id).is("deleted_at", null),
      supabase.from("likes").select("*", { count: "exact", head: true }).eq("user_id", user.id),
      supabase.from("follows").select("*", { count: "exact", head: true }).eq("following_id", user.id),
    ]);
    counts = {
      posts: postsRes.count ?? 0,
      comments: commentsRes.count ?? 0,
      likesGiven: likesRes.count ?? 0,
      followers: followersRes.count ?? 0,
    };
  }

  const total =
    counts.posts * WEIGHTS.posts +
    counts.comments * WEIGHTS.comments +
    counts.likesGiven * WEIGHTS.likesGiven +
    counts.followers * WEIGHTS.followers;

  const ROWS: { label: string; count: number; each: number }[] = [
    { label: "Posts shared", count: counts.posts, each: WEIGHTS.posts },
    { label: "Comments left", count: counts.comments, each: WEIGHTS.comments },
    { label: "Posts you've liked", count: counts.likesGiven, each: WEIGHTS.likesGiven },
    { label: "People following you", count: counts.followers, each: WEIGHTS.followers },
  ];

  return (
    <>
      <Nav />
      <main className="eit-app flex-1 pb-24">
        <div className="eit-shell flex flex-col gap-6">
          <div
            className="rounded-2xl p-5"
            style={{
              backgroundImage:
                "linear-gradient(180deg, rgb(6 11 19 / .55), rgb(6 11 19 / .92)), url(/assets/endit/v1/backgrounds/atmosphere-gold.svg)",
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          >
            <h1 className="text-3xl" style={{ fontFamily: "var(--eit-font-display)" }}>
              Your Activity
            </h1>
            <p className="text-sm eit-muted mt-1">Get involved. See your impact.</p>
          </div>

          <div className="rounded-xl border border-gold bg-gold/10 p-6 text-center flex flex-col items-center gap-2">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/assets/endit/v1/icons/trophy.svg" alt="" width={28} height={28} />
            <span className="text-5xl font-display text-gold">{total}</span>
            <span className="text-xs uppercase tracking-wide eit-muted">
              Activity points, calculated from what you've actually done here
            </span>
          </div>

          <div className="rounded-lg border border-white/10 bg-white/5 p-4 text-sm text-paper/80">
            This is a real, honest count of your activity on the platform -- not a redeemable
            currency or gift-card balance. We haven't built a rewards-redemption system yet, so
            nothing here can be cashed in. Think of it as a scoreboard for how involved you've
            been.
          </div>

          <div className="flex flex-col divide-y divide-white/10 rounded-xl border border-white/10 overflow-hidden">
            {ROWS.map((r) => (
              <div key={r.label} className="flex items-center justify-between px-4 py-3.5">
                <div>
                  <p className="font-semibold text-sm">{r.label}</p>
                  <p className="text-xs text-muted">
                    {r.count} × {r.each} pt{r.each !== 1 ? "s" : ""}
                  </p>
                </div>
                <span className="font-display text-xl text-gold">{r.count * r.each}</span>
              </div>
            ))}
          </div>
        </div>
      </main>
      <ToddLauncher />
      <BottomNav />
    </>
  );
}
