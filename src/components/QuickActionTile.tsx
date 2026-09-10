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
 * Home's 8 quick-action tiles, backed by the real branded key art
 * Henderson supplied for each one. The art is square and already has its
 * own real title/subtitle baked in -- so the tile is sized to match the
 * image's own aspect ratio (square) instead of cropping the artwork down
 * to fit a short rectangle, and there's no duplicate text laid over top
 * of it. Falls back to the original tone gradient (with a real text
 * label) if a photo ever fails to load.
 */
export default function QuickActionTile({
  href,
  label,
  sub,
  tone,
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

  if (failed) {
    return (
      <Link
        href={href}
        className="relative overflow-hidden rounded-[18px] aspect-square flex flex-col justify-end gap-1 p-4 border border-white/15 shadow-lg shadow-black/30 text-white"
        style={{ background: TONE_GRADIENT[tone] }}
      >
        <strong className="text-[1.05rem] leading-tight">{label}</strong>
        <span className="text-white/85 text-[0.78rem] leading-snug">{sub}</span>
      </Link>
    );
  }

  return (
    <Link
      href={href}
      aria-label={`${label} -- ${sub}`}
      className="group relative overflow-hidden rounded-[18px] aspect-square border border-white/15 shadow-lg shadow-black/30 transition-transform duration-200 hover:scale-[1.02] focus-visible:scale-[1.02]"
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={image}
        onError={() => setFailed(true)}
        alt={`${label} -- ${sub}`}
        className="absolute inset-0 w-full h-full object-cover"
      />
    </Link>
  );
}
