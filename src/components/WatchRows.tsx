import Link from "next/link";

const ASSET = "/assets/endit/v1";

/** Section wrapper: title + optional "See All", horizontally scrollable row underneath. */
export function ContentRow({
  title,
  seeAllHref,
  id,
  children,
}: {
  title: string;
  seeAllHref?: string;
  id?: string;
  children: React.ReactNode;
}) {
  return (
    <div id={id} className="flex flex-col gap-2.5">
      <div className="flex items-center justify-between px-4">
        <p className="text-sm font-bold text-[#F7FAFF]">{title}</p>
        {seeAllHref && (
          <Link href={seeAllHref} className="text-xs font-semibold text-[#98ADC7] hover:text-gold">
            See All
          </Link>
        )}
      </div>
      <div className="flex gap-3 overflow-x-auto px-4 pb-1 snap-x snap-mandatory scrollbar-none">
        {children}
      </div>
    </div>
  );
}

/**
 * Honest placeholder for a row with no real content behind it yet --
 * a clearly-labeled "Coming Soon" card, never a fake thumbnail dressed
 * up to look like a real video. Henderson will supply real thumbnails
 * to replace these per-row as real content is ready.
 */
export function ComingSoonCard({ label }: { label: string }) {
  return (
    <div
      className="shrink-0 snap-start w-36 aspect-[2/3] rounded-lg border border-dashed border-[#304055] bg-[#101A28] flex flex-col items-center justify-center gap-2 text-center px-3"
      aria-label={`${label} -- coming soon`}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={`${ASSET}/icons/clock.svg`} alt="" width={20} height={20} className="opacity-50" />
      <p className="text-[11px] font-semibold text-[#98ADC7] leading-snug">Coming Soon</p>
    </div>
  );
}

/**
 * The single real "in production" PrEP TV original -- "The Clinic." No
 * episode exists yet (key art only), so this stays one honest card, not
 * a second player-sized hero with its own Play/More Info buttons
 * competing with the real player above it.
 *
 * Henderson (2026-09-10): the earlier version of this shrank it down to
 * a small w-64 thumbnail inside a horizontally-scrolling row -- "the
 * coming soon for the clinic is suppose to be at the top of the page
 * you took that and made it a small thumbnail." Restored to a full-width
 * card, sized at `aspect-[1200/450]` (the exact real pixel ratio of the
 * saved key art, so it's zero-crop, same discipline as every other hero
 * fix this session), placed directly under the player -- prominent, but
 * still just one honest "Coming Soon" card, not a duplicate hero. The
 * key art already has "PrEP TV," "The Clinic," and "A New Original
 * Series" baked into its own pixels (left third of the image), so this
 * adds nothing on top except a small real "Coming Soon" corner ribbon,
 * to avoid duplicating text that's already in the art.
 */
export function ClinicOriginalCard() {
  return (
    <div className="relative w-full aspect-[1200/450] rounded-2xl overflow-hidden shadow-lg shadow-black/40">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={`${ASSET}/watch/the-clinic-hero.webp`}
        alt="The Clinic -- a new PrEP TV original series from END IT ATLANTA. Coming soon."
        className="absolute inset-0 w-full h-full object-cover"
      />
      <span className="absolute top-3 right-3 text-[10px] font-bold uppercase tracking-wide text-[#F7FAFF] bg-black/60 backdrop-blur-sm rounded-full px-2.5 py-1.5">
        Coming Soon
      </span>
    </div>
  );
}

/** Real, functional platform module card -- links to a real existing feature. */
export function SupportModuleCard({
  href,
  icon,
  title,
  description,
}: {
  href: string;
  icon: string;
  title: string;
  description: string;
}) {
  return (
    <Link
      href={href}
      className="flex items-center gap-3 rounded-xl border border-[#304055] bg-[#101A28] px-4 py-3.5 hover:border-gold transition-colors"
    >
      <span
        className="shrink-0 w-10 h-10 rounded-full flex items-center justify-center"
        style={{ background: "linear-gradient(135deg, var(--eit-purple), var(--eit-blue))" }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={`${ASSET}/icons/${icon}`} alt="" width={18} height={18} style={{ filter: "invert(1)" }} />
      </span>
      <span className="flex-1 min-w-0">
        <span className="block text-sm font-semibold text-[#F7FAFF]">{title}</span>
        <span className="block text-xs text-[#98ADC7]">{description}</span>
      </span>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={`${ASSET}/icons/chevron-down.svg`} alt="" width={14} height={14} className="rotate-[-90deg] opacity-60 shrink-0" />
    </Link>
  );
}
