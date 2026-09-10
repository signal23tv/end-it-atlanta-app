import Link from "next/link";
import Nav from "@/components/Nav";
import BottomNav from "@/components/BottomNav";
import ToddLauncher from "@/components/ToddLauncher";
import PostComposer from "@/components/PostComposer";
import PostCard from "@/components/PostCard";
import ImageBackdrop from "@/components/ImageBackdrop";
import QuickActionTile from "@/components/QuickActionTile";
import HomeHero from "@/components/HomeHero";
import FeedEmptyState from "@/components/FeedEmptyState";
import { getFeedPosts } from "@/lib/posts";
import { createClient } from "@/lib/supabase/server";
import { EVENTS } from "@/lib/events-data";

const ASSET = "/assets/endit/v1";

const TILES = `${ASSET}/home/tiles`;

const QUICK_ACTIONS: {
  href: string;
  label: string;
  sub: string;
  tone: "blue" | "pink" | "green" | "purple";
  icon: string;
  image: string;
}[] = [
  {
    href: "/get-connected?service=prep",
    label: "Find PrEP",
    sub: "Learn. Start. Protect.",
    tone: "blue",
    icon: `${ASSET}/icons/pill.svg`,
    image: `${TILES}/find-prep.webp`,
  },
  {
    href: "/get-connected?service=testing",
    label: "Get Tested",
    sub: "Know your status.",
    tone: "pink",
    icon: `${ASSET}/icons/science.svg`,
    image: `${TILES}/get-tested.webp`,
  },
  {
    href: "/get-connected",
    label: "Find a Clinic",
    sub: "Care is closer than you think.",
    tone: "green",
    icon: `${ASSET}/icons/location.svg`,
    image: `${TILES}/find-a-clinic.webp`,
  },
  {
    href: "/todd",
    label: "Ask Todd",
    sub: "Real answers, no judgment.",
    tone: "purple",
    icon: `${ASSET}/icons/chat.svg`,
    image: `${TILES}/ask-todd.webp`,
  },
  {
    href: "/watch",
    label: "PrEP TV",
    sub: "Educate. Entertain. Empower.",
    tone: "blue",
    icon: `${ASSET}/icons/watch.svg`,
    image: `${TILES}/prep-tv.webp`,
  },
  {
    href: "/events",
    label: "Events",
    sub: "What's happening.",
    tone: "pink",
    icon: `${ASSET}/icons/calendar.svg`,
    image: `${TILES}/events.webp`,
  },
  {
    href: "/discover?tab=community",
    label: "Community",
    sub: "See who's here.",
    tone: "green",
    icon: `${ASSET}/icons/users.svg`,
    image: `${TILES}/community.webp`,
  },
  {
    href: "/my-health",
    label: "My Health",
    sub: "Private, just for you.",
    tone: "purple",
    icon: `${ASSET}/icons/heart.svg`,
    image: `${TILES}/my-health.webp`,
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
          <HomeHero firstName={firstName} />

          <div className="eit-section">
            <div className="eit-grid">
              {QUICK_ACTIONS.map((action) => (
                <QuickActionTile
                  key={action.label}
                  href={action.href}
                  label={action.label}
                  sub={action.sub}
                  tone={action.tone}
                  icon={action.icon}
                  image={action.image}
                />
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
                className="rounded-2xl overflow-hidden border border-[#304055] bg-[#101A28] flex gap-3 shadow-lg shadow-black/30 hover:border-gold transition-colors"
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
              <ImageBackdrop
                realSrc={`${ASSET}/home/coming_for_you_events_state.webp`}
                fallbackSrc={`${ASSET}/backgrounds/atmosphere-pink.svg`}
                scrim="transparent"
                className="rounded-2xl min-h-[150px] flex items-center px-5 py-5 shadow-lg shadow-black/30"
              >
                <div className="flex flex-col gap-3 max-w-[75%] sm:max-w-[60%]">
                  <p className="text-sm text-[#F7FAFF] font-medium">
                    No upcoming events right now. Check back for new dates.
                  </p>
                  <div className="flex flex-wrap gap-2">
                    <Link
                      href="/events"
                      className="inline-flex items-center gap-1.5 rounded-full border border-white/30 text-[#F7FAFF] text-xs font-bold uppercase tracking-wide px-4 py-2 hover:bg-white/10 transition-colors"
                    >
                      Browse Events
                    </Link>
                    <Link
                      href="/discover?tab=community"
                      className="inline-flex items-center gap-1.5 rounded-full border border-white/30 text-[#F7FAFF] text-xs font-bold uppercase tracking-wide px-4 py-2 hover:bg-white/10 transition-colors"
                    >
                      Explore Community
                    </Link>
                  </div>
                </div>
              </ImageBackdrop>
            )}
          </div>

          <div className="eit-section">
            <div className="eit-section-heading">
              <h2 style={{ fontSize: "1.3rem" }}>Community</h2>
            </div>
            <div className="flex flex-col gap-4">
              <PostComposer />

              {posts.length === 0 ? (
                <ImageBackdrop
                  realSrc={`${ASSET}/home/community_feed_placeholder.webp`}
                  fallbackSrc={`${ASSET}/backgrounds/crown-graffiti.webp`}
                  scrim="linear-gradient(90deg, rgb(6 11 19 / .55) 0%, rgb(6 11 19 / .25) 60%)"
                  className="rounded-2xl min-h-[150px] flex items-center px-5 py-5 shadow-lg shadow-black/30"
                >
                  <FeedEmptyState />
                </ImageBackdrop>
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
