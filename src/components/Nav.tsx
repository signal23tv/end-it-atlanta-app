import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { logout } from "@/app/login/actions";

export default async function Nav() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  let username: string | null = null;
  if (user) {
    const { data: profile } = await supabase
      .from("profiles")
      .select("username")
      .eq("id", user.id)
      .single();
    username = profile?.username ?? null;
  }

  return (
    <header className="bg-black text-paper sticky top-0 z-10 border-b border-white/10">
      <div className="max-w-2xl mx-auto flex items-center justify-between px-4 py-3">
        <Link href="/feed" className="font-display text-2xl tracking-wide">
          END IT ATLANTA
        </Link>
        <nav className="flex items-center gap-4 text-sm font-semibold">
          {username ? (
            <>
              <Link href="/feed" className="hover:text-gold">
                Feed
              </Link>
              <Link href={`/profile/${username}`} className="hover:text-gold">
                Profile
              </Link>
              <Link href="/todd" className="hover:text-gold">
                Todd
              </Link>
              <Link href="/settings/notifications" className="hover:text-gold">
                Settings
              </Link>
              <form action={logout}>
                <button type="submit" className="hover:text-gold">
                  Log out
                </button>
              </form>
            </>
          ) : (
            <>
              <Link href="/login" className="hover:text-gold">
                Log in
              </Link>
              <Link
                href="/signup"
                className="bg-red hover:bg-red-dark px-3 py-1.5 rounded-md"
              >
                Sign up
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
