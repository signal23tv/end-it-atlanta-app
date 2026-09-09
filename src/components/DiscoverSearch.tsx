"use client";

import { useEffect, useState, useTransition } from "react";
import Link from "next/link";
import FollowButton from "@/components/FollowButton";
import { searchProfiles, type DiscoverResult } from "@/app/discover/actions";

export default function DiscoverSearch() {
  const [term, setTerm] = useState("");
  const [results, setResults] = useState<DiscoverResult[] | null>(null);
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    const trimmed = term.trim();
    if (!trimmed) {
      setResults(null);
      return;
    }
    const handle = setTimeout(() => {
      startTransition(async () => {
        const data = await searchProfiles(trimmed);
        setResults(data);
      });
    }, 300);
    return () => clearTimeout(handle);
  }, [term]);

  return (
    <div className="flex flex-col gap-4">
      <input
        value={term}
        onChange={(e) => setTerm(e.target.value)}
        placeholder="Search by name or @username"
        className="w-full rounded-md border border-[#304055] bg-[#0A1422] text-[#F7FAFF] placeholder:text-[#98ADC7] px-4 py-3 text-base outline-none focus:border-gold"
      />

      {isPending && (
        <p className="text-muted text-sm">Searching…</p>
      )}

      {!isPending && term.trim() && results && results.length === 0 && (
        <p className="text-muted text-sm">No one found matching &quot;{term.trim()}&quot;.</p>
      )}

      {!isPending && results && results.length > 0 && (
        <div className="flex flex-col divide-y divide-white/10 rounded-xl border border-white/10 overflow-hidden">
          {results.map((p) => (
            <div key={p.id} className="flex items-center gap-3 px-4 py-3">
              <div className="w-10 h-10 shrink-0 rounded-full bg-gold/20 text-gold flex items-center justify-center font-bold uppercase">
                {p.display_name?.[0] ?? p.username[0]}
              </div>
              <Link href={`/profile/${p.username}`} className="flex-1 min-w-0">
                <p className="font-semibold text-sm truncate hover:text-gold">
                  {p.display_name}
                </p>
                <p className="text-muted text-xs truncate">
                  @{p.username}
                  {p.city ? ` · ${p.city}` : ""}
                </p>
              </Link>
              <FollowButton
                targetUserId={p.id}
                username={p.username}
                initiallyFollowing={p.is_following}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
