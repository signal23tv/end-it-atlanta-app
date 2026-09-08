import Link from "next/link";

export default function MarketingHeader() {
  return (
    <header className="bg-black text-paper sticky top-0 z-20 border-b border-white/10">
      <div className="max-w-6xl mx-auto flex items-center justify-between gap-4 px-4 py-3">
        <Link href="/" className="font-display text-2xl tracking-wide shrink-0">
          END IT ATLANTA
        </Link>

        <nav
          aria-label="Primary"
          className="hidden md:flex items-center gap-5 text-sm font-semibold uppercase tracking-wide"
        >
          <Link href="/#about" className="hover:text-gold">
            About
          </Link>
          <Link href="/#how-it-works" className="hover:text-gold">
            Get Tested
          </Link>
          <Link href="/#prep" className="hover:text-gold">
            Get PrEP
          </Link>
          <Link href="/#events" className="hover:text-gold">
            Events
          </Link>
          <Link href="/learning-lab" className="hover:text-gold">
            Resources
          </Link>
          <Link href="/#contact" className="hover:text-gold">
            Contact
          </Link>
        </nav>

        <div className="flex items-center gap-3 shrink-0">
          <Link
            href="/login"
            className="hidden sm:inline text-sm font-semibold hover:text-gold"
          >
            Log In
          </Link>
          <Link
            href="/get-connected"
            className="bg-red hover:bg-red-dark text-xs sm:text-sm font-bold uppercase tracking-wide rounded-md px-3 sm:px-4 py-2 transition-colors"
          >
            Take the First Step
          </Link>
        </div>
      </div>
    </header>
  );
}
