"use client";

import { useState } from "react";
import Link from "next/link";
import DiscoverSearch from "@/components/DiscoverSearch";
import PostCard from "@/components/PostCard";
import { EVENTS } from "@/lib/events-data";
import type { Post } from "@/lib/types";

type Tab = "people" | "events" | "community";

const TABS: { key: Tab; label: string }[] = [
  { key: "people", label: "People" },
  { key: "events", label: "Events" },
  { key: "community", label: "Community" },
];

function EventsPanel() {
  const now = Date.now();
  const upcoming = EVENTS.filter((e) => new Date(e.dateISO).getTime() >= now);

  if (upcoming.length === 0) {
    return (
      <div className="eit-card eit-empty">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/assets/endit/v1/empty-states/events.svg" alt="" />
        <p>No upcoming events scheduled yet -- check back soon.</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3">
      {upcoming.map((e) => (
        <Link
          key={e.id}
          href="/events"
          className="rounded-xl overflow-hidden border border-[#304055] bg-[#101A28] flex gap-3"
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={e.imageSrc}
            alt={e.imageAlt}
            className="w-24 h-24 object-cover shrink-0"
          />
          <div className="py-3 pr-3">
            <p className="font-display text-lg leading-tight">{e.title}</p>
            <p className="text-xs text-[#B3C2D4] mt-1">
              {e.dateLabel} · {e.timeLabel}
            </p>
            <p className="text-xs text-[#B3C2D4]">{e.locationLine}</p>
          </div>
        </Link>
      ))}
      <Link href="/events" className="text-center text-sm text-gold hover:underline mt-1">
        See all events
      </Link>
    </div>
  );
}

function CommunityPanel({ posts }: { posts: Post[] }) {
  if (posts.length === 0) {
    return (
      <div className="eit-card eit-empty">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/assets/endit/v1/empty-states/messages.svg" alt="" />
        <p>No posts yet -- be the first to share something on the Home feed.</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      {posts.map((post) => (
        <PostCard key={post.id} post={post} />
      ))}
      <Link href="/feed" className="text-center text-sm text-gold hover:underline">
        Go to the full feed
      </Link>
    </div>
  );
}

export default function DiscoverTabs({
  recentPosts,
  initialTerm,
}: {
  recentPosts: Post[];
  initialTerm?: string;
}) {
  const [tab, setTab] = useState<Tab>("people");

  return (
    <div className="flex flex-col gap-4">
      <div role="tablist" aria-label="Discover" className="flex gap-2 rounded-lg bg-white/5 p-1 w-fit">
        {TABS.map((t) => (
          <button
            key={t.key}
            role="tab"
            aria-selected={tab === t.key}
            onClick={() => setTab(t.key)}
            className={`px-4 py-1.5 rounded-md text-sm font-semibold transition-colors ${
              tab === t.key ? "bg-gold text-black" : "text-paper/70 hover:text-paper"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {tab === "people" && <DiscoverSearch initialTerm={initialTerm} />}
      {tab === "events" && <EventsPanel />}
      {tab === "community" && <CommunityPanel posts={recentPosts} />}
    </div>
  );
}
