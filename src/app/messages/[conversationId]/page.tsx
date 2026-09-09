import { notFound } from "next/navigation";
import Link from "next/link";
import Nav from "@/components/Nav";
import BottomNav from "@/components/BottomNav";
import DmThread from "@/components/DmThread";
import { listMessages } from "@/app/messages/actions";
import { createClient } from "@/lib/supabase/server";

export default async function ConversationPage({
  params,
}: {
  params: Promise<{ conversationId: string }>;
}) {
  const { conversationId } = await params;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) notFound();

  const { data: convo } = await supabase
    .from("conversations")
    .select("id, user_a, user_b")
    .eq("id", conversationId)
    .maybeSingle();

  if (!convo || (convo.user_a !== user.id && convo.user_b !== user.id)) notFound();

  const otherId = convo.user_a === user.id ? convo.user_b : convo.user_a;
  const { data: otherProfile } = await supabase
    .from("profiles")
    .select("username, display_name")
    .eq("id", otherId)
    .maybeSingle();

  const messages = await listMessages(conversationId);

  return (
    <>
      <Nav />
      <main className="eit-app flex-1 pb-24">
        <div className="eit-shell flex flex-col gap-4">
          <div className="flex items-center gap-3">
            <Link
              href="/messages"
              aria-label="Back to messages"
              className="text-[#B3C2D4] hover:text-[#F7FAFF]"
            >
              <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth={2}>
                <path d="M15 18l-6-6 6-6" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </Link>
            <div className="w-9 h-9 shrink-0 rounded-full bg-gold/20 text-gold flex items-center justify-center font-bold uppercase text-sm">
              {otherProfile?.display_name?.[0] ?? otherProfile?.username?.[0] ?? "?"}
            </div>
            {otherProfile ? (
              <Link href={`/profile/${otherProfile.username}`} className="hover:text-gold">
                <p className="font-semibold text-[#F7FAFF]">
                  {otherProfile.display_name ?? otherProfile.username}
                </p>
                <p className="text-xs text-[#98ADC7]">@{otherProfile.username}</p>
              </Link>
            ) : (
              <p className="font-semibold text-[#F7FAFF]">Member</p>
            )}
          </div>

          <DmThread
            conversationId={conversationId}
            currentUserId={user.id}
            initialMessages={messages}
          />
        </div>
      </main>
      <BottomNav />
    </>
  );
}
