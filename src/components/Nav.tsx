import Link from "next/link";
import Image from "next/image";
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
        <Link href="/feed" aria-label="END IT ATLANTA home" className="flex items-center">
          <Image
            src="/assets/endit/v1/brand/endit-wordmark-vector.svg"
            alt="END IT ATLANTA"
            width={150}
            height={28}
            priority
            className="h-6 w-auto"
          />
        </Link>
        <div className="flex items-center gap-4">
          <Link
            href="/discover"
            aria-label="Find people"
            className="text-paper/70 hover:text-gold transition-colors"
          >
            <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth={2}>
              <circle cx="11" cy="11" r="7" />
              <path d="M21 21l-4.3-4.3" strokeLinecap="round" />
            </svg>
          </Link>
          <Link
            href="/messages"
            aria-label="Messages"
            className="text-paper/70 hover:text-gold transition-colors"
          >
            <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth={2}>
              <rect x="3" y="5" width="18" height="14" rx="2" strokeLinejoin="round" />
              <path d="m4 6.5 8 6.5 8-6.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </Link>
        </div>
      </div>
    </header>
  );
}
