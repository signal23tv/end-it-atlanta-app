import type { Metadata } from "next";
import MarketingHeader from "@/components/MarketingHeader";
import SiteFooter from "@/components/SiteFooter";
import BottomNav from "@/components/BottomNav";

export const metadata: Metadata = {
  title: "Privacy Notice | END IT ATLANTA",
  description: "How END IT ATLANTA collects, uses, and protects information from the Get Connected page.",
  robots: "noindex",
};

export default function PrivacyPage() {
  return (
    <>
      <MarketingHeader />
      <main className="flex-1 bg-paper text-black pb-16">
        <section className="py-16 md:py-20">
          <div className="max-w-3xl mx-auto px-4">
            <p className="text-red font-bold uppercase tracking-wide text-sm mb-2">Privacy</p>
            <h1 className="font-display text-4xl md:text-5xl mb-6">PRIVACY NOTICE</h1>

            <p className="mb-6">
              This notice explains what information the Get Connected page collects, why, who
              can access it, and how to request deletion. It does not cover other websites you
              may be directed to (like the Fulton County Board of Health or the CDC), which
              have their own privacy practices.
            </p>

            <h2 className="font-bold uppercase tracking-wide text-sm mt-8 mb-2">
              Anonymous referral activity
            </h2>
            <p className="mb-4">
              When you use the Get Connected page — selecting what you need, viewing a
              resource, or clicking a call, text, email, directions, or official-information
              button — we record a small, anonymous event. Each event includes a randomly
              generated ID stored in your browser (not your name or any account), the type of
              action taken, which resource it relates to, and the date and time. We never
              include your name, phone number, email address, ZIP code, or any health
              information in this data.
            </p>

            <h2 className="font-bold uppercase tracking-wide text-sm mt-8 mb-2">
              Optional connection-request form
            </h2>
            <p className="mb-4">
              If you choose to fill out the &quot;Want someone to help you connect?&quot;
              form, we collect only what&apos;s needed to follow up: a first name or nickname,
              your preferred contact method, a phone number or email address, an optional ZIP
              code, what you&apos;d like help with (from a fixed list of general categories),
              an optional best time to reach you, and your consent. We ask you not to include
              medical details, your HIV status, or other sensitive health information, and the
              form does not include an open text field for that reason.
            </p>
            <p className="mb-4">
              Submitting this form is entirely optional. Every phone number, address, and
              official resource link on the Get Connected page works without it.
            </p>

            <h2 className="font-bold uppercase tracking-wide text-sm mt-8 mb-2">
              Why we collect it
            </h2>
            <p className="mb-4">
              Anonymous referral activity helps END IT ATLANTA understand which resources
              people are actually using, so we can keep the page accurate and useful.
              Connection-request form submissions are collected solely to follow up with you
              about the help you asked for.
            </p>

            <h2 className="font-bold uppercase tracking-wide text-sm mt-8 mb-2">
              Who can access it
            </h2>
            <p className="mb-4">
              Anonymous referral activity and form submissions are stored in a database that
              only authorized END IT ATLANTA administrators can access, using a login and
              access controls. Form submissions are not automatically shared with anyone,
              including Todd Hall or Fulton County, unless END IT ATLANTA&apos;s designated
              administrator manually reviews and reaches out based on your request. Anonymous
              referral activity is never mixed with your form submission, and neither is
              shared with advertisers, sold, or used to build advertising profiles.
            </p>

            <h2 className="font-bold uppercase tracking-wide text-sm mt-8 mb-2">
              How long we keep it
            </h2>
            <p className="mb-4">
              END IT ATLANTA intends to retain connection-request form submissions only as
              long as needed to follow up on your request, and anonymous referral activity
              only as long as needed to understand usage trends. A specific retention period
              and automatic deletion schedule will be finalized and published here before this
              form is enabled for real submissions.
            </p>

            <h2 className="font-bold uppercase tracking-wide text-sm mt-8 mb-2">
              Requesting deletion
            </h2>
            <p className="mb-4">
              To request that your connection-request form submission be deleted, email{" "}
              <a href="mailto:connect@enditatlanta.org" className="text-red underline">
                connect@enditatlanta.org
              </a>{" "}
              with enough detail (such as the approximate date you submitted the form and your
              first name or nickname) for us to locate it. Because referral-activity events
              are anonymous by design, we generally cannot look one up by request, but they
              contain no information that identifies you.
            </p>

            <h2 className="font-bold uppercase tracking-wide text-sm mt-8 mb-2">
              Vendors who process this data
            </h2>
            <p className="mb-4">
              END IT ATLANTA uses Supabase (a third-party database and authentication
              provider) to store anonymous referral activity and form submissions. No
              advertising, retargeting, or session-recording tools are installed on the Get
              Connected page.
            </p>

            <h2 className="font-bold uppercase tracking-wide text-sm mt-8 mb-2">
              Medical disclaimer
            </h2>
            <p className="mb-4">
              END IT ATLANTA is a community outreach initiative and does not provide medical
              diagnosis, treatment, or emergency care. Information here is not a substitute
              for professional medical advice.
            </p>

            <p className="text-xs text-muted mt-10">
              This notice reflects how the Get Connected page is built as of the date it was
              last reviewed by END IT ATLANTA. It will be updated if the underlying data
              practices change.
            </p>
          </div>
        </section>
      </main>
      <SiteFooter />
      <BottomNav />
    </>
  );
}
