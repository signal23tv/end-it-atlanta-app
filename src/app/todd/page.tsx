import Nav from "@/components/Nav";
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
      <main className="flex-1 bg-[color:var(--paper)]">
        <div className="max-w-2xl mx-auto px-4 py-6 flex flex-col gap-4">
          <div>
            <h1 className="text-3xl font-[var(--font-display)] text-black">
              Todd the PrEP God
            </h1>
            <p className="text-sm text-muted">
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
    </>
  );
}
