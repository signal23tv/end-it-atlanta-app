"use client";

import Image from "next/image";
import { useMemo, useState } from "react";
import RsvpButton from "@/components/RsvpButton";
import type { EventItem } from "@/lib/events-data";
import type { RsvpState } from "@/app/events/actions";

const ASSET = "/assets/endit/v1";

export default function EventsTabs({
  events,
  rsvps,
  signedIn,
}: {
  events: EventItem[];
  rsvps: RsvpState[];
  signedIn: boolean;
}) {
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
  const rsvpFor = (id: string) => rsvps.find((r) => r.eventId === id);

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
        <div className="eit-card eit-empty">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={`${ASSET}/empty-states/events.svg`} alt="" />
          <p>
            {tab === "upcoming"
              ? "No upcoming events scheduled yet — check back soon."
              : "No past events on record yet."}
          </p>
        </div>
      ) : (
        <div className="flex flex-col gap-5">
          {shown.map((e) => {
            const rsvp = rsvpFor(e.id);
            return (
              <div
                key={e.id}
                className="rounded-xl border border-[#304055] bg-[#101A28] overflow-hidden"
              >
                <div className="relative aspect-[16/9]">
                  <Image src={e.imageSrc} alt={e.imageAlt} fill className="object-cover" />
                </div>
                <div className="p-5 flex flex-col gap-3">
                  <div className="flex flex-wrap gap-1.5">
                    <span className="text-[10px] font-bold uppercase tracking-wide bg-gold/15 text-gold rounded-full px-2.5 py-1">
                      {e.subtitle}
                    </span>
                    <span className="text-[10px] font-bold uppercase tracking-wide bg-white/5 text-[#B3C2D4] rounded-full px-2.5 py-1">
                      {e.detailLine}
                    </span>
                  </div>
                  <div>
                    <h3 className="font-display text-2xl text-[#F7FAFF]">{e.title}</h3>
                    <p className="text-sm text-[#B3C2D4] mt-1">{e.description}</p>
                  </div>
                  <ul className="space-y-1 text-sm text-[#98ADC7]">
                    <li className="flex items-center gap-1.5">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={`${ASSET}/icons/calendar.svg`} alt="" width={14} height={14} />
                      {e.dateLabel}
                    </li>
                    <li className="flex items-center gap-1.5">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={`${ASSET}/icons/clock.svg`} alt="" width={14} height={14} />
                      {e.timeLabel}
                    </li>
                    <li className="flex items-center gap-1.5">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={`${ASSET}/icons/location.svg`} alt="" width={14} height={14} />
                      {e.locationLine}
                    </li>
                  </ul>
                  {tab === "upcoming" && rsvp && (
                    <div className="pt-1">
                      <RsvpButton
                        eventId={e.id}
                        initiallyGoing={rsvp.going}
                        initialCount={rsvp.count}
                        signedIn={signedIn}
                      />
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
