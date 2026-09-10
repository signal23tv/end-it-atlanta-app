import Nav from "@/components/Nav";
import BottomNav from "@/components/BottomNav";
import ToddLauncher from "@/components/ToddLauncher";
import NowPlayingSection from "@/components/NowPlayingSection";
import { ContentRow, ClinicOriginalCard, SupportModuleCard } from "@/components/WatchRows";
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
 * entirely until there's real content behind them. "PrEP TV Originals"
 * keeps exactly one honest, well-styled tile for "The Clinic" (real key
 * art, genuinely in production) instead of a giant duplicate hero lower
 * on the page.
 */
export default function WatchPage() {
  return (
    <>
      <Nav />
      <main className="eit-app flex-1 pb-24">
        <div className="flex flex-col gap-7 pt-3">
          <NowPlayingSection videos={WATCH_VIDEOS} />

          <ContentRow title="PrEP TV Originals">
            <ClinicOriginalCard />
          </ContentRow>

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
