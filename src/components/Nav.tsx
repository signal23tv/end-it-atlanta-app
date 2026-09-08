import Link from "next/link";
import { createClient } from "@/lib/supabase/server";

/**
 * Slim top bar for the authenticated app shell. Primary navigation now
 * lives in BottomNav (Home/Explore/Chat/Watch/More) -- this used to
 * duplicate those links in text form, which cluttered the top of every
 * screen and didn't match the mockup's clean header. Kept as a server
 * component (still reads the session) in case a page needs it later,
 * but it only renders the wordmark today.
 */
export default async function Nav() {
  const supabase = await createClient();
  await supabase.auth.getUser();

  return (
    <header className="bg-black text-paper sticky top-0 z-10 border-b border-white/10">
      <div className="max-w-2xl mx-auto flex items-center justify-between px-4 py-3">
        <Link href="/feed" className="font-display text-xl tracking-wide">
          END IT ATLANTA
        </Link>
      </div>
    </header>
  );
}
