import Link from "next/link";
import Image from "next/image";
import { createClient } from "@/lib/supabase/server";
import MarketingHeader from "@/components/MarketingHeader";
import SiteFooter from "@/components/SiteFooter";

export default async function Home() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <>
      <MarketingHeader />

      <main className="flex-1 bg-paper text-black">
        {/* SPLASH-STYLE INTRO */}
        <section
          aria-label="END IT ATLANTA"
          className="relative bg-black text-paper overflow-hidden flex flex-col items-center justify-center text-center px-4 py-20 md:py-28"
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/graphics/atlanta-skyline.svg"
            alt=""
            className="absolute bottom-0 left-0 w-full h-auto opacity-30"
          />
          <div
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(180deg, rgba(7,7,7,.55), rgba(7,7,7,.85) 60%, #070707)",
            }}
          />
          <div className="relative z-10 flex flex-col items-center gap-4">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/assets/endit/v1/brand/endit-brush-wordmark.webp"
              alt="END IT ATLANTA"
              className="w-56 md:w-72 h-auto"
            />
            <p className="text-gold text-sm md:text-base font-bold uppercase tracking-[0.3em]">
              Test. Prevent. Treat. Connect.
            </p>
            <p className="text-muted text-sm max-w-xs mt-1">
              A healthier Atlanta. A stronger tomorrow.
            </p>

            <div className="mt-6 flex flex-wrap justify-center gap-3">
              {user ? (
                <Link
                  href="/feed"
                  className="bg-red hover:bg-red-dark font-bold uppercase tracking-wide rounded-md px-6 py-3 transition-colors"
                >
                  Go to Your Feed
                </Link>
              ) : (
                <Link
                  href="/join/organic"
                  className="bg-red hover:bg-red-dark font-bold uppercase tracking-wide rounded-md px-6 py-3 transition-colors"
                >
                  Get Started
                </Link>
              )}
              {!user && (
                <Link
                  href="/login"
                  className="border border-gold text-gold hover:bg-gold hover:text-black font-bold uppercase tracking-wide rounded-md px-6 py-3 transition-colors"
                >
                  Sign In
                </Link>
              )}
            </div>
          </div>
        </section>

        {/* REAL PEOPLE. REAL CONVERSATIONS. REAL CHANGE. */}
        <section aria-label="What we help you do" className="bg-black text-paper py-16 md:py-20">
          <div className="max-w-3xl mx-auto px-4">
            <h2 className="font-display text-3xl md:text-4xl leading-[0.95] text-center mb-10">
              REAL PEOPLE.
              <br />
              REAL CONVERSATIONS.
              <br />
              REAL CHANGE.
            </h2>
            <div className="grid sm:grid-cols-2 gap-5">
              {(
                [
                  {
                    label: "TEST",
                    body: "Know your status.",
                    icon: "science",
                    accent: "bg-blue-500/15 text-blue-300",
                  },
                  {
                    label: "PREVENT",
                    body: "Explore your options.",
                    icon: "pill",
                    accent: "bg-pink-500/15 text-pink-300",
                  },
                  {
                    label: "TREAT",
                    body: "Find the care you need.",
                    icon: "hospital",
                    accent: "bg-gold/15 text-gold",
                  },
                  {
                    label: "CONNECT",
                    body: "Be part of the movement.",
                    icon: "users",
                    accent: "bg-purple-500/15 text-purple-300",
                  },
                ] as const
              ).map((s) => (
                <div key={s.label} className="flex items-center gap-4">
                  <span
                    className={`w-11 h-11 shrink-0 rounded-full flex items-center justify-center ${s.accent}`}
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={`/assets/endit/v1/icons/${s.icon}.svg`}
                      alt=""
                      width={20}
                      height={20}
                    />
                  </span>
                  <div>
                    <p className="font-display text-lg tracking-wide">{s.label}</p>
                    <p className="text-muted text-sm">{s.body}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* TRUST BAR */}
        <div className="bg-gold text-black text-center py-3 text-xs md:text-sm font-bold uppercase tracking-wide">
          Confidential Resources • Testing • PrEP Education • Community Connection
        </div>

        {/* MISSION */}
        <section id="about" className="py-16 md:py-24">
          <div className="max-w-6xl mx-auto px-4 grid md:grid-cols-2 gap-12">
            <div>
              <p className="text-red font-bold uppercase tracking-wide text-sm mb-2">
                Our Mission
              </p>
              <h2 className="font-display text-4xl md:text-5xl mb-4">IT STARTS HERE.</h2>
              <p className="mb-4">
                End It Atlanta is a community-driven initiative connecting Atlantans with HIV
                testing, PrEP education, and prevention resources available through the Fulton
                County Board of Health.
              </p>
              <p>
                We meet people where they are—just as they are—and help connect them with the
                information, programs, and support needed to take control of their health.
              </p>
            </div>
            <div className="border-l-4 border-gold pl-6 flex items-center">
              <p className="font-display text-2xl md:text-3xl leading-tight">
                &ldquo;Ending HIV everywhere begins by taking action somewhere.&rdquo;
              </p>
            </div>
          </div>
        </section>

        {/* HOW IT WORKS */}
        <section id="how-it-works" className="py-16 md:py-24 bg-black text-paper">
          <div className="max-w-6xl mx-auto px-4">
            <p className="text-gold font-bold uppercase tracking-wide text-sm mb-2">
              How It Works
            </p>
            <h2 className="font-display text-4xl md:text-5xl mb-10">
              YOUR NEXT STEP CAN CHANGE EVERYTHING.
            </h2>

            <div className="grid md:grid-cols-3 gap-8">
              <div>
                <span className="text-gold font-display text-3xl">01</span>
                <h3 className="font-display text-2xl mt-2 mb-2">KNOW YOUR STATUS</h3>
                <p className="text-muted">
                  Get connected with confidential HIV testing and learn where you currently
                  stand.
                </p>
              </div>
              <div>
                <span className="text-gold font-display text-3xl">02</span>
                <h3 className="font-display text-2xl mt-2 mb-2">KNOW YOUR OPTIONS</h3>
                <p className="text-muted">
                  Speak with a qualified healthcare professional about PrEP and other
                  HIV-prevention options.
                </p>
              </div>
              <div>
                <span className="text-gold font-display text-3xl">03</span>
                <h3 className="font-display text-2xl mt-2 mb-2">GET CONNECTED</h3>
                <p className="text-muted">
                  Discover programs that may help cover appointments, medication, and ongoing
                  care regardless of your financial circumstances.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* PrEPED UP */}
        <section id="prep" className="py-16 md:py-24">
          <div className="max-w-6xl mx-auto px-4 grid md:grid-cols-2 gap-10 items-center">
            <div className="rounded-xl overflow-hidden order-2 md:order-1">
              <Image
                src="/images/preped-up-campaign.png"
                alt="Man wearing a chain necklace and an End It Atlanta tank top in front of a red brick wall"
                width={1774}
                height={887}
                loading="lazy"
                className="w-full h-auto rounded-xl"
              />
            </div>
            <div className="order-1 md:order-2">
              <h2 className="font-display text-4xl md:text-5xl mb-2">
                PrEPED UP.
                <br />
                KNOW MY STATUS.
              </h2>
              <p className="text-gold font-bold mb-4">#ENDITATLANTA</p>
              <p className="mb-6">
                PrEP is power, preparation, and control over your health. End It Atlanta is
                helping make prevention visible, confident, culturally relevant, and part of
                everyday conversation.
              </p>
              <Link
                href="/learning-lab"
                className="inline-block bg-black text-paper hover:bg-black/80 font-bold uppercase tracking-wide rounded-md px-6 py-3 transition-colors"
              >
                Connect With Resources
              </Link>
            </div>
          </div>
        </section>

        {/* EVENT */}
        <section id="events" className="py-16 md:py-24 bg-black text-paper">
          <div className="max-w-6xl mx-auto px-4 grid md:grid-cols-2 gap-10 items-center">
            <div>
              <p className="text-gold font-bold uppercase tracking-wide text-sm mb-2">
                Featured Community Event
              </p>
              <Image
                src="/graphics/crown.svg"
                alt=""
                aria-hidden="true"
                width={48}
                height={48}
                className="mb-3"
              />
              <h2 className="font-display text-4xl md:text-5xl">A NIGHT TO REIGN</h2>
              <p className="text-gold font-semibold mt-1">THE 2026 SIGNAL FEST GAY PROM</p>
              <p className="text-muted mt-3">
                An unforgettable evening of purpose, elegance, and community presented by End
                It Atlanta.
              </p>

              <ul className="mt-5 space-y-1 text-sm text-muted">
                <li>📅 Sunday, September 6, 2026</li>
                <li>🕕 6:00 PM</li>
                <li>👑 Atlanta Black Pride Weekend</li>
                <li>Atlanta, Georgia • Official venue reveal coming soon</li>
              </ul>

              <div className="mt-6 flex flex-wrap gap-3">
                <span className="bg-red/60 text-paper font-bold uppercase tracking-wide rounded-md px-6 py-3 cursor-not-allowed">
                  Details Coming Soon
                </span>
                <span className="border border-gold text-gold font-bold uppercase tracking-wide rounded-md px-6 py-3">
                  Honorees Announced August 2026
                </span>
              </div>

              <p className="mt-6 text-sm text-muted">
                Celebrating authenticity, resilience, leadership, and the people strengthening
                our community.
              </p>
            </div>
            <div className="rounded-xl overflow-hidden">
              <Image
                src="/images/night-to-reign-prom.png"
                alt="Guests in formal black-tie attire beneath an illuminated gold crown at a gala"
                width={1672}
                height={941}
                loading="lazy"
                className="w-full h-auto rounded-xl"
              />
            </div>
          </div>
        </section>

        {/* COMMUNITY CTA */}
        <section className="py-16 md:py-24">
          <div className="max-w-6xl mx-auto px-4 grid md:grid-cols-2 gap-12 items-center">
            <h2 className="font-display text-4xl md:text-6xl leading-[0.95]">
              ENDING HIV
              <br />
              TAKES ALL
              <br />
              OF US.
            </h2>

            <div>
              <ul className="space-y-4">
                <li className="flex gap-3">
                  <span className="text-red text-xl">♥</span>
                  <span>
                    <strong>GET TESTED.</strong> Know your status.
                  </span>
                </li>
                <li className="flex gap-3">
                  <span className="text-red text-xl">💬</span>
                  <span>
                    <strong>TALK ABOUT PrEP.</strong> Share the facts.
                  </span>
                </li>
                <li className="flex gap-3">
                  <span className="text-red text-xl">👑</span>
                  <span>
                    <strong>LEAD WITH PURPOSE.</strong> Be the change.
                  </span>
                </li>
                <li className="flex gap-3">
                  <span className="text-red text-xl">🤝</span>
                  <span>
                    <strong>REPLACE SHAME WITH SUPPORT.</strong> Build a stronger community.
                  </span>
                </li>
              </ul>
              <Link
                href="/join/organic"
                className="inline-block mt-8 bg-red hover:bg-red-dark font-bold uppercase tracking-wide rounded-md px-6 py-3 transition-colors"
              >
                Take the First Step
              </Link>
            </div>
          </div>
        </section>
      </main>

      <SiteFooter />
    </>
  );
}
