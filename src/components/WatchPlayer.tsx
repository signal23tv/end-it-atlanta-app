"use client";

import { useState } from "react";
import { watchThumbnail, type WatchVideo } from "@/lib/watch-data";

function PlayButton({ size = "md" }: { size?: "sm" | "md" | "lg" }) {
  const dims = size === "lg" ? 64 : size === "md" ? 52 : 40;
  return (
    <span
      className="rounded-full flex items-center justify-center shrink-0 transition-transform group-hover:scale-105"
      style={{
        width: dims,
        height: dims,
        background: "linear-gradient(135deg, var(--eit-purple), var(--eit-pink))",
        boxShadow: "0 8px 24px rgb(139 92 246 / .45)",
      }}
    >
      <svg viewBox="0 0 24 24" width={dims * 0.4} height={dims * 0.4} fill="white">
        <path d="M8 5.5v13l11-6.5-11-6.5Z" />
      </svg>
    </span>
  );
}

/** Featured hero card: big thumbnail, title overlay, tap to play inline. */
export function FeaturedVideo({ video }: { video: WatchVideo }) {
  const [playing, setPlaying] = useState(false);
  const [thumbFailed, setThumbFailed] = useState(false);

  if (playing) {
    return (
      <div className="relative w-full aspect-video rounded-2xl overflow-hidden bg-black">
        <iframe
          src={`https://iframe.videodelivery.net/${video.streamId}?autoplay=true`}
          className="absolute inset-0 w-full h-full border-0"
          allow="accelerometer; gyroscope; autoplay; encrypted-media; picture-in-picture;"
          allowFullScreen
          title={video.title}
        />
      </div>
    );
  }

  return (
    <button
      onClick={() => setPlaying(true)}
      className="group relative w-full aspect-[4/5] sm:aspect-video rounded-2xl overflow-hidden text-left"
      style={{
        background: thumbFailed
          ? "linear-gradient(135deg, var(--eit-surface-raised), var(--eit-surface))"
          : undefined,
      }}
    >
      {!thumbFailed && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={watchThumbnail(video.streamId, 720)}
          alt=""
          onError={() => setThumbFailed(true)}
          className="absolute inset-0 w-full h-full object-cover"
        />
      )}
      {thumbFailed && (
        <div className="absolute inset-0 flex items-center justify-center">
          <PlayButton size="lg" />
        </div>
      )}
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(180deg, rgb(6 11 19 / .1) 0%, rgb(6 11 19 / .35) 55%, rgb(6 11 19 / .95) 100%)",
        }}
      />
      <div className="absolute inset-x-0 bottom-0 p-5 flex flex-col items-start gap-3">
        <p className="font-display text-3xl text-[#F7FAFF] leading-tight">{video.title}</p>
        <p className="text-xs uppercase tracking-wide text-[#98ADC7]">END IT ATLANTA</p>
        <span className="inline-flex items-center gap-2 rounded-full bg-[#F7FAFF] text-black text-sm font-bold px-4 py-2 mt-1">
          <svg viewBox="0 0 24 24" width={14} height={14} fill="black">
            <path d="M8 5.5v13l11-6.5-11-6.5Z" />
          </svg>
          Watch Now
        </span>
      </div>
    </button>
  );
}

/** Compact row card: thumbnail + title, tap to play inline. */
export function VideoCard({ video }: { video: WatchVideo }) {
  const [playing, setPlaying] = useState(false);
  const [thumbFailed, setThumbFailed] = useState(false);

  if (playing) {
    return (
      <div className="relative w-full aspect-video rounded-lg overflow-hidden bg-black">
        <iframe
          src={`https://iframe.videodelivery.net/${video.streamId}?autoplay=true`}
          className="absolute inset-0 w-full h-full border-0"
          allow="accelerometer; gyroscope; autoplay; encrypted-media; picture-in-picture;"
          allowFullScreen
          title={video.title}
        />
      </div>
    );
  }

  return (
    <button onClick={() => setPlaying(true)} className="group flex flex-col gap-2 text-left">
      <div
        className="relative w-full aspect-video rounded-lg overflow-hidden bg-black"
        style={{
          background: thumbFailed
            ? "linear-gradient(135deg, var(--eit-surface-raised), var(--eit-surface))"
            : undefined,
        }}
      >
        {!thumbFailed && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={watchThumbnail(video.streamId, 320)}
            alt=""
            onError={() => setThumbFailed(true)}
            className="absolute inset-0 w-full h-full object-cover transition-opacity group-hover:opacity-80"
          />
        )}
        <div className="absolute inset-0 flex items-center justify-center">
          <PlayButton size="sm" />
        </div>
      </div>
      <p className="text-sm font-semibold text-[#F7FAFF] leading-tight">{video.title}</p>
    </button>
  );
}
