import type { Metadata } from "next";
import Nav from "@/components/Nav";
import BottomNav from "@/components/BottomNav";
import ToddLauncher from "@/components/ToddLauncher";
import EducationBoardCard from "@/components/EducationBoardCard";
import TrackedLink from "@/components/TrackedLink";
import {
  FULTON_LOCATIONS,
  FULTON_BOARD_OF_HEALTH,
  telHref,
  mapsUrl,
} from "@/lib/resources-data";
import { EDUCATION_BOARDS, MYTH_FACTS, LAST_MEDICALLY_REVIEWED } from "@/lib/education-data";

export const metadata: Metadata = {
  title: "Learning Lab | HIV & PrEP Education | END IT ATLANTA",
  description:
    "Clear, sourced facts about HIV, AIDS, PrEP, PEP, U=U, and testing — plus Atlanta-area resources to take the next step.",
};

export default function LearningLabPage() {
  return (
    <>
      <Nav />
      <main id="learning-lab" className="eit-app flex-1 pb-24">
        {/* INTRO */}
        <section className="py-10 md:py-14 eit-shell">
          <p className="text-red font-bold uppercase tracking-wide text-sm mb-2">
            Learning Lab
          </p>
          <h1 className="font-display text-4xl md:text-5xl mb-4 text-[#F7FAFF]">
            KNOW THE FACTS. KNOW YOUR OPTIONS.
          </h1>
          <p className="mb-2 text-[#B3C2D4]">
            Eight short, sourced boards covering HIV, AIDS, PrEP, PEP, ART, U=U, and testing
            — written for real conversations, not jargon.
          </p>
          <p className="text-xs text-gold-soft bg-gold/10 border border-gold/40 rounded-md px-3 py-2 inline-block">
            Medical review status: {LAST_MEDICALLY_REVIEWED}. Every fact links to its HIV.gov
            or CDC source below.
          </p>
        </section>

        {/* RESOURCE ROW */}
        <section className="pb-8 eit-shell">
          <h2 className="font-display text-2xl mb-4 text-[#F7FAFF]">GET CONNECTED NEAR YOU</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            <article className="rounded-xl border border-gold p-5 bg-gold/10">
              <h3 className="font-display text-lg text-[#F7FAFF]">{FULTON_BOARD_OF_HEALTH.name}</h3>
              <p className="text-sm text-[#98ADC7] mt-1">Multiple Atlanta-area locations — see below</p>
              <div className="flex flex-wrap gap-2 mt-4">
                <a
                  href={telHref(FULTON_BOARD_OF_HEALTH.generalPhone)}
                  className="bg-red hover:bg-red-dark text-paper text-xs font-bold uppercase tracking-wide rounded-md px-3 py-2"
                >
                  Call • {FULTON_BOARD_OF_HEALTH.generalPhone}
                </a>
                <TrackedLink
                  href={FULTON_BOARD_OF_HEALTH.locationsPage}
                  eventType="official_site_clicked"
                  providerId="fulton_boh"
                  className="border border-gold text-[#F7FAFF] text-xs font-bold uppercase tracking-wide rounded-md px-3 py-2 inline-block"
                >
                  All Locations
                </TrackedLink>
              </div>
            </article>

            {FULTON_LOCATIONS.map((loc) => (
              <article key={loc.id} className="rounded-xl border border-[#304055] p-5 bg-[#101A28]">
                <h3 className="font-display text-lg text-[#F7FAFF]">{loc.name}</h3>
                <p className="text-sm text-[#98ADC7] mt-1">{loc.address}</p>
                <div className="flex flex-wrap gap-2 mt-4">
                  <a
                    href={telHref(loc.phone)}
                    className="bg-red hover:bg-red-dark text-paper text-xs font-bold uppercase tracking-wide rounded-md px-3 py-2"
                  >
                    Call
                  </a>
                  <a
                    href={mapsUrl(loc.address)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="border border-gold text-[#F7FAFF] text-xs font-bold uppercase tracking-wide rounded-md px-3 py-2"
                  >
                    Directions
                  </a>
                  <TrackedLink
                    href={loc.officialUrl}
                    eventType="official_site_clicked"
                    providerId={loc.id}
                    className="border border-gold text-[#F7FAFF] text-xs font-bold uppercase tracking-wide rounded-md px-3 py-2 inline-block"
                  >
                    Official Info
                  </TrackedLink>
                </div>
              </article>
            ))}
          </div>
        </section>

        {/* EDUCATION BOARDS */}
        <section className="pb-10 eit-shell">
          <div className="flex flex-col gap-6">
            {EDUCATION_BOARDS.map((board) => (
              <EducationBoardCard key={board.id} board={board} />
            ))}
          </div>
        </section>

        {/* MYTH VS FACT */}
        <section id="myth-vs-fact" className="py-10 scroll-mt-20 eit-shell">
          <h2 className="font-display text-3xl md:text-4xl mb-6 text-[#F7FAFF]">MYTH VS. FACT</h2>
          <div className="flex flex-col gap-4">
            {MYTH_FACTS.map((mf) => (
              <div key={mf.myth} className="grid sm:grid-cols-2 gap-3 border-b border-[#304055] pb-4">
                <p className="text-sm text-[#F7FAFF]">
                  <span className="text-red font-bold uppercase text-xs block mb-1">Myth</span>
                  {mf.myth}
                </p>
                <p className="text-sm text-[#F7FAFF]">
                  <span className="text-gold font-bold uppercase text-xs block mb-1">Fact</span>
                  {mf.fact}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* TO ACTION */}
        <section className="py-12 text-center eit-shell">
          <h2 className="font-display text-3xl md:text-4xl mb-4 text-[#F7FAFF]">READY FOR YOUR NEXT STEP?</h2>
          <p className="mb-6 text-[#B3C2D4]">
            Get connected with testing, PrEP, or a real person who can help — no personal
            information required to browse.
          </p>
          <a
            href="/get-connected"
            className="inline-block bg-red hover:bg-red-dark text-paper font-bold uppercase tracking-wide rounded-md px-6 py-3"
          >
            Get Connected
          </a>
        </section>
      </main>
      <ToddLauncher />
      <BottomNav />
    </>
  );
}
