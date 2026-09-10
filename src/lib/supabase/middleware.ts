import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

/**
 * Refreshes the Supabase auth session on every request and keeps
 * the auth cookies in sync between the browser and the server.
 * Required for App Router + Supabase SSR auth to work reliably.
 */
export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          );
          supabaseResponse = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  // Do not remove: this refreshes the session and must run before
  // any other logic that checks auth state.
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Henderson (2026-09-10): the root URL should never show the old
  // marketing splash page -- it should always act like /feed. Checked
  // with him first, since this removes the public marketing page as a
  // reachable entry point for anonymous/organic traffic: confirmed,
  // he wants "/" to always behave exactly like /feed for every visitor.
  const isRoot = request.nextUrl.pathname === "/";

  const isAuthRoute =
    request.nextUrl.pathname.startsWith("/login") ||
    request.nextUrl.pathname.startsWith("/signup");
  const isProtectedRoute =
    isRoot ||
    request.nextUrl.pathname.startsWith("/feed") ||
    request.nextUrl.pathname.startsWith("/settings") ||
    request.nextUrl.pathname.startsWith("/todd") ||
    request.nextUrl.pathname.startsWith("/watch") ||
    request.nextUrl.pathname.startsWith("/more") ||
    request.nextUrl.pathname.startsWith("/prep-basics") ||
    request.nextUrl.pathname.startsWith("/events") ||
    request.nextUrl.pathname.startsWith("/programs") ||
    request.nextUrl.pathname.startsWith("/nut-juice") ||
    request.nextUrl.pathname.startsWith("/notifications") ||
    request.nextUrl.pathname.startsWith("/rewards") ||
    request.nextUrl.pathname.startsWith("/my-health") ||
    request.nextUrl.pathname.startsWith("/messages") ||
    request.nextUrl.pathname.startsWith("/ambassador") ||
    request.nextUrl.pathname.startsWith("/discover");
  // Intentionally NOT protected: /help (crisis resources -- must work
  // with no login) and /about (public marketing-style content).

  if (!user && isProtectedRoute) {
    const url = request.nextUrl.clone();
    url.pathname = "/login";
    return NextResponse.redirect(url);
  }

  if (user && (isAuthRoute || isRoot)) {
    const url = request.nextUrl.clone();
    url.pathname = "/feed";
    return NextResponse.redirect(url);
  }

  return supabaseResponse;
}
