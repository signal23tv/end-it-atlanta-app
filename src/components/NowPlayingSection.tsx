"use client";

import { useRef, useState } from "react";
import { watchThumbnail, type WatchVideo } from "@/lib/watch-data";

/**
 * Real, large video player pinned to the top of /watch -- this replaces
 * the earlier design where the only way to watch was a small inline
 * player inside a 160px-wide row card (Henderson's feedback: "why would
 * you think its okay for videos to play so small... there should be a
 * player on the page that plays the videos up top"). Picking a different
 * video from the row below updates this same large player instead of
 * playing small inline in the row.
 */
export default function NowPlayingSection({ videos }: { videos: WatchVideo[] }) {
  const [activeId, setActiveId] = useState(videos[0]?.id);
  const [playing, setPlaying] = useState(false);
  const [thumbFailed, setThumbFailed] = useState<Record<string, boolean>>({});
  const playerRef = useRef<HTMLDivElement>(null);

  const active = videos.find((v) => v.id === activeId) ?? videos[0];
  if (!active) return null;

  function selectVideo(id: string) {
    setActiveId(id);
    setPlaying(true);
    playerRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  const others = videos.filter((v) => v.id !== active.id);

  return (
    <div id="latest-videos" ref={playerRef} className="flex flex-col gap-3 px-4">
      <div className="relative w-full aspect-video rounded-2xl overflow-hidden bg-black shadow-2xl shadow-black/50">
        {playing ? (
          <iframe
            key={active.id}
            src={`https://iframe.videodelivery.net/${active.streamId}?autoplay=true`}
            className="absolute inset-0 w-full h-full border-0"
            allow="accelerometer; gyroscope; autoplay; encrypted-media; picture-in-picture;"
            allowFullScreen
            title={active.title}
          />
        ) : (
          <button
            onClick={() => setPlaying(true)}
            className="group absolute inset-0 w-full h-full text-left"
            aria-label={`Play ${active.title}`}
          >
            {!thumbFailed[active.id] && (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={watchThumbnail(active.streamId, 720)}
                alt=""
                onError={() => setThumbFailed((f) => ({ ...f, [active.id]: true }))}
                className="absolute inset-0 w-full h-full object-cover"
              />
            )}
            <div
              className="absolute inset-0"
              style={{ background: "linear-gradient(180deg, rgb(6 11 19 / .1) 0%, rgb(6 11 19 / .55) 100%)" }}
            />
            <span
              className="absolute inset-0 flex items-center justify-center"
              aria-hidden="true"
            >
              <span
                className="rounded-full flex items-center justify-center transition-transform group-hover:scale-110"
                style={{
                  width: 76,
                  height: 76,
                  background: "linear-gradient(135deg, var(--eit-purple), var(--eit-pink))",
                  boxShadow: "0 10px 30px rgb(139 92 246 / .5)",
                }}
              >
                <svg viewBox="0 0 24 24" width={30} height={30} fill="white">
                  <path d="M8 5.5v13l11-6.5-11-6.5Z" />
                </svg>
              </span>
            </span>
          </button>
        )}
      </div>

      <div>
        <p className="font-display text-2xl text-[#F7FAFF] leading-tight">{active.title}</p>
        <p className="text-xs uppercase tracking-wide text-[#98ADC7] mt-1">END IT ATLANTA</p>
      </div>

      {others.length > 0 && (
        <div className="flex flex-col gap-2 mt-1">
          <p className="text-xs font-bold uppercase tracking-wide text-[#98ADC7]">More from END IT ATLANTA</p>
          <div className="flex gap-3 overflow-x-auto pb-1 snap-x snap-mandatory scrollbar-none">
            {others.map((video) => (
              <button
                key={video.id}
                onClick={() => selectVideo(video.id)}
                className="shrink-0 snap-start w-36 text-left group"
              >
                <div className="relative w-full aspect-video rounded-lg overflow-hidden bg-black">
                  {!thumbFailed[video.id] ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={watchThumbnail(video.streamId, 320)}
                      alt=""
                      onError={() => setThumbFailed((f) => ({ ...f, [video.id]: true }))}
                      className="absolute inset-0 w-full h-full object-cover transition-opacity group-hover:opacity-80"
                    />
                  ) : (
                    <div
                      className="absolute inset-0"
                      style={{ background: "linear-gradient(135deg, var(--eit-surface-raised), var(--eit-surface))" }}
                    />
                  )}
                  <span className="absolute inset-0 flex items-center justify-center">
                    <span
                      className="rounded-full flex items-center justify-center"
                      style={{
                        width: 32,
                        height: 32,
                        background: "linear-gradient(135deg, var(--eit-purple), var(--eit-pink))",
                      }}
                    >
                      <svg viewBox="0 0 24 24" width={12} height={12} fill="white">
                        <path d="M8 5.5v13l11-6.5-11-6.5Z" />
                      </svg>
                    </span>
                  </span>
                </div>
                <p className="text-xs font-semibold text-[#F7FAFF] leading-tight mt-1.5">{video.title}</p>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
