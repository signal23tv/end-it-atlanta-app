import Nav from "@/components/Nav";
import BottomNav from "@/components/BottomNav";
import ToddChat from "@/components/ToddChat";
import { createClient } from "@/lib/supabase/server";
import { isToddConfigured } from "@/lib/todd";
import { getOrCreateConversation } from "./actions";

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
          <div className="eit-card flex flex-col items-center text-center gap-2 py-6 px-4 relative overflow-hidden">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/assets/endit/v1/backgrounds/atmosphere-blue.svg"
              alt=""
              className="absolute inset-0 w-full h-full object-cover -z-10 opacity-70"
            />
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/assets/endit/v1/todd/todd-portrait.webp"
              alt="Todd the PrEP God"
              className="eit-avatar"
              style={{ width: 88, height: 88, boxShadow: "0 0 0 3px var(--eit-blue), 0 0 32px rgb(0 130 255 / .28)" }}
            />
            <h1 className="mt-1">
              <span className="sr-only">Todd the PrEP God</span>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/assets/endit/v1/brand/todd-wordmark.svg"
                alt=""
                aria-hidden="true"
                className="h-10 w-auto mx-auto"
              />
            </h1>
            <p className="text-xs text-gold uppercase tracking-wide font-semibold">
              Your Sexual Health Assistant
            </p>
            <p className="text-sm eit-muted max-w-sm">
              AI education and navigation — not a clinician or an emergency
              service.
            </p>
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
        </div>
      </main>
      <BottomNav />
    </>
  );
}
