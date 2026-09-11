"use client";

import { useEffect, useState, useTransition } from "react";
import Link from "next/link";
import FollowButton from "@/components/FollowButton";
import Avatar from "@/components/Avatar";
import {
  searchProfiles,
  listRecentProfiles,
  type DiscoverResult,
} from "@/app/discover/actions";

function MemberGrid({ results }: { results: DiscoverResult[] }) {
  return (
    <div className="grid grid-cols-2 gap-3">
      {results.map((p) => (
        <div
          key={p.id}
          className="rounded-xl border border-[#304055] bg-[#101A28] p-3 flex flex-col gap-2"
        >
          <Link href={`/profile/${p.username}`} className="flex flex-col items-center gap-2 text-center">
            <Avatar
              src={p.avatar_url}
              color={p.avatar_color}
              name={p.display_name || p.username}
              size={64}
            />
            <div>
              <p className="font-semibold text-sm truncate hover:text-gold">{p.display_name}</p>
              <p className="text-[#B3C2D4] text-xs truncate">
                @{p.username}
                {p.city ? ` · ${p.city}` : ""}
              </p>
            </div>
          </Link>
          <FollowButton
            targetUserId={p.id}
            username={p.username}
            initiallyFollowing={p.is_following}
          />
        </div>
      ))}
    </div>
  );
}

export default function DiscoverSearch({ initialTerm = "" }: { initialTerm?: string }) {
  const [term, setTerm] = useState(initialTerm);
  const [recent, setRecent] = useState<DiscoverResult[] | null>(null);
  const [results, setResults] = useState<DiscoverResult[] | null>(null);
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    startTransition(async () => {
      const data = await listRecentProfiles();
      setRecent(data);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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

  const showingSearch = term.trim().length > 0;

  return (
    <div className="flex flex-col gap-4">
      <input
        value={term}
        onChange={(e) => setTerm(e.target.value)}
        placeholder="Search by name or @username"
        className="w-full rounded-md border border-[#304055] bg-[#0A1422] text-[#F7FAFF] placeholder:text-[#98ADC7] px-4 py-3 text-base outline-none focus:border-gold"
      />

      {isPending && <p className="text-muted text-sm">Loading…</p>}

      {showingSearch ? (
        <>
          {!isPending && results && results.length === 0 && (
            <p className="text-muted text-sm">No one found matching &quot;{term.trim()}&quot;.</p>
          )}
          {!isPending && results && results.length > 0 && <MemberGrid results={results} />}
        </>
      ) : (
        <>
          {recent && recent.length === 0 && (
            <p className="text-muted text-sm">No other members have joined yet.</p>
          )}
          {recent && recent.length > 0 && (
            <>
              <p className="eit-kicker">Recently joined</p>
              <MemberGrid results={recent} />
            </>
          )}
        </>
      )}
    </div>
  );
}
