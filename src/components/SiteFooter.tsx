import Link from "next/link";
import Image from "next/image";

export default function SiteFooter() {
  return (
    <footer id="contact" className="bg-black text-paper">
      <div className="max-w-6xl mx-auto px-4 py-14 grid gap-10 md:grid-cols-[1.2fr_1fr]">
        <div>
          <p className="font-display text-3xl tracking-wide">END IT ATLANTA</p>
          <p className="text-muted mt-2">One city. One mission. One person at a time.</p>
          <Image
            src="/graphics/atlanta-skyline.svg"
            alt=""
            aria-hidden="true"
            width={480}
            height={80}
            className="mt-6 max-w-xs opacity-70"
          />
        </div>

        <div className="grid grid-cols-2 gap-6 text-sm">
          <div>
            <span className="block text-gold uppercase tracking-wide text-xs mb-1">
              Instagram
            </span>
            <span className="text-paper/80">@enditatlanta</span>
          </div>
          <div>
            <span className="block text-gold uppercase tracking-wide text-xs mb-1">Email</span>
            <a href="mailto:connect@enditatlanta.org" className="text-paper/80 hover:text-gold">
              connect@enditatlanta.org
            </a>
          </div>
          <div>
            <span className="block text-gold uppercase tracking-wide text-xs mb-1">
              Resources
            </span>
            <Link href="/learning-lab" className="text-paper/80 hover:text-gold">
              Learning Lab
            </Link>
          </div>
          <div>
            <span className="block text-gold uppercase tracking-wide text-xs mb-1">
              Privacy
            </span>
            <Link href="/privacy" className="text-paper/80 hover:text-gold">
              Privacy Notice
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 pb-10">
        <p className="text-xs text-muted max-w-3xl">
          End It Atlanta is a community outreach initiative and does not provide medical care.
          Medical services, eligibility, and treatment recommendations are determined by
          qualified healthcare providers and participating organizations.
        </p>
      </div>
    </footer>
  );
}
