import Link from "next/link";
import { createClient } from "@/lib/supabase/server";

export default async function Home() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <main className="flex-1 flex flex-col items-center justify-center bg-black text-paper px-4 text-center gap-6 py-20">
      <h1 className="font-display text-6xl md:text-7xl tracking-wide">
        END IT ATLANTA
      </h1>
      <p className="max-w-md text-lg text-muted">
        One city. One mission. One person at a time.
      </p>
      <div className="flex gap-3">
        {user ? (
          <Link
            href="/feed"
            className="bg-red hover:bg-red-dark font-bold uppercase tracking-wide rounded-md px-6 py-3 transition-colors"
          >
            Go to Feed
          </Link>
        ) : (
          <>
            <Link
              href="/signup"
              className="bg-red hover:bg-red-dark font-bold uppercase tracking-wide rounded-md px-6 py-3 transition-colors"
            >
              Sign Up
            </Link>
            <Link
              href="/login"
              className="border border-paper/30 hover:border-gold font-bold uppercase tracking-wide rounded-md px-6 py-3 transition-colors"
            >
              Log In
            </Link>
          </>
        )}
      </div>
    </main>
  );
}
