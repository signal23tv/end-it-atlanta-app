import Link from "next/link";
import Nav from "@/components/Nav";
import BottomNav from "@/components/BottomNav";
import ToddLauncher from "@/components/ToddLauncher";

/**
 * Icon-menu entry point over the real, sourced content already in
 * /learning-lab (lib/education-data.ts). Deliberately does not
 * duplicate the education copy -- each row deep-links to the matching
 * board's real, cited content instead of re-summarizing it, so there's
 * only one place that content can drift out of date.
 */
const ASSET = "/assets/endit/v1/icons";

const ITEMS: { label: string; sub: string; href: string; icon: string }[] = [
  { label: "What is PrEP?", sub: "The basics, in plain language.", href: "/learning-lab#what-is-prep", icon: `${ASSET}/help.svg` },
  { label: "How PrEP Works", sub: "What it does in the body.", href: "/learning-lab#how-prep-works", icon: `${ASSET}/shield.svg` },
  { label: "PrEP vs. PEP vs. ART", sub: "Three tools, three different jobs.", href: "/learning-lab#prep-pep-art", icon: `${ASSET}/chart.svg` },
  { label: "Testing & PrEP", sub: "Why testing comes first, and keeps mattering.", href: "/learning-lab#testing", icon: `${ASSET}/science.svg` },
  { label: "Undetectable = Untransmittable", sub: "What U=U actually means.", href: "/learning-lab#u-equals-u", icon: `${ASSET}/pill.svg` },
  { label: "HIV & AIDS Basics", sub: "They're not the same thing.", href: "/learning-lab#what-is-hiv-aids", icon: `${ASSET}/book.svg` },
  { label: "How HIV Is (and Isn't) Transmitted", sub: "Know the facts, drop the stigma.", href: "/learning-lab#how-transmitted", icon: `${ASSET}/search.svg` },
  { label: "Myths vs. Facts", sub: "Common misconceptions, corrected.", href: "/learning-lab#myth-vs-fact", icon: `${ASSET}/check-circle.svg` },
];

export default function PrepBasicsPage() {
  return (
    <>
      <Nav />
      <main className="eit-app flex-1 pb-24">
        <div className="eit-shell flex flex-col gap-5">
          <div
            className="rounded-2xl p-5"
            style={{
              backgroundImage:
                "linear-gradient(180deg, rgb(6 11 19 / .55), rgb(6 11 19 / .92)), url(/assets/endit/v1/backgrounds/atmosphere-blue.svg)",
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          >
            <p className="text-gold font-bold uppercase tracking-wide text-xs mb-1">
              Real Information. Real Protection.
            </p>
            <h1 className="font-display text-3xl">PrEP Basics</h1>
            <p className="text-sm eit-muted mt-1">
              Every fact here is sourced from HIV.gov or the CDC -- each row links to the full,
              cited version in the Learning Lab.
            </p>
          </div>

          <div className="flex flex-col divide-y divide-[#304055] rounded-xl border border-[#304055] overflow-hidden">
            {ITEMS.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="flex items-center gap-4 px-4 py-4 bg-[#101A28] hover:bg-[#142133] transition-colors"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={item.icon} alt="" width={20} height={20} className="shrink-0" />
                <span className="flex-1">
                  <span className="block font-semibold text-sm text-[#F7FAFF]">{item.label}</span>
                  <span className="block text-xs text-[#98ADC7]">{item.sub}</span>
                </span>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={`${ASSET}/chevron-left.svg`}
                  alt=""
                  width={16}
                  height={16}
                  style={{ transform: "rotate(180deg)" }}
                  className="text-[#98ADC7]"
                />
              </Link>
            ))}
          </div>

          <Link
            href="/get-connected?service=prep"
            className="text-center bg-red hover:bg-red-dark font-bold uppercase tracking-wide rounded-md px-6 py-3 transition-colors"
          >
            Find PrEP Near Me
          </Link>
        </div>
      </main>
      <ToddLauncher />
      <BottomNav />
    </>
  );
}
