import Nav from "@/components/Nav";
import BottomNav from "@/components/BottomNav";
import ToddLauncher from "@/components/ToddLauncher";
import NowPlayingSection from "@/components/NowPlayingSection";
import { ClinicOriginalCard, SupportModuleCard } from "@/components/WatchRows";
import { WATCH_VIDEOS } from "@/lib/watch-data";

export const metadata = {
  title: "PrEP TV | END IT ATLANTA",
  description: "Real videos from END IT ATLANTA -- education, stories, and community.",
};

/**
 * Streaming-app layout (redesigned 2026-09-10 per Henderson's structure
 * spec). One player, pinned at the top, is the whole point of the page --
 * everything else is real playlist rows underneath it, never a second
 * large hero/promo block competing with the player.
 *
 * We only have 3 real videos and no watch-history/category data today.
 * Earlier drafts filled the empty rows ("Continue Watching," "Todd
 * Explains," "PSAs & Shorts," "Community Stories") with 3x repeated
 * dashed "Coming Soon" placeholder tiles each -- Henderson's spec calls
 * this out directly ("repeated coming soon cards feel unfinished... do
 * not show multiple repetitive dead tiles"). Those rows are hidden
 * entirely until there's real content behind them.
 *
 * "PrEP TV Originals" is a full-width card for "The Clinic" (real key
 * art, genuinely in production), directly under the player -- not
 * wrapped in a horizontally-scrolling row anymore. Henderson caught
 * that treatment live (2026-09-10): shrinking it to a small thumbnail
 * inside a scroll row made it disappear visually; he wants it prominent
 * near the top of the page. Still just one honest card, though -- not a
 * second hero with its own Play/More Info buttons competing with the
 * real player above it.
 */
export default function WatchPage() {
  return (
    <>
      <Nav />
      <main className="eit-app flex-1 pb-24">
        <div className="flex flex-col gap-7 pt-3">
          <NowPlayingSection videos={WATCH_VIDEOS} />

          <div className="flex flex-col gap-2.5 px-4">
            <p className="text-sm font-bold text-[#F7FAFF]">PrEP TV Originals</p>
            <ClinicOriginalCard />
          </div>

          <div className="flex flex-col gap-2.5 px-4">
            <p className="text-sm font-bold text-[#F7FAFF]">Because You Care About Your Health</p>
            <div className="flex flex-col gap-2.5">
              <SupportModuleCard
                href="/todd"
                icon="chat.svg"
                title="Ask Todd"
                description="Your real-time PrEP & sexual health assistant"
              />
              <SupportModuleCard
                href="/get-connected"
                icon="hospital.svg"
                title="Find a Clinic"
                description="Real testing and PrEP locations near you"
              />
              <SupportModuleCard
                href="/prep-basics"
                icon="graduation.svg"
                title="Learn PrEP Basics"
                description="The facts, sourced from CDC and HIV.gov"
              />
            </div>
          </div>
        </div>
      </main>
      <ToddLauncher />
      <BottomNav />
    </>
  );
}
