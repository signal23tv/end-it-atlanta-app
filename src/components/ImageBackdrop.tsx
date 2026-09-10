"use client";

import { useState, type CSSProperties, type ReactNode } from "react";

/**
 * Reusable "real photo backdrop with a scrim" wrapper, used for the Home
 * page's Hero / Coming For You / Community sections.
 *
 * Henderson is producing 4 custom background images separately (hero,
 * events empty-state, community composer, community feed) and hasn't
 * supplied them yet. Rather than wait or fake them, each usage below
 * points at the exact real file path he'll eventually drop in under
 * `public/assets/endit/v1/home/` -- until that file exists, `onError`
 * falls back cleanly to a real, already-installed asset-kit background
 * (no broken image, no placeholder gray box). The moment a real file
 * lands at that path, this upgrades automatically with no code change.
 */
export default function ImageBackdrop({
  realSrc,
  fallbackSrc,
  alt = "",
  scrim,
  className = "",
  children,
}: {
  realSrc: string;
  fallbackSrc: string;
  alt?: string;
  scrim: string;
  className?: string;
  children: ReactNode;
}) {
  const [failed, setFailed] = useState(false);

  return (
    <div className={`relative overflow-hidden isolate ${className}`}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={failed ? fallbackSrc : realSrc}
        onError={() => setFailed(true)}
        alt={alt}
        className="absolute inset-0 w-full h-full object-cover -z-20"
      />
      <div className="absolute inset-0 -z-10" style={{ background: scrim } as CSSProperties} />
      {children}
    </div>
  );
}
