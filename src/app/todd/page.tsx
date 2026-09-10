import Link from "next/link";
import Nav from "@/components/Nav";
import BottomNav from "@/components/BottomNav";
import ToddChat from "@/components/ToddChat";
import { createClient } from "@/lib/supabase/server";
import { isToddConfigured } from "@/lib/todd";
import { getOrCreateConversation } from "./actions";

const ASSET = "/assets/endit/v1/todd";

/**
 * Todd's sanctuary (redesigned 2026-09-10 per Henderson's spec: "a
 * hip-hop therapy room... an urban wellness lounge... a safe-space
 * studio"). Real photography from Henderson replaces the flat
 * atmosphere-svg card that was here before -- but per the spec's
 * explicit implementation rule ("do not bake long UI text into the
 * background images"), every word on this page is still live HTML, not
 * pixels: the name, tagline, and subcopy are layered over the hero
 * photo with a real gradient scrim, not baked into the banner.
 *
 * Of the 7 named assets in the spec, 4 were actually supplied this
 * round (header banner, chat lounge background, premium avatar, info
 * card background). `todd_full_portrait_card`, `todd_empty_state_
 * welcome`, and `todd_topics_strip_bg` were not included -- those
 * sections below use clean CSS/token-based treatments instead of
 * fabricating placeholder art, and can swap in the real images later.
 */
export default async function ToddPage() {
  const supabase = await createClient();
  const conversationId = await getOrCreateConversation();

  const { data: messages } = conversationId
    ? await supabase
        .from("todd_messages")
        .select("id, role, content, is_urgent_routing")
        .eq("conversation_id", conversationId)
        .order("created_at", { ascending: true })
    : { data: [] };

  return (
    <>
      <Nav />
      <main className="eit-app flex-1 pb-24">
        <div className="eit-shell flex flex-col gap-4">
          {/* HERO -- real sanctuary photo, live text overlay */}
          <div className="rounded-2xl overflow-hidden border border-white/10 shadow-2xl shadow-black/40">
            <div className="relative w-full h-56 sm:h-64 md:h-auto md:aspect-[2048/768]">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={`${ASSET}/todd-header-sanctuary-banner.webp`}
                alt=""
                className="absolute inset-0 w-full h-full object-cover"
                style={{ objectPosition: "38% center" }}
              />
              <div
                className="absolute inset-0"
                style={{
                  background:
                    "linear-gradient(0deg, rgb(6 11 19 / .92) 0%, rgb(6 11 19 / .6) 42%, rgb(6 11 19 / .1) 68%, transparent 100%)",
                }}
              />
              <div className="relative z-10 h-full flex flex-col justify-end gap-2.5 px-5 py-4 sm:px-7 sm:py-5">
                <div className="flex items-center gap-3">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={`${ASSET}/todd-avatar-premium.webp`}
                    alt=""
                    className="w-11 h-11 sm:w-14 sm:h-14 rounded-full object-cover shrink-0"
                    style={{ boxShadow: "0 0 0 2px var(--eit-gold, #FFC629), 0 0 24px rgb(255 198 41 / .3)" }}
                  />
                  <div>
                    <h1 className="font-display leading-none text-3xl sm:text-4xl">
                      <span className="text-gold">Todd</span>{" "}
                      <span className="text-[#F7FAFF]">The PrEP God</span>
                    </h1>
                    <p className="text-[11px] sm:text-xs text-gold uppercase tracking-[0.14em] font-bold mt-1">
                      Your Sexual Health Assistant
                    </p>
                  </div>
                </div>
                <p className="text-xs sm:text-sm text-[#B3C2D4] max-w-md">
                  AI education and navigation — not a clinician or an emergency service.
                </p>
              </div>
            </div>
          </div>

          {conversationId ? (
            <ToddChat
              conversationId={conversationId}
              initialMessages={messages ?? []}
              configured={isToddConfigured()}
            />
          ) : (
            <p className="eit-muted">
              Please log in to chat with Todd.
            </p>
          )}

          {/* INFO / DISCLAIMER CARD -- real gold-framed card art, live text */}
          <div className="relative rounded-2xl overflow-hidden border border-gold/20">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={`${ASSET}/todd-info-card-bg.webp`}
              alt=""
              className="absolute inset-0 w-full h-full object-cover"
            />
            <div
              className="absolute inset-0"
              style={{ background: "linear-gradient(90deg, rgb(6 11 19 / .55) 0%, rgb(6 11 19 / .3) 55%, rgb(6 11 19 / .1) 78%)" }}
            />
            <div className="relative z-10 px-5 py-5 sm:px-7 sm:py-6 flex flex-col gap-2 max-w-md">
              <p className="text-xs font-bold uppercase tracking-wide text-gold">Before you ask</p>
              <p className="text-sm text-[#F7FAFF] leading-relaxed">
                Todd shares real, sourced education about PrEP, testing, and prevention — he&apos;s
                not a doctor and this isn&apos;t a substitute for medical care.
              </p>
              <p className="text-sm text-[#F7FAFF] leading-relaxed">
                Having a crisis right now?{" "}
                <Link href="/help" className="underline decoration-gold underline-offset-2 hover:text-gold">
                  Get real help here
                </Link>
                , not from a chatbot.
              </p>
            </div>
          </div>
        </div>
      </main>
      <BottomNav />
    </>
  );
}
