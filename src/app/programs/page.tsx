import Link from "next/link";
import Nav from "@/components/Nav";
import BottomNav from "@/components/BottomNav";
import ToddLauncher from "@/components/ToddLauncher";

/**
 * Honest note: these are the community categories END IT ATLANTA
 * intends to reach, not a list of confirmed running programs with
 * enrollment numbers or partner names -- none of that is verified
 * yet, so none of it is claimed here. Each card says plainly that
 * program detail is still being built out, per Section 10 (no
 * fabricated clinical/program content).
 */
const CATEGORIES: { label: string; body: string; icon: string }[] = [
  { label: "High Schools", body: "Education and empowerment for students.", icon: "🎓" },
  { label: "Colleges", body: "Student ambassador programs.", icon: "🏛️" },
  { label: "Barbershops", body: "Meeting people where conversations already happen.", icon: "💈" },
  { label: "Salons", body: "Beauty, health, and confidence, together.", icon: "💇" },
  { label: "Churches", body: "Faith, health, and community leadership.", icon: "⛪" },
  { label: "Nightlife", body: "Party safe, play smart.", icon: "🎉" },
  { label: "Homeless Outreach", body: "Food, clothing, testing, and support.", icon: "🤲" },
  { label: "Reentry & Halfway Houses", body: "A second chance starts with health.", icon: "🔑" },
];

export default function ProgramsPage() {
  return (
    <>
      <Nav />
      <main className="flex-1 bg-black text-paper pb-24">
        <div className="max-w-2xl mx-auto px-4 py-8 flex flex-col gap-5">
          <div>
            <h1 className="font-display text-3xl">Our Programs</h1>
            <p className="text-sm text-muted mt-1">Meeting people where they are.</p>
          </div>

          <div className="rounded-lg border border-gold/30 bg-gold/5 p-4 text-sm text-paper/80">
            These are the community areas we&apos;re working to reach. Specific program
            schedules and partner details aren&apos;t published yet -- reach out through Get
            Connected and we&apos;ll point you to what&apos;s actually available right now.
          </div>

          <div className="grid gap-3">
            {CATEGORIES.map((c) => (
              <div key={c.label} className="flex items-center gap-4 rounded-xl border border-white/10 p-4">
                <span className="text-2xl">{c.icon}</span>
                <div>
                  <p className="font-bold text-sm">{c.label}</p>
                  <p className="text-xs text-muted">{c.body}</p>
                </div>
              </div>
            ))}
          </div>

          <Link
            href="/get-connected"
            className="text-center bg-red hover:bg-red-dark font-bold uppercase tracking-wide rounded-md px-6 py-3 transition-colors"
          >
            Get Connected
          </Link>
        </div>
      </main>
      <ToddLauncher />
      <BottomNav />
    </>
  );
}
