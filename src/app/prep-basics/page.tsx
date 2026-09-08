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
const ITEMS: { label: string; sub: string; href: string; icon: string }[] = [
  { label: "What is PrEP?", sub: "The basics, in plain language.", href: "/learning-lab#what-is-prep", icon: "❔" },
  { label: "How PrEP Works", sub: "What it does in the body.", href: "/learning-lab#how-prep-works", icon: "🛡️" },
  { label: "PrEP vs. PEP vs. ART", sub: "Three tools, three different jobs.", href: "/learning-lab#prep-pep-art", icon: "⚖️" },
  { label: "Testing & PrEP", sub: "Why testing comes first, and keeps mattering.", href: "/learning-lab#testing", icon: "🧪" },
  { label: "Undetectable = Untransmittable", sub: "What U=U actually means.", href: "/learning-lab#u-equals-u", icon: "💊" },
  { label: "HIV & AIDS Basics", sub: "They're not the same thing.", href: "/learning-lab#what-is-hiv-aids", icon: "📘" },
  { label: "How HIV Is (and Isn't) Transmitted", sub: "Know the facts, drop the stigma.", href: "/learning-lab#how-transmitted", icon: "🔍" },
  { label: "Myths vs. Facts", sub: "Common misconceptions, corrected.", href: "/learning-lab#myth-vs-fact", icon: "✅" },
];

export default function PrepBasicsPage() {
  return (
    <>
      <Nav />
      <main className="flex-1 bg-black text-paper pb-24">
        <div className="max-w-2xl mx-auto px-4 py-8 flex flex-col gap-5">
          <div>
            <p className="text-gold font-bold uppercase tracking-wide text-xs mb-1">
              Real Information. Real Protection.
            </p>
            <h1 className="font-display text-3xl">PrEP Basics</h1>
            <p className="text-sm text-muted mt-1">
              Every fact here is sourced from HIV.gov or the CDC -- each row links to the full,
              cited version in the Learning Lab.
            </p>
          </div>

          <div className="flex flex-col divide-y divide-white/10 rounded-xl border border-white/10 overflow-hidden">
            {ITEMS.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="flex items-center gap-4 px-4 py-4 hover:bg-white/5 transition"
              >
                <span className="text-2xl">{item.icon}</span>
                <span className="flex-1">
                  <span className="block font-semibold text-sm">{item.label}</span>
                  <span className="block text-xs text-muted">{item.sub}</span>
                </span>
                <span className="text-muted">›</span>
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
