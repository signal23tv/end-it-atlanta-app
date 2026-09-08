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
      <main className="flex-1 bg-black text-paper pb-24">
        <div className="max-w-2xl mx-auto px-4 py-6 flex flex-col gap-4">
          <div className="flex flex-col items-center text-center gap-2 py-2">
            <div className="relative w-20 h-20">
              <div className="absolute inset-0 rounded-full bg-gold/30 blur-xl" aria-hidden="true" />
              <div className="relative w-20 h-20 rounded-full bg-gradient-to-br from-gold to-red flex items-center justify-center ring-2 ring-gold/50">
                <svg viewBox="0 0 24 24" width="34" height="34" fill="none" stroke="black" strokeWidth={1.5}>
                  <path d="M12 2 9.5 8H4l4.5 4L7 18l5-3.5L17 18l-1.5-6L20 8h-5.5L12 2Z" strokeLinejoin="round" fill="black" />
                </svg>
              </div>
            </div>
            <h1 className="text-2xl font-[var(--font-display)] text-paper mt-1">
              Todd the PrEP God
            </h1>
            <p className="text-xs text-gold uppercase tracking-wide font-semibold">
              Your 24/7 Sexual Health Assistant
            </p>
            <p className="text-sm text-muted max-w-sm">
              Health education and navigation — not a clinician, not an
              emergency service.
            </p>
          </div>

          {conversationId ? (
            <ToddChat
              conversationId={conversationId}
              initialMessages={messages ?? []}
              configured={isToddConfigured()}
            />
          ) : (
            <p className="text-muted">
              Please log in to chat with Todd.
            </p>
          )}
        </div>
      </main>
      <BottomNav />
    </>
  );
}
