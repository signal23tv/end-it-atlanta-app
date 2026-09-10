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
 * Henderson supplied for each one. The art is a full 1254x1254 square
 * with its own real title/subtitle baked in, and none of it should ever
 * be cropped.
 *
 * Bug fix (2026-09-10): this previously used Tailwind's `aspect-square`
 * on the tile itself, which relies on the browser correctly sizing an
 * `aspect-ratio` element inside an auto-sized CSS Grid row -- in
 * practice that came out shorter than it should have, so `object-cover`
 * cropped the bottom of every image (title text was getting cut off).
 * Switched to the classic, bulletproof "padding-top: 100%" spacer
 * technique instead: a full-width block whose height is set purely by
 * its own width via percentage padding, which every browser has
 * supported correctly for a decade+, regardless of grid auto-row
 * quirks. The image is then absolutely positioned to exactly fill that
 * guaranteed-square box -- no cropping possible when the source image
 * is itself square.
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
        className="relative block overflow-hidden rounded-[18px] border border-white/15 shadow-lg shadow-black/30 text-white"
        style={{ background: TONE_GRADIENT[tone] }}
      >
        <div className="w-full" style={{ paddingTop: "100%" }} />
        <div className="absolute inset-0 flex flex-col justify-end gap-1 p-4">
          <strong className="text-[1.05rem] leading-tight">{label}</strong>
          <span className="text-white/85 text-[0.78rem] leading-snug">{sub}</span>
        </div>
      </Link>
    );
  }

  return (
    <Link
      href={href}
      aria-label={`${label} -- ${sub}`}
      className="group relative block overflow-hidden rounded-[18px] border border-white/15 shadow-lg shadow-black/30 transition-transform duration-200 hover:scale-[1.02] focus-visible:scale-[1.02]"
    >
      {/* Spacer that forces this box to be exactly as tall as it is wide,
          regardless of grid/flex context -- padding percentages are
          always resolved against the containing block's width. */}
      <div className="w-full" style={{ paddingTop: "100%" }} />
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
