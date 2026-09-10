import HomeSearchBar from "@/components/HomeSearchBar";

const ASSET = "/assets/endit/v1";

/**
 * Compact homepage greeting hero -- NOT a full-height takeover.
 *
 * The greeting/search are always real, live UI rendered from the current
 * signed-in user's data (`firstName` comes from the caller, which reads
 * it fresh from Supabase per request -- never hard-coded, never baked
 * into an image). The art itself carries no baked headline, tagline, or
 * search box -- the only baked text is real branded merch in the photo
 * itself ("END IT ATLANTA" embroidered on the jacket, a real chain
 * reading "GEO") -- so there's nothing for the live copy to duplicate.
 *
 * Both breakpoints use the same real source photo, `home_hero_atlanta_
 * banner.webp` (2048x768, supplied 2026-09-10 -- replaces the earlier
 * banner), just framed differently:
 * - Phone (default): a short ~112-128px art strip on top, cropped via
 *   `object-position` to keep the subject's face in frame (the strip is
 *   far shorter than the photo's native 2.667:1 ratio, so *some*
 *   vertical crop there is an intentional design choice, not a bug --
 *   the real greeting + search sit below it in the same solid dark
 *   card, never on top of the image, so there's no text-legibility
 *   concern on phone).
 * - md and up: the container is `aspect-[2048/768]` -- the exact pixel
 *   ratio of the saved file -- so the full photo always shows with zero
 *   crop (same fix already applied here once before, 2026-09-10, after
 *   a fixed-height container cropped the previous banner). The real
 *   greeting/search sit on top of the image's left side, over a real
 *   gradient scrim (not baked into the photo) that darkens just enough
 *   for the text to stay readable against the sunset sky without
 *   covering the subject on the right.
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
            src={`${ASSET}/home/home_hero_atlanta_banner.webp`}
            alt=""
            className="absolute inset-0 w-full h-full object-cover"
            style={{ objectPosition: "center 24%" }}
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
      <div className="hidden md:block relative aspect-[2048/768]">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={`${ASSET}/home/home_hero_atlanta_banner.webp`}
          alt=""
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(90deg, rgb(6 11 19 / .82) 0%, rgb(6 11 19 / .55) 32%, rgb(6 11 19 / .15) 55%, transparent 72%)",
          }}
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
