import Nav from "@/components/Nav";
import BottomNav from "@/components/BottomNav";
import ToddLauncher from "@/components/ToddLauncher";
import { WATCH_VIDEOS } from "@/lib/watch-data";

export const metadata = {
  title: "Watch | END IT ATLANTA",
  description: "Real videos from END IT ATLANTA -- education, stories, and community.",
};

export default function WatchPage() {
  return (
    <>
      <Nav />
      <main className="eit-app flex-1 pb-24">
        <div className="eit-shell flex flex-col gap-4">
          <div
            className="rounded-2xl p-5"
            style={{
              backgroundImage:
                "linear-gradient(180deg, rgb(6 11 19 / .55), rgb(6 11 19 / .92)), url(/assets/endit/v1/backgrounds/atmosphere-blue.svg)",
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          >
            <h1 className="text-3xl" style={{ fontFamily: "var(--eit-font-display)" }}>
              Watch
            </h1>
            <p className="text-sm eit-muted mt-1">
              Real videos from END IT ATLANTA -- education, stories, and community.
            </p>
          </div>

          <div className="flex flex-col gap-5">
            {WATCH_VIDEOS.map((video) => (
              <div
                key={video.id}
                className="rounded-xl overflow-hidden border border-[#304055] bg-[#101A28]"
              >
                <div className="relative w-full aspect-video bg-black">
                  <iframe
                    src={`https://iframe.videodelivery.net/${video.streamId}`}
                    className="absolute inset-0 w-full h-full border-0"
                    allow="accelerometer; gyroscope; autoplay; encrypted-media; picture-in-picture;"
                    allowFullScreen
                    loading="lazy"
                    title={video.title}
                  />
                </div>
                <div className="p-4">
                  <p className="font-display text-xl text-[#F7FAFF]">{video.title}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
      <ToddLauncher />
      <BottomNav />
    </>
  );
}
