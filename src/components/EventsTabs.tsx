"use client";

import Image from "next/image";
import { useMemo, useState } from "react";
import type { EventItem } from "@/lib/events-data";

export default function EventsTabs({ events }: { events: EventItem[] }) {
  const { upcoming, past } = useMemo(() => {
    const now = Date.now();
    const upcoming: EventItem[] = [];
    const past: EventItem[] = [];
    for (const e of events) {
      (new Date(e.dateISO).getTime() >= now ? upcoming : past).push(e);
    }
    return { upcoming, past };
  }, [events]);

  const [tab, setTab] = useState<"upcoming" | "past">(upcoming.length > 0 ? "upcoming" : "past");
  const shown = tab === "upcoming" ? upcoming : past;

  return (
    <div className="flex flex-col gap-5">
      <div className="flex gap-2 rounded-lg bg-white/5 p-1 w-fit">
        {(["upcoming", "past"] as const).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`px-4 py-1.5 rounded-md text-sm font-bold uppercase tracking-wide transition ${
              tab === t ? "bg-gold text-black" : "text-paper/60 hover:text-paper"
            }`}
          >
            {t === "upcoming" ? `Upcoming (${upcoming.length})` : `Past (${past.length})`}
          </button>
        ))}
      </div>

      {shown.length === 0 ? (
        <p className="text-muted text-center py-12">
          {tab === "upcoming"
            ? "No upcoming events scheduled yet — check back soon."
            : "No past events on record yet."}
        </p>
      ) : (
        <div className="flex flex-col gap-5">
          {shown.map((e) => (
            <div key={e.id} className="rounded-xl border border-white/10 overflow-hidden">
              <div className="relative aspect-[16/9]">
                <Image src={e.imageSrc} alt={e.imageAlt} fill className="object-cover" />
              </div>
              <div className="p-5">
                <p className="text-gold font-semibold text-xs uppercase tracking-wide">
                  {e.subtitle}
                </p>
                <h3 className="font-display text-2xl mt-1">{e.title}</h3>
                <p className="text-sm text-paper/70 mt-2">{e.description}</p>
                <ul className="mt-3 space-y-1 text-sm text-muted">
                  <li>📅 {e.dateLabel}</li>
                  <li>🕕 {e.timeLabel}</li>
                  <li>👑 {e.detailLine}</li>
                  <li>{e.locationLine}</li>
                </ul>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
