import Link from "next/link";
import Nav from "@/components/Nav";
import BottomNav from "@/components/BottomNav";
import ToddLauncher from "@/components/ToddLauncher";
import PostComposer from "@/components/PostComposer";
import PostCard from "@/components/PostCard";
import HomeSearchBar from "@/components/HomeSearchBar";
import { getFeedPosts } from "@/lib/posts";
import { createClient } from "@/lib/supabase/server";
import { EVENTS } from "@/lib/events-data";

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
    href: "/todd",
    label: "Ask Todd",
    sub: "Real answers, no judgment.",
    tone: "purple",
    icon: `${ASSET}/icons/chat.svg`,
  },
  {
    href: "/watch",
    label: "PrEP TV",
    sub: "Educate. Entertain. Empower.",
    tone: "blue",
    icon: `${ASSET}/icons/watch.svg`,
  },
  {
    href: "/events",
    label: "Events",
    sub: "What's happening.",
    tone: "pink",
    icon: `${ASSET}/icons/calendar.svg`,
  },
  {
    href: "/discover?tab=community",
    label: "Community",
    sub: "See who's here.",
    tone: "green",
    icon: `${ASSET}/icons/users.svg`,
  },
  {
    href: "/my-health",
    label: "My Health",
    sub: "Private, just for you.",
    tone: "purple",
    icon: `${ASSET}/icons/heart.svg`,
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

  const now = Date.now();
  const nextEvent = EVENTS.filter((e) => new Date(e.dateISO).getTime() >= now).sort(
    (a, b) => new Date(a.dateISO).getTime() - new Date(b.dateISO).getTime()
  )[0];

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
            <div className="eit-hero-content flex flex-col gap-3">
              <div>
                <p className="eit-kicker">Test. Prevent. Treat. Connect.</p>
                <h2>{firstName ? `Hey there, ${firstName}.` : "Hey there."}</h2>
                <p className="eit-muted text-sm">
                  Let&apos;s make a healthier, stronger Atlanta together.
                </p>
              </div>
              <HomeSearchBar />
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

          <div className="eit-section">
            <div className="eit-section-heading">
              <h2 style={{ fontSize: "1.1rem" }}>Coming for you</h2>
            </div>
            {nextEvent ? (
              <Link
                href="/events"
                className="rounded-xl overflow-hidden border border-[#304055] bg-[#101A28] flex gap-3"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={nextEvent.imageSrc}
                  alt={nextEvent.imageAlt}
                  className="w-24 h-24 object-cover shrink-0"
                />
                <div className="py-3 pr-3">
                  <p className="font-display text-lg leading-tight">{nextEvent.title}</p>
                  <p className="text-xs text-[#B3C2D4] mt-1">
                    {nextEvent.dateLabel} · {nextEvent.timeLabel}
                  </p>
                  <p className="text-xs text-[#B3C2D4]">{nextEvent.locationLine}</p>
                </div>
              </Link>
            ) : (
              <div className="eit-card eit-empty">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={`${ASSET}/empty-states/events.svg`} alt="" />
                <p>No upcoming events on the calendar right now -- check back soon.</p>
              </div>
            )}
          </div>

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
