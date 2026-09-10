import Nav from "@/components/Nav";
import BottomNav from "@/components/BottomNav";
import ToddLauncher from "@/components/ToddLauncher";
import WatchHero from "@/components/WatchHero";
import { ContentRow, ComingSoonCard, SupportModuleCard } from "@/components/WatchRows";
import { VideoCard } from "@/components/WatchPlayer";
import { WATCH_VIDEOS } from "@/lib/watch-data";

export const metadata = {
  title: "PrEP TV | END IT ATLANTA",
  description: "Real videos from END IT ATLANTA -- education, stories, and community.",
};

/**
 * Streaming-app layout: hero banner up top, horizontal content rows below.
 * We only have 3 real videos and no watch-history/category data today, so
 * per Henderson's direction (2026-09-10): every row renders, but any row
 * with nothing real behind it shows an honest "Coming Soon" placeholder
 * instead of fake thumbnails pretending to be real content. He'll supply
 * real thumbnails/videos to swap in per row as they're ready.
 */
export default function WatchPage() {
  return (
    <>
      <Nav />
      <main className="eit-app flex-1 pb-24">
        <div className="flex flex-col gap-7 pt-3">
          <div className="px-4">
            <WatchHero />
          </div>

          <ContentRow title="Continue Watching">
            <ComingSoonCard label="Continue Watching" />
            <ComingSoonCard label="Continue Watching" />
            <ComingSoonCard label="Continue Watching" />
          </ContentRow>

          <ContentRow title="Latest From END IT ATLANTA" id="latest-videos">
            {WATCH_VIDEOS.map((video) => (
              <div key={video.id} className="shrink-0 snap-start w-40">
                <VideoCard video={video} />
              </div>
            ))}
          </ContentRow>

          <ContentRow title="PrEP TV Originals">
            <ComingSoonCard label="PrEP TV Originals" />
            <ComingSoonCard label="PrEP TV Originals" />
            <ComingSoonCard label="PrEP TV Originals" />
          </ContentRow>

          <ContentRow title="Todd Explains">
            <ComingSoonCard label="Todd Explains" />
            <ComingSoonCard label="Todd Explains" />
            <ComingSoonCard label="Todd Explains" />
          </ContentRow>

          <ContentRow title="PSAs & Shorts">
            <ComingSoonCard label="PSAs & Shorts" />
            <ComingSoonCard label="PSAs & Shorts" />
            <ComingSoonCard label="PSAs & Shorts" />
          </ContentRow>

          <ContentRow title="Community Stories">
            <ComingSoonCard label="Community Stories" />
            <ComingSoonCard label="Community Stories" />
            <ComingSoonCard label="Community Stories" />
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
