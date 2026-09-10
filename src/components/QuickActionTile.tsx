"use client";

import { useState } from "react";
import Link from "next/link";

const TONE_GRADIENT: Record<string, string> = {
  blue: "linear-gradient(130deg,#0064CA,#123B98)",
  pink: "linear-gradient(130deg,#C50B60,#9E154F)",
  green: "linear-gradient(130deg,#087C55,#076044)",
  purple: "linear-gradient(130deg,#7440CA,#4D2A9E)",
};

/**
 * Home's 8 quick-action tiles, now backed by the real branded key art
 * Henderson supplied for each one (Find PrEP, Get Tested, Find a Clinic,
 * Ask Todd, PrEP TV, Events, Community, My Health). Falls back to the
 * original tone gradient if a photo ever fails to load -- never a broken
 * image or empty tile.
 */
export default function QuickActionTile({
  href,
  label,
  sub,
  tone,
  icon,
  image,
}: {
  href: string;
  label: string;
  sub: string;
  tone: "blue" | "pink" | "green" | "purple";
  icon: string;
  image: string;
}) {
  const [failed, setFailed] = useState(false);

  return (
    <Link
      href={href}
      className="group relative overflow-hidden isolate rounded-[18px] min-h-[142px] flex flex-col justify-end gap-1 p-4 border border-white/15 shadow-lg shadow-black/30"
      style={!failed ? undefined : { background: TONE_GRADIENT[tone] }}
    >
      {!failed && (
        <>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={image}
            onError={() => setFailed(true)}
            alt=""
            className="absolute inset-0 w-full h-full object-cover -z-20 transition-transform duration-300 group-hover:scale-105"
          />
          <div
            className="absolute inset-0 -z-10"
            style={{
              background:
                tone === "blue"
                  ? "linear-gradient(180deg, rgb(0 100 202 / .18) 0%, rgb(6 11 19 / .55) 45%, rgb(6 11 19 / .94) 100%)"
                  : tone === "pink"
                  ? "linear-gradient(180deg, rgb(197 11 96 / .18) 0%, rgb(6 11 19 / .55) 45%, rgb(6 11 19 / .94) 100%)"
                  : tone === "green"
                  ? "linear-gradient(180deg, rgb(8 124 85 / .18) 0%, rgb(6 11 19 / .55) 45%, rgb(6 11 19 / .94) 100%)"
                  : "linear-gradient(180deg, rgb(116 64 202 / .18) 0%, rgb(6 11 19 / .55) 45%, rgb(6 11 19 / .94) 100%)",
            }}
          />
        </>
      )}

      <span
        className="w-8 h-8 rounded-full flex items-center justify-center shrink-0 mb-1"
        style={{ background: "rgb(0 0 0 / .4)", backdropFilter: "blur(4px)" }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={icon} alt="" width={16} height={16} />
      </span>
      <strong className="text-white text-[1.05rem] leading-tight">{label}</strong>
      <span className="text-white/85 text-[0.78rem] leading-snug">{sub}</span>
    </Link>
  );
}
