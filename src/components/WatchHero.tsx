"use client";

import { useState } from "react";

/**
 * Top-of-page hero banner for PrEP TV -- real UI layered over the real
 * key-art image, not baked into it. "The Clinic" doesn't have a real
 * episode/trailer video yet (key art only, supplied 2026-09-10), so this
 * is honestly presented as a "Coming Soon" original rather than wiring
 * Watch Now to a video that doesn't exist. Watch Now instead jumps to the
 * real, playable videos further down the page.
 */
export default function WatchHero() {
  const [showInfo, setShowInfo] = useState(false);

  return (
    <div className="flex flex-col gap-3">
      <div className="relative w-full aspect-[8/5] sm:aspect-[2.4/1] rounded-2xl overflow-hidden">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/assets/endit/v1/watch/the-clinic-hero.webp"
          alt="The Clinic -- a new PrEP TV original series from END IT ATLANTA"
          className="absolute inset-0 w-full h-full object-cover"
          style={{ objectPosition: "62% center" }}
        />
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(180deg, rgb(6 11 19 / .05) 0%, rgb(6 11 19 / .15) 40%, rgb(6 11 19 / .88) 100%)",
          }}
        />

        <div className="absolute inset-x-0 bottom-0 p-4 sm:p-5 flex flex-col items-start gap-2">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold uppercase tracking-[0.15em] text-gold">
              PrEP TV Original
            </span>
            <span className="text-[10px] font-bold uppercase tracking-wide text-[#F7FAFF]/70 bg-white/10 rounded-full px-2 py-0.5">
              Coming Soon
            </span>
          </div>
          <p className="font-display text-3xl sm:text-4xl leading-none text-[#F7FAFF]">
            The <span className="text-red">Clinic</span>
          </p>
          <p className="text-xs sm:text-sm text-[#B3C2D4] max-w-sm">
            Real people. Real stories. Real impact.
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <a
          href="#latest-videos"
          className="flex-1 inline-flex items-center justify-center gap-2 rounded-full bg-[#F7FAFF] text-black text-sm font-bold px-4 py-2.5"
        >
          <svg viewBox="0 0 24 24" width={14} height={14} fill="black">
            <path d="M8 5.5v13l11-6.5-11-6.5Z" />
          </svg>
          Watch Now
        </a>
        <button
          onClick={() => setShowInfo((v) => !v)}
          aria-expanded={showInfo}
          className="flex-1 inline-flex items-center justify-center gap-2 rounded-full border border-[#304055] text-[#F7FAFF] text-sm font-bold px-4 py-2.5 hover:border-gold transition-colors"
        >
          <svg viewBox="0 0 24 24" width={14} height={14} fill="none" stroke="currentColor" strokeWidth={2}>
            <circle cx="12" cy="12" r="9" />
            <path d="M12 11v5.5M12 8v.01" strokeLinecap="round" />
          </svg>
          More Info
        </button>
      </div>

      {showInfo && (
        <div className="rounded-xl border border-[#304055] bg-[#101A28] px-4 py-3 text-sm text-[#B3C2D4]">
          <span className="font-semibold text-[#F7FAFF]">The Clinic</span> is a new PrEP TV
          original in production -- a healthier Atlanta, a brighter tomorrow. No episodes are
          live yet; check back soon, or watch what&apos;s already real from END IT ATLANTA
          below.
        </div>
      )}
    </div>
  );
}
