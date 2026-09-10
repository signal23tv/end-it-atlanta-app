"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const TABS = [
  {
    href: "/feed",
    label: "Home",
    match: (p: string) => p === "/feed",
    icon: (active: boolean) => (
      <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth={active ? 2.5 : 2}>
        <path d="M3 11.5 12 4l9 7.5" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M5.5 10v9a1 1 0 0 0 1 1H9a1 1 0 0 0 1-1v-4a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v4a1 1 0 0 0 1 1h2.5a1 1 0 0 0 1-1v-9" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    href: "/discover",
    label: "Explore",
    match: (p: string) =>
      p.startsWith("/discover") ||
      p.startsWith("/get-connected") ||
      p.startsWith("/learning-lab"),
    icon: (active: boolean) => (
      <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth={active ? 2.5 : 2}>
        <circle cx="11" cy="11" r="7" />
        <path d="m20 20-3.5-3.5" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    href: "/messages",
    label: "Messages",
    match: (p: string) => p.startsWith("/messages"),
    icon: (active: boolean) => (
      <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth={active ? 2.5 : 2}>
        <rect x="3" y="5" width="18" height="14" rx="2" strokeLinejoin="round" />
        <path d="m4 6.5 8 6.5 8-6.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    href: "/todd",
    label: "Todd",
    match: (p: string) => p.startsWith("/todd"),
    icon: (active: boolean) => (
      <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth={active ? 2.5 : 2}>
        <path d="M4 5.5A2.5 2.5 0 0 1 6.5 3h11A2.5 2.5 0 0 1 20 5.5v8A2.5 2.5 0 0 1 17.5 16H10l-4.5 4v-4H6.5A2.5 2.5 0 0 1 4 13.5v-8Z" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    href: "/watch",
    label: "Watch",
    match: (p: string) => p.startsWith("/watch"),
    icon: (active: boolean) => (
      <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth={active ? 2.5 : 2}>
        <rect x="3" y="5" width="18" height="13" rx="2" />
        <path d="M10 9.5v4l3.5-2-3.5-2Z" fill="currentColor" stroke="none" />
      </svg>
    ),
  },
  {
    href: "/more",
    label: "More",
    match: (p: string) => p.startsWith("/more") || p.startsWith("/settings") || p.startsWith("/profile"),
    icon: (active: boolean) => (
      <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth={active ? 2.5 : 2}>
        <circle cx="5" cy="12" r="1.5" fill="currentColor" stroke="none" />
        <circle cx="12" cy="12" r="1.5" fill="currentColor" stroke="none" />
        <circle cx="19" cy="12" r="1.5" fill="currentColor" stroke="none" />
      </svg>
    ),
  },
];

export default function BottomNav() {
  const pathname = usePathname() || "";

  return (
    <nav
      aria-label="Primary"
      className="fixed bottom-0 inset-x-0 z-30 bg-black border-t border-white/10 pb-[env(safe-area-inset-bottom)]"
    >
      <div className="max-w-2xl mx-auto grid grid-cols-6">
        {TABS.map((tab) => {
          const active = tab.match(pathname);
          return (
            <Link
              key={tab.href}
              href={tab.href}
              className={`flex flex-col items-center gap-1 py-2.5 text-[10px] font-semibold uppercase tracking-wide ${
                active ? "text-gold" : "text-paper/60 hover:text-paper"
              }`}
            >
              {tab.icon(active)}
              {tab.label}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
