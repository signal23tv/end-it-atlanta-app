import Nav from "@/components/Nav";
import BottomNav from "@/components/BottomNav";

export default function WatchPage() {
  return (
    <>
      <Nav />
      <main className="flex-1 bg-black text-paper pb-24">
        <div className="max-w-2xl mx-auto px-4 py-16 flex flex-col items-center text-center gap-4">
          <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center">
            <svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="currentColor" strokeWidth={2} className="text-gold">
              <rect x="3" y="5" width="18" height="13" rx="2" />
              <path d="M10 9.5v4l3.5-2-3.5-2Z" fill="currentColor" stroke="none" />
            </svg>
          </div>
          <h1 className="font-display text-3xl">PrEP TV</h1>
          <p className="text-muted max-w-sm">
            Video content, episodes, and short-form education pieces aren&apos;t built yet.
            This is honestly a placeholder — nothing here is faked to look finished.
          </p>
          <p className="text-xs text-muted">Planned for a later phase of the build.</p>
        </div>
      </main>
      <BottomNav />
    </>
  );
}
