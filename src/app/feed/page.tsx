import Link from "next/link";
import Nav from "@/components/Nav";
import BottomNav from "@/components/BottomNav";
import ToddLauncher from "@/components/ToddLauncher";
import PostComposer from "@/components/PostComposer";
import PostCard from "@/components/PostCard";
import { getFeedPosts } from "@/lib/posts";
import { createClient } from "@/lib/supabase/server";

const ASSET = "/assets/endit/v1";

const QUICK_ACTIONS: {
  href: string;
  label: string;
  sub: string;
  tone: "blue" | "pink" | "green" | "purple";
  icon: string;
}[] = [
  {
    href: "/get-connected?service=prep",
    label: "Find PrEP",
    sub: "Learn. Start. Protect.",
    tone: "blue",
    icon: `${ASSET}/icons/pill.svg`,
  },
  {
    href: "/get-connected?service=testing",
    label: "Get Tested",
    sub: "Know your status.",
    tone: "pink",
    icon: `${ASSET}/icons/science.svg`,
  },
  {
    href: "/get-connected",
    label: "Find a Clinic",
    sub: "Care is closer than you think.",
    tone: "green",
    icon: `${ASSET}/icons/location.svg`,
  },
  {
    href: "/events",
    label: "Events",
    sub: "What's happening.",
    tone: "purple",
    icon: `${ASSET}/icons/calendar.svg`,
  },
];

export default async function FeedPage() {
  const supabase = await createClient();
  const [
    posts,
    {
      data: { user },
    },
  ] = await Promise.all([getFeedPosts(), supabase.auth.getUser()]);

  let firstName = "";
  if (user) {
    const { data: profile } = await supabase
      .from("profiles")
      .select("display_name")
      .eq("id", user.id)
      .maybeSingle();
    firstName = profile?.display_name?.split(" ")[0] ?? "";
  }

  return (
    <>
      <Nav />
      <main className="eit-app flex-1 pb-24">
        <div className="eit-shell flex flex-col gap-2">
          <section className="eit-hero">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={`${ASSET}/backgrounds/atlanta-skyline-strip.webp`}
              alt=""
              className="eit-hero-scene"
            />
            <div className="eit-hero-content">
              <p className="eit-kicker">Test. Prevent. Treat. Connect.</p>
              <h2>{firstName ? `Hey there, ${firstName}.` : "Hey there."}</h2>
              <p className="eit-muted text-sm">
                Let&apos;s make a healthier, stronger Atlanta together.
              </p>
            </div>
          </section>

          <div className="eit-section">
            <div className="eit-grid">
              {QUICK_ACTIONS.map((action) => (
                <Link
                  key={action.label}
                  href={action.href}
                  className="eit-action-card"
                  data-tone={action.tone}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={action.icon} alt="" className="eit-icon" width={22} height={22} />
                  <div>
                    <strong>{action.label}</strong>
                    <span>{action.sub}</span>
                  </div>
                </Link>
              ))}
            </div>
          </div>

          <Link href="/todd" className="eit-card eit-todd-card eit-section">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={`${ASSET}/todd/todd-avatar.webp`}
              alt="Todd the PrEP God"
              className="eit-avatar"
            />
            <div>
              <h3>Todd the PrEP God</h3>
              <p className="eit-muted">
                Your 24/7 sexual health assistant. Ask him anything.
              </p>
            </div>
          </Link>

          <div className="eit-section">
            <div className="eit-section-heading">
              <h2 style={{ fontSize: "1.3rem" }}>Community</h2>
            </div>
            <div className="flex flex-col gap-4">
              <PostComposer />

              {posts.length === 0 ? (
                <div className="eit-card eit-empty">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={`${ASSET}/empty-states/messages.svg`} alt="" />
                  <p>No posts yet — be the first to share something.</p>
                </div>
              ) : (
                posts.map((post) => <PostCard key={post.id} post={post} />)
              )}
            </div>
          </div>
        </div>
      </main>
      <ToddLauncher />
      <BottomNav />
    </>
  );
}
