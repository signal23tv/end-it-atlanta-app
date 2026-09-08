import MarketingHeader from "@/components/MarketingHeader";
import { TODD_CONTACT, CDC_PEP_URL } from "@/lib/resources-data";

export const metadata = {
  title: "Emergency / Help | END IT ATLANTA",
  description:
    "If you're in crisis or need urgent care right now, here's real help -- no account or login required.",
};

/**
 * Intentionally public (not behind the /login gate in middleware.ts).
 * Nobody in a crisis should have to create an account first. Every
 * number and link here is a real, well-established public resource --
 * the same set used in Todd's urgent-pathway safety routing
 * (lib/todd-safety.ts) -- kept consistent rather than inventing new
 * copy for this page.
 */
export default function HelpPage() {
  return (
    <>
      <MarketingHeader />
      <main className="flex-1 bg-black text-paper">
        <div className="max-w-2xl mx-auto px-4 py-10 flex flex-col gap-6">
          <div>
            <p className="text-red font-bold uppercase tracking-wide text-xs mb-2">
              You are not alone.
            </p>
            <h1 className="font-display text-4xl mb-2">NEED HELP NOW?</h1>
            <p className="text-paper/70">
              Support is available 24/7. If any of this applies to you right now, please use
              one of the resources below rather than waiting on this website.
            </p>
          </div>

          <a
            href="tel:911"
            className="flex items-center gap-4 rounded-xl border border-red bg-red/10 p-5 hover:bg-red/20 transition"
          >
            <span className="text-2xl">🚨</span>
            <span>
              <span className="block font-bold">Report an Emergency</span>
              <span className="block text-sm text-paper/70">Call 911</span>
            </span>
          </a>

          <a
            href="tel:988"
            className="flex items-center gap-4 rounded-xl border border-white/15 p-5 hover:border-gold transition"
          >
            <span className="text-2xl">💛</span>
            <span>
              <span className="block font-bold">Suicide & Crisis Lifeline</span>
              <span className="block text-sm text-paper/70">Call or text 988, free and confidential</span>
            </span>
          </a>

          <a
            href="tel:8006564673"
            className="flex items-center gap-4 rounded-xl border border-white/15 p-5 hover:border-gold transition"
          >
            <span className="text-2xl">🤝</span>
            <span>
              <span className="block font-bold">National Sexual Assault Hotline</span>
              <span className="block text-sm text-paper/70">800-656-4673, free and confidential, any time</span>
            </span>
          </a>

          <a
            href={CDC_PEP_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-4 rounded-xl border border-white/15 p-5 hover:border-gold transition"
          >
            <span className="text-2xl">⏱️</span>
            <span>
              <span className="block font-bold">Possible HIV exposure in the last 72 hours?</span>
              <span className="block text-sm text-paper/70">
                PEP may help prevent HIV, but must start fast. Go to an ER, urgent care, or
                clinic now -- see CDC: PEP Information ↗
              </span>
            </span>
          </a>

          <a
            href={`tel:${TODD_CONTACT.phoneTel}`}
            className="flex items-center gap-4 rounded-xl border border-white/15 p-5 hover:border-gold transition"
          >
            <span className="text-2xl">💬</span>
            <span>
              <span className="block font-bold">Talk to a Real Person</span>
              <span className="block text-sm text-paper/70">
                {TODD_CONTACT.name}, {TODD_CONTACT.role} -- {TODD_CONTACT.phoneDisplay}
              </span>
            </span>
          </a>

          <p className="text-xs text-muted text-center mt-2">
            END IT ATLANTA is a community outreach initiative, not an emergency service. In a
            life-threatening situation, always call 911 first.
          </p>
        </div>
      </main>
    </>
  );
}
