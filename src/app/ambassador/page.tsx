import { headers } from "next/headers";
import Nav from "@/components/Nav";
import BottomNav from "@/components/BottomNav";
import ToddLauncher from "@/components/ToddLauncher";
import ReferralQr from "@/components/ReferralQr";
import { getAmbassadorCampaigns } from "@/app/ambassador/actions";
import { TODD_CONTACT } from "@/lib/resources-data";

const ASSET = "/assets/endit/v1";

export const metadata = {
  title: "Ambassador | END IT ATLANTA",
  description: "Your referral link and real outreach stats.",
};

export default async function AmbassadorPage() {
  const campaigns = await getAmbassadorCampaigns();
  const headersList = await headers();
  const host = headersList.get("host");
  const protocol = host?.startsWith("localhost") ? "http" : "https";
  const origin = host ? `${protocol}://${host}` : "";

  return (
    <>
      <Nav />
      <main className="eit-app flex-1 pb-24">
        <div className="eit-shell flex flex-col gap-4">
          <div
            className="rounded-2xl p-5"
            style={{
              backgroundImage:
                "linear-gradient(180deg, rgb(6 11 19 / .55), rgb(6 11 19 / .92)), url(/assets/endit/v1/backgrounds/atmosphere-gold.svg)",
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          >
            <div className="flex items-center gap-2">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={`${ASSET}/badges/ambassador.svg`} alt="" width={24} height={24} />
              <h1 className="text-3xl" style={{ fontFamily: "var(--eit-font-display)" }}>
                Ambassador
              </h1>
            </div>
            <p className="text-sm eit-muted mt-1">Your referral link and real outreach stats.</p>
          </div>

          {campaigns.length === 0 ? (
            <div className="eit-card eit-empty">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={`${ASSET}/empty-states/notifications.svg`} alt="" />
              <p>
                You&apos;re not set up as an Ambassador yet -- this isn&apos;t a
                self-signup feature. Reach out and we&apos;ll get you a referral link and
                QR code.
              </p>
              <a
                href={`mailto:${TODD_CONTACT.email}?subject=${encodeURIComponent(
                  "Ambassador Program Interest"
                )}`}
                className="text-gold text-sm hover:underline mt-1"
              >
                Ask about becoming an Ambassador
              </a>
            </div>
          ) : (
            <div className="flex flex-col gap-5">
              {campaigns.map((c) => (
                <div
                  key={c.id}
                  className="rounded-xl border border-[#304055] bg-[#101A28] p-5 flex flex-col gap-4"
                >
                  <div>
                    <p className="font-display text-xl text-[#F7FAFF]">{c.name}</p>
                    <p className="text-xs text-[#98ADC7] mt-0.5">
                      Code: {c.code} · {c.status}
                    </p>
                  </div>

                  {origin && <ReferralQr url={`${origin}/join/${c.code}`} />}

                  <div className="grid grid-cols-2 gap-3">
                    <div className="rounded-lg border border-[#304055] p-3 text-center">
                      <p className="text-2xl font-display text-gold">{c.signupCount}</p>
                      <p className="text-[11px] uppercase tracking-wide text-[#98ADC7]">
                        Real signups
                      </p>
                    </div>
                    <div className="rounded-lg border border-[#304055] p-3 text-center">
                      <p className="text-2xl font-display text-gold">{c.attributionCount}</p>
                      <p className="text-[11px] uppercase tracking-wide text-[#98ADC7]">
                        People referred
                      </p>
                    </div>
                  </div>
                </div>
              ))}
              <div className="rounded-lg border border-white/10 bg-white/5 p-4 text-xs text-[#B3C2D4]">
                These are real, tracked numbers from people who used your link -- not
                estimates.
              </div>
            </div>
          )}
        </div>
      </main>
      <ToddLauncher />
      <BottomNav />
    </>
  );
}
