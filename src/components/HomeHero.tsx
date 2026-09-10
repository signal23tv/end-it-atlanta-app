import HomeSearchBar from "@/components/HomeSearchBar";

const ASSET = "/assets/endit/v1";

/**
 * Compact homepage greeting hero -- NOT a full-height takeover.
 *
 * The greeting/search are always real, live UI rendered from the current
 * signed-in user's data (`firstName` comes from the caller, which reads
 * it fresh from Supabase per request -- never hard-coded, never baked
 * into an image). The artwork here is purely decorative brand atmosphere
 * with real negative space built in on the left side -- it has no baked
 * headline, search box, or personal name, so there's nothing for the
 * real copy to collide or duplicate with.
 *
 * Two responsive layouts, per spec:
 * - Phone (default): a short ~128px art strip on top (using the
 *   phone-specific crop, so the subject's face stays visible instead of
 *   being dictated by the source's tall 1000x750 ratio), with the real
 *   greeting + search stacked below in the same dark card.
 * - md and up: side-by-side -- real greeting/search on the dark left,
 *   the wide banner art filling the right/full width behind it (the
 *   art's own built-in left-side gradient blends into the card
 *   background so overlaid text stays readable without an extra scrim
 *   fighting the image).
 *
 * The desktop container is `aspect-[1600/586]` -- the exact pixel ratio
 * of the saved `home_hero_atlanta_banner.webp` -- not a fixed min-height.
 * A fixed height with `object-cover` was cropping the top/bottom of the
 * banner on wide screens (Henderson caught this live, 2026-09-10):
 * `min-h-[240px]` was shallower than the image's real 2.73:1 ratio at
 * the shell's max content width, so `object-cover` chopped the mural
 * text and tagline. Matching the container to the image's exact ratio
 * (same fix already used for the Watch hero and Home tiles) eliminates
 * the crop entirely -- if the banner image is ever replaced with a
 * different exact size, update this `aspect-[...]` value to match it.
 */
export default function HomeHero({ firstName }: { firstName: string }) {
  const greeting = firstName ? `Hey there, ${firstName}.` : "Hey there.";

  return (
    <div className="rounded-2xl overflow-hidden bg-[#0A1422] border border-white/10 shadow-2xl shadow-black/40">
      {/* Phone layout */}
      <div className="md:hidden">
        <div className="relative w-full h-28 sm:h-32">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={`${ASSET}/home/home_hero_atlanta_mobile.webp`}
            alt=""
            className="absolute inset-0 w-full h-full object-cover"
            style={{ objectPosition: "68% 22%" }}
          />
        </div>
        <div className="p-4 flex flex-col gap-3">
          <div>
            <p className="eit-kicker text-gold">Test. Prevent. Treat. Connect.</p>
            <h2 className="text-2xl mt-1 text-[#F7FAFF] font-display break-words">{greeting}</h2>
          </div>
          <HomeSearchBar />
        </div>
      </div>

      {/* Tablet/desktop layout */}
      <div className="hidden md:block relative aspect-[1600/586]">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={`${ASSET}/home/home_hero_atlanta_banner.webp`}
          alt=""
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="relative z-10 flex flex-col justify-center gap-3 h-full px-8 py-6 max-w-md">
          <div>
            <p className="eit-kicker text-gold">Test. Prevent. Treat. Connect.</p>
            <h2 className="text-4xl mt-1 text-[#F7FAFF] font-display break-words">{greeting}</h2>
            <p className="text-sm text-[#B3C2D4] mt-2">
              Let&apos;s make a healthier, stronger Atlanta together.
            </p>
          </div>
          <HomeSearchBar />
        </div>
      </div>
    </div>
  );
}
