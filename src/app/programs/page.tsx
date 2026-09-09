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
const ICON = "/assets/endit/v1/icons";

const CATEGORIES: { label: string; body: string; icon: string }[] = [
  { label: "High Schools", body: "Education and empowerment for students.", icon: `${ICON}/graduation.svg` },
  { label: "Colleges", body: "Student ambassador programs.", icon: `${ICON}/building.svg` },
  { label: "Barbershops", body: "Meeting people where conversations already happen.", icon: `${ICON}/scissors.svg` },
  { label: "Salons", body: "Beauty, health, and confidence, together.", icon: `${ICON}/sparkle.svg` },
  { label: "Churches", body: "Faith, health, and community leadership.", icon: `${ICON}/faith.svg` },
  { label: "Nightlife", body: "Party safe, play smart.", icon: `${ICON}/music.svg` },
  { label: "Homeless Outreach", body: "Food, clothing, testing, and support.", icon: `${ICON}/hand-heart.svg` },
  { label: "Reentry & Halfway Houses", body: "A second chance starts with health.", icon: `${ICON}/home.svg` },
];

export default function ProgramsPage() {
  return (
    <>
      <Nav />
      <main className="eit-app flex-1 pb-24">
        <div className="eit-shell flex flex-col gap-5">
          <div
            className="rounded-2xl p-5"
            style={{
              backgroundImage:
                "linear-gradient(180deg, rgb(6 11 19 / .55), rgb(6 11 19 / .92)), url(/assets/endit/v1/programs/community-care.webp)",
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          >
            <h1 className="text-3xl" style={{ fontFamily: "var(--eit-font-display)" }}>
              Our Programs
            </h1>
            <p className="text-sm eit-muted mt-1">Meeting people where they are.</p>
          </div>

          <div className="rounded-lg border border-gold/30 bg-gold/5 p-4 text-sm text-paper/80">
            These are the community areas we&apos;re working to reach. Specific program
            schedules and partner details aren&apos;t published yet -- reach out through Get
            Connected and we&apos;ll point you to what&apos;s actually available right now.
          </div>

          <div className="grid gap-3">
            {CATEGORIES.map((c) => (
              <div key={c.label} className="eit-menu-row eit-card">
                <span className="eit-menu-icon">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={c.icon} alt="" width={20} height={20} />
                </span>
                <span>
                  <strong>{c.label}</strong>
                  <small>{c.body}</small>
                </span>
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
