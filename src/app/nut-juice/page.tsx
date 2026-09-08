import Nav from "@/components/Nav";
import BottomNav from "@/components/BottomNav";
import ToddLauncher from "@/components/ToddLauncher";
import NutJuiceWaitlistForm from "@/components/NutJuiceWaitlistForm";

export const metadata = {
  title: "Nut Juice | END IT ATLANTA",
  description: "Coming soon: sexual wellness products from END IT ATLANTA. Join the waitlist.",
};

export default function NutJuicePage() {
  return (
    <>
      <Nav />
      <main className="flex-1 bg-black text-paper pb-24">
        <div className="max-w-2xl mx-auto px-4 py-10 flex flex-col gap-6 text-center items-center">
          <p className="text-purple-300 font-bold uppercase tracking-wide text-xs">
            Coming Soon
          </p>
          <h1 className="font-display text-5xl">NUT JUICE</h1>
          <p className="text-muted max-w-sm">
            Wellness for a Healthier You. Sexual wellness products, designed to be discreet
            and effective — not built or launched yet, but real and on the way.
          </p>

          <div className="w-full max-w-sm">
            <NutJuiceWaitlistForm />
          </div>

          <div className="grid grid-cols-3 gap-4 text-xs text-muted mt-4 w-full max-w-sm">
            <div className="flex flex-col items-center gap-1">
              <span className="text-xl">🧴</span>
              Sexual Wellness
            </div>
            <div className="flex flex-col items-center gap-1">
              <span className="text-xl">🕶️</span>
              Discreet & Effective
            </div>
            <div className="flex flex-col items-center gap-1">
              <span className="text-xl">🎯</span>
              Designed for You
            </div>
          </div>
        </div>
      </main>
      <ToddLauncher />
      <BottomNav />
    </>
  );
}
