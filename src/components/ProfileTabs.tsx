"use client";

import { useState } from "react";
import PostCard from "@/components/PostCard";
import type { Post } from "@/lib/types";

type Tab = "posts" | "about";

export default function ProfileTabs({
  bio,
  city,
  joinedLabel,
  posts,
}: {
  bio: string | null;
  city: string | null;
  joinedLabel: string | null;
  posts: Post[];
}) {
  const [tab, setTab] = useState<Tab>("posts");

  return (
    <div className="flex flex-col gap-4">
      <div
        role="tablist"
        aria-label="Profile"
        className="flex gap-2 rounded-lg bg-white/5 p-1 w-fit"
      >
        {(
          [
            { key: "posts", label: "Posts" },
            { key: "about", label: "About" },
          ] as { key: Tab; label: string }[]
        ).map((t) => (
          <button
            key={t.key}
            role="tab"
            aria-selected={tab === t.key}
            onClick={() => setTab(t.key)}
            className={`px-4 py-1.5 rounded-md text-sm font-semibold transition-colors ${
              tab === t.key ? "bg-gold text-black" : "text-[#B3C2D4] hover:text-[#F7FAFF]"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {tab === "posts" &&
        (posts.length === 0 ? (
          <p className="text-[#98ADC7] text-center py-12">No posts yet.</p>
        ) : (
          <div className="flex flex-col gap-4">
            {posts.map((post) => (
              <PostCard key={post.id} post={post} />
            ))}
          </div>
        ))}

      {tab === "about" && (
        <div className="rounded-xl border border-[#304055] bg-[#101A28] p-5 flex flex-col gap-3 text-sm">
          {bio ? (
            <p className="text-[#F7FAFF]">{bio}</p>
          ) : (
            <p className="text-[#98ADC7]">No bio yet.</p>
          )}
          <div className="flex flex-col gap-1.5 text-[#B3C2D4]">
            {city && (
              <p className="flex items-center gap-1.5">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="/assets/endit/v1/icons/location.svg" alt="" width={14} height={14} />
                {city}
              </p>
            )}
            {joinedLabel && <p>Joined {joinedLabel}</p>}
          </div>
        </div>
      )}
    </div>
  );
}
