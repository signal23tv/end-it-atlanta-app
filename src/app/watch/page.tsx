import Nav from "@/components/Nav";
import BottomNav from "@/components/BottomNav";
import ToddLauncher from "@/components/ToddLauncher";
import { FeaturedVideo, VideoCard } from "@/components/WatchPlayer";
import { WATCH_VIDEOS } from "@/lib/watch-data";

export const metadata = {
  title: "PrEP TV | END IT ATLANTA",
  description: "Real videos from END IT ATLANTA -- education, stories, and community.",
};

export default function WatchPage() {
  const [featured, ...rest] = WATCH_VIDEOS;

  return (
    <>
      <Nav />
      <main className="eit-app flex-1 pb-24">
        <div className="eit-shell flex flex-col gap-6">
          <div className="text-center pt-2">
            <h1
              className="text-4xl sm:text-5xl font-display tracking-wide"
              style={{
                backgroundImage: "linear-gradient(90deg, var(--eit-purple), var(--eit-blue))",
                WebkitBackgroundClip: "text",
                backgroundClip: "text",
                color: "transparent",
              }}
            >
              PrEP TV
            </h1>
            <p
              className="text-xs font-bold uppercase tracking-[0.2em] mt-1"
              style={{
                backgroundImage: "linear-gradient(90deg, var(--eit-blue), var(--eit-pink))",
                WebkitBackgroundClip: "text",
                backgroundClip: "text",
                color: "transparent",
              }}
            >
              Educate. Entertain. Empower.
            </p>
          </div>

          {featured && (
            <div>
              <p className="eit-kicker mb-2">Featured</p>
              <FeaturedVideo video={featured} />
            </div>
          )}

          {rest.length > 0 && (
            <div>
              <p className="eit-kicker mb-3">More from END IT ATLANTA</p>
              <div className="grid grid-cols-2 gap-4">
                {rest.map((video) => (
                  <VideoCard key={video.id} video={video} />
                ))}
              </div>
            </div>
          )}
        </div>
      </main>
      <ToddLauncher />
      <BottomNav />
    </>
  );
}
