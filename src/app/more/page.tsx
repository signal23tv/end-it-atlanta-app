import Link from "next/link";
import Nav from "@/components/Nav";
import BottomNav from "@/components/BottomNav";
import { createClient } from "@/lib/supabase/server";
import { logout } from "@/app/login/actions";

const LINKS: { href: string; label: string; description: string }[] = [
  { href: "/profile", label: "My Profile", description: "View and edit your public profile" },
  { href: "/settings/profile", label: "Edit Profile", description: "Name, username, bio, photo" },
  { href: "/notifications", label: "Notifications", description: "Follows, likes, and comments on your posts" },
  { href: "/settings/notifications", label: "Notification Settings", description: "Push alerts and preferences" },
  { href: "/todd", label: "Todd the PrEP God", description: "Chat about PrEP, testing, and prevention" },
  { href: "/prep-basics", label: "PrEP Basics", description: "What PrEP is, how it works, and your options" },
  { href: "/get-connected", label: "Get Connected", description: "Find testing and PrEP resources near you" },
  { href: "/events", label: "Events", description: "Upcoming community events" },
  { href: "/programs", label: "Community Programs", description: "Where we show up across Atlanta" },
  { href: "/nut-juice", label: "Nut Juice", description: "Coming soon — join the waitlist" },
  { href: "/rewards", label: "Your Activity", description: "A real, honest count of your activity here" },
  { href: "/learning-lab", label: "Learning Lab", description: "HIV and PrEP education, sourced facts" },
  { href: "/about", label: "About / Mission", description: "Who we are and what we're working toward" },
  { href: "/help", label: "Emergency / Help", description: "Crisis and urgent-care resources, no login needed" },
  { href: "/privacy", label: "Privacy Notice", description: "How your data is used and protected" },
];

export default async function MorePage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  let username: string | null = null;
  let displayName: string | null = null;
  if (user) {
    const { data: profile } = await supabase
      .from("profiles")
      .select("username, display_name")
      .eq("id", user.id)
      .single();
    username = profile?.username ?? null;
    displayName = profile?.display_name ?? null;
  }

  return (
    <>
      <Nav />
      <main className="flex-1 bg-black text-paper pb-24">
        <div className="max-w-2xl mx-auto px-4 py-8">
          {displayName && (
            <div className="mb-6">
              <p className="text-xs text-muted uppercase tracking-wide">Signed in as</p>
              <p className="font-display text-2xl">{displayName}</p>
            </div>
          )}

          <div className="flex flex-col divide-y divide-black/10 rounded-xl border border-black/10 bg-white text-black overflow-hidden">
            {LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href === "/profile" && username ? `/profile/${username}` : link.href}
                className="flex flex-col px-4 py-3.5 hover:bg-black/[0.03]"
              >
                <span className="font-semibold text-sm">{link.label}</span>
                <span className="text-xs text-muted">{link.description}</span>
              </Link>
            ))}
          </div>

          <form action={logout} className="mt-6">
            <button
              type="submit"
              className="w-full border border-red text-red hover:bg-red hover:text-paper font-bold uppercase tracking-wide text-sm rounded-md py-3 transition-colors"
            >
              Log Out
            </button>
          </form>
        </div>
      </main>
      <BottomNav />
    </>
  );
}

