import Nav from "@/components/Nav";
import BottomNav from "@/components/BottomNav";
import ToddLauncher from "@/components/ToddLauncher";

export const metadata = {
  title: "About / Mission | END IT ATLANTA",
  description:
    "Who END IT ATLANTA is and what we're working toward: a healthier, stronger Atlanta.",
};

const VALUES: { label: string; body: string; icon: React.ReactNode }[] = [
  {
    label: "People",
    body: "Every person deserves accurate information and to be met where they are, without judgment.",
    icon: (
      <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth={2}>
        <path d="M12 21s-7-4.5-9-8.5C1.4 8.5 3 5 6.5 5c1.9 0 3.3 1 4 2.3.7 -1.3 2.1-2.3 4-2.3C18 5 19.6 8.5 18 12.5 16 16.5 12 21 12 21Z" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    label: "Community",
    body: "We work alongside Atlanta's existing public-health partners rather than around them.",
    icon: (
      <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth={2}>
        <circle cx="8" cy="9" r="3" />
        <circle cx="17" cy="9" r="3" />
        <path d="M2 20c0-3 2.7-5 6-5s6 2 6 5M12 20c0-2.8 2.4-4.6 5-4.6s5 1.8 5 4.6" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    label: "Change",
    body: "One conversation, one connection, one person at a time -- that's how ending HIV in Atlanta actually happens.",
    icon: (
      <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth={2}>
        <path d="M4 12h16M14 6l6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
];

export default function AboutPage() {
  return (
    <>
      <Nav />
      <main className="flex-1 bg-black text-paper pb-24">
        <div className="max-w-2xl mx-auto px-4 py-8 flex flex-col gap-8">
          <div>
            <p className="text-gold font-bold uppercase tracking-wide text-xs mb-2">Our Mission</p>
            <h1 className="font-display text-4xl mb-4">
              A HEALTHIER ATLANTA.
              <br />A STRONGER TOMORROW.
            </h1>
            <p className="text-paper/80 mb-3">
              End It Atlanta is a community-driven initiative connecting Atlantans with HIV
              testing, PrEP education, and prevention resources available through the Fulton
              County Board of Health.
            </p>
            <p className="text-paper/80">
              We meet people where they are -- just as they are -- and help connect them with
              the information, programs, and support needed to take control of their health.
            </p>
          </div>

          <blockquote className="border-l-4 border-gold pl-5 py-1">
            <p className="font-display text-2xl leading-tight text-paper">
              &ldquo;Ending HIV everywhere begins by taking action somewhere.&rdquo;
            </p>
          </blockquote>

          <div className="grid gap-4">
            {VALUES.map((v) => (
              <div key={v.label} className="flex gap-3 rounded-xl border border-white/10 p-4">
                <div className="w-9 h-9 shrink-0 rounded-full bg-gold/15 text-gold flex items-center justify-center">
                  {v.icon}
                </div>
                <div>
                  <p className="font-bold text-sm">{v.label}</p>
                  <p className="text-sm text-muted">{v.body}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="border-t border-white/10 pt-6">
            <p className="text-xs text-muted uppercase tracking-wide mb-2">A note on scope</p>
            <p className="text-sm text-paper/70">
              End It Atlanta is a community outreach initiative and does not provide medical
              care. Medical services, eligibility, and treatment recommendations are determined
              by qualified healthcare providers and participating organizations.
            </p>
          </div>

          <p className="text-center text-gold font-display text-xl tracking-wide">
            TEST. PREVENT. TREAT. CONNECT.
          </p>
        </div>
      </main>
      <ToddLauncher />
      <BottomNav />
    </>
  );
}
