import Link from "next/link";
import Nav from "@/components/Nav";
import BottomNav from "@/components/BottomNav";
import PostComposer from "@/components/PostComposer";
import PostCard from "@/components/PostCard";
import { getFeedPosts } from "@/lib/posts";
import { createClient } from "@/lib/supabase/server";

const QUICK_ACTIONS: {
  href: string;
  label: string;
  sub: string;
  accent: string;
  icon: React.ReactNode;
}[] = [
  {
    href: "/get-connected?service=prep",
    label: "Find PrEP",
    sub: "Learn. Start. Protect.",
    accent: "bg-blue-500/15 text-blue-300 border-blue-500/30",
    icon: (
      <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth={2}>
        <circle cx="12" cy="12" r="9" />
        <path d="M12 7v5l3 3" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    href: "/get-connected?service=testing",
    label: "Get Tested",
    sub: "Know your status.",
    accent: "bg-red/15 text-red-300 border-red/30",
    icon: (
      <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth={2}>
        <path d="M9 3h6M10 3v6.5L5.5 17a2 2 0 0 0 1.7 3h9.6a2 2 0 0 0 1.7-3L14 9.5V3" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    href: "/get-connected",
    label: "Find a Clinic",
    sub: "Care is closer than you think.",
    accent: "bg-emerald-500/15 text-emerald-300 border-emerald-500/30",
    icon: (
      <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth={2}>
        <path d="M12 21s7-6.2 7-11.5A7 7 0 0 0 5 9.5C5 14.8 12 21 12 21Z" strokeLinejoin="round" />
        <circle cx="12" cy="9.5" r="2.3" />
      </svg>
    ),
  },
  {
    href: "/#events",
    label: "Events",
    sub: "What's happening.",
    accent: "bg-purple-500/15 text-purple-300 border-purple-500/30",
    icon: (
      <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth={2}>
        <rect x="3.5" y="5" width="17" height="16" rx="2" />
        <path d="M3.5 10h17M8 3v4M16 3v4" strokeLinecap="round" />
      </svg>
    ),
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
      <main className="flex-1 bg-black text-paper pb-24">
        <div className="max-w-2xl mx-auto px-4 py-6 flex flex-col gap-4">
          <div>
            <h1 className="font-display text-3xl">
              {firstName ? `Hey there, ${firstName}.` : "Hey there."}
            </h1>
            <p className="text-muted text-sm">
              Let&apos;s make a healthier, stronger Atlanta together. 💛
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3">
            {QUICK_ACTIONS.map((action) => (
              <Link
                key={action.label}
                href={action.href}
                className={`flex flex-col gap-2 rounded-xl border p-4 hover:brightness-110 transition ${action.accent}`}
              >
                {action.icon}
                <div>
                  <p className="font-bold text-sm text-paper">{action.label}</p>
                  <p className="text-xs text-paper/60">{action.sub}</p>
                </div>
              </Link>
            ))}
          </div>

          <div className="border-t border-white/10 pt-4 mt-1 flex flex-col gap-4">
            <h2 className="font-display text-xl">Community</h2>
            <PostComposer />

            {posts.length === 0 ? (
              <p className="text-muted text-center py-12">
                No posts yet — be the first to share something.
              </p>
            ) : (
              posts.map((post) => <PostCard key={post.id} post={post} />)
            )}
          </div>
        </div>
      </main>
      <BottomNav />
    </>
  );
}
