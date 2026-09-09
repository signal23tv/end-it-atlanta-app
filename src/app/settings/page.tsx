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
      { href: "/settings/profile", label: "Edit Profile", description: "Name, username, bio, photo", icon: `${ICON}/edit.svg` },
      { href: "/settings/notifications", label: "Notifications", description: "Push alerts and preferences", icon: `${ICON}/notification-off.svg` },
    ],
  },
  {
    title: "Legal",
    links: [
      { href: "/privacy", label: "Privacy Notice", description: "How your data is used and protected", icon: `${ICON}/lock.svg` },
      { href: "/help", label: "Emergency / Help", description: "Crisis and urgent-care resources", icon: `${ICON}/warning.svg` },
    ],
  },
];

export default async function SettingsPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  let displayName: string | null = null;
  let username: string | null = null;
  if (user) {
    const { data: profile } = await supabase
      .from("profiles")
      .select("username, display_name")
      .eq("id", user.id)
      .single();
    displayName = profile?.display_name ?? null;
    username = profile?.username ?? null;
  }

  return (
    <>
      <Nav />
      <main className="eit-app flex-1 pb-24">
        <div className="eit-shell flex flex-col gap-6">
          <div>
            <h1 className="text-3xl" style={{ fontFamily: "var(--eit-font-display)" }}>
              Settings
            </h1>
            {displayName && username && (
              <Link href={`/profile/${username}`} className="text-sm text-[#98ADC7] hover:text-gold">
                Signed in as {displayName} (@{username})
              </Link>
            )}
          </div>

          {GROUPS.map((group) => (
            <div key={group.title}>
              <p className="eit-kicker mb-2">{group.title}</p>
              <div className="eit-menu-group">
                {group.links.map((link) => (
                  <Link key={link.href} href={link.href} className="eit-menu-row">
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
