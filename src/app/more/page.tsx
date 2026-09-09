import Link from "next/link";
import Nav from "@/components/Nav";
import BottomNav from "@/components/BottomNav";
import { createClient } from "@/lib/supabase/server";
import { logout } from "@/app/login/actions";

const ICON = "/assets/endit/v1/icons";

type MenuLink = { href: string; label: string; description: string; icon: string };

const GROUPS: { title: string; links: MenuLink[] }[] = [
  {
    title: "Account",
    links: [
      { href: "/profile", label: "My Profile", description: "View and edit your public profile", icon: `${ICON}/profile.svg` },
      { href: "/messages", label: "Messages", description: "Direct messages, Todd, and your Navigator contact", icon: `${ICON}/mail.svg` },
      { href: "/notifications", label: "Notifications", description: "Follows, likes, and comments on your posts", icon: `${ICON}/bell.svg` },
      { href: "/settings", label: "Settings", description: "Profile, notification preferences, and privacy", icon: `${ICON}/settings.svg` },
    ],
  },
  {
    title: "Learn",
    links: [
      { href: "/todd", label: "Todd the PrEP God", description: "Chat about PrEP, testing, and prevention", icon: `${ICON}/chat.svg` },
      { href: "/prep-basics", label: "PrEP Basics", description: "What PrEP is, how it works, and your options", icon: `${ICON}/pill.svg` },
      { href: "/learning-lab", label: "Learning Lab", description: "HIV and PrEP education, sourced facts", icon: `${ICON}/book.svg` },
    ],
  },
  {
    title: "Community",
    links: [
      { href: "/discover", label: "Find People", description: "Search for other members by name or username", icon: `${ICON}/search.svg` },
      { href: "/get-connected", label: "Get Connected", description: "Find testing and PrEP resources near you", icon: `${ICON}/location.svg` },
      { href: "/events", label: "Events", description: "Upcoming community events", icon: `${ICON}/calendar.svg` },
      { href: "/programs", label: "Community Programs", description: "Where we show up across Atlanta", icon: `${ICON}/users.svg` },
      { href: "/my-health", label: "My Health", description: "Private appointment and refill reminders", icon: `${ICON}/heart.svg` },
      { href: "/ambassador", label: "Ambassador", description: "Your referral link and real outreach stats", icon: `${ICON}/crown.svg` },
      { href: "/nut-juice", label: "Nut Juice", description: "Coming soon — join the waitlist", icon: `${ICON}/sparkle.svg` },
      { href: "/rewards", label: "Your Activity", description: "A real, honest count of your activity here", icon: `${ICON}/trophy.svg` },
    ],
  },
  {
    title: "Support",
    links: [
      { href: "/about", label: "About / Mission", description: "Who we are and what we're working toward", icon: `${ICON}/globe.svg` },
      { href: "/help", label: "Emergency / Help", description: "Crisis and urgent-care resources, no login needed", icon: `${ICON}/warning.svg` },
      { href: "/privacy", label: "Privacy Notice", description: "How your data is used and protected", icon: `${ICON}/lock.svg` },
    ],
  },
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
      <main className="eit-app flex-1 pb-24">
        <div className="eit-shell flex flex-col gap-6">
          {displayName && (
            <div className="flex items-center gap-3">
              <div className="w-14 h-14 shrink-0 rounded-full bg-gold/20 text-gold flex items-center justify-center font-bold uppercase text-xl">
                {displayName[0]}
              </div>
              <div>
                <p className="eit-kicker">Signed in as</p>
                <p className="text-2xl" style={{ fontFamily: "var(--eit-font-display)" }}>
                  {displayName}
                </p>
              </div>
            </div>
          )}

          {GROUPS.map((group) => (
            <div key={group.title}>
              <p className="eit-kicker mb-2">{group.title}</p>
              <div className="eit-menu-group">
                {group.links.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href === "/profile" && username ? `/profile/${username}` : link.href}
                    className="eit-menu-row"
                  >
                    <span className="eit-menu-icon">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={link.icon} alt="" width={20} height={20} />
                    </span>
                    <span>
                      <strong>{link.label}</strong>
                      <small>{link.description}</small>
                    </span>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={`${ICON}/chevron-left.svg`}
                      alt=""
                      className="eit-chevron"
                      style={{ transform: "rotate(180deg)" }}
                    />
                  </Link>
                ))}
              </div>
            </div>
          ))}

          <form action={logout}>
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

