"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export type ConversationSummary = {
  id: string;
  otherUser: {
    id: string;
    username: string;
    display_name: string | null;
    avatar_url: string | null;
    avatar_color: string | null;
  };
  lastMessageBody: string | null;
  lastMessageAt: string;
  unread: boolean;
};

export type DmMessage = {
  id: string;
  sender_id: string;
  body: string;
  created_at: string;
};

/** Real conversation list for the signed-in user, newest first. */
export async function listConversations(): Promise<ConversationSummary[]> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return [];

  const { data: convos } = await supabase
    .from("conversations")
    .select("id, user_a, user_b, last_message_at")
    .or(`user_a.eq.${user.id},user_b.eq.${user.id}`)
    .order("last_message_at", { ascending: false });

  if (!convos || convos.length === 0) return [];

  const otherIds = convos.map((c) => (c.user_a === user.id ? c.user_b : c.user_a));
  const [{ data: profiles }, { data: lastMessages }] = await Promise.all([
    supabase
      .from("profiles")
      .select("id, username, display_name, avatar_url, avatar_color")
      .in("id", otherIds),
    supabase
      .from("dm_messages")
      .select("conversation_id, body, sender_id, created_at, read_at")
      .in(
        "conversation_id",
        convos.map((c) => c.id)
      )
      .order("created_at", { ascending: false }),
  ]);

  const profileById = new Map((profiles ?? []).map((p) => [p.id, p]));
  const lastByConvo = new Map<string, { body: string; sender_id: string; read_at: string | null }>();
  for (const m of lastMessages ?? []) {
    if (!lastByConvo.has(m.conversation_id)) {
      lastByConvo.set(m.conversation_id, { body: m.body, sender_id: m.sender_id, read_at: m.read_at });
    }
  }

  return convos
    .map((c) => {
      const otherId = c.user_a === user.id ? c.user_b : c.user_a;
      const other = profileById.get(otherId);
      if (!other) return null;
      const last = lastByConvo.get(c.id);
      return {
        id: c.id,
        otherUser: other,
        lastMessageBody: last?.body ?? null,
        lastMessageAt: c.last_message_at,
        unread: Boolean(last && last.sender_id !== user.id && !last.read_at),
      };
    })
    .filter((c): c is ConversationSummary => c !== null);
}

export async function listMessages(conversationId: string): Promise<DmMessage[]> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return [];

  const { data: convo } = await supabase
    .from("conversations")
    .select("id, user_a, user_b")
    .eq("id", conversationId)
    .maybeSingle();
  if (!convo || (convo.user_a !== user.id && convo.user_b !== user.id)) return [];

  const { data: messages } = await supabase
    .from("dm_messages")
    .select("id, sender_id, body, created_at")
    .eq("conversation_id", conversationId)
    .order("created_at", { ascending: true });

  // Mark the other person's messages as read.
  await supabase
    .from("dm_messages")
    .update({ read_at: new Date().toISOString() })
    .eq("conversation_id", conversationId)
    .neq("sender_id", user.id)
    .is("read_at", null);

  return messages ?? [];
}

export async function sendMessage(conversationId: string, body: string) {
  const trimmed = body.trim();
  if (!trimmed) return;

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return;

  await supabase.from("dm_messages").insert({
    conversation_id: conversationId,
    sender_id: user.id,
    body: trimmed,
  });

  await supabase
    .from("conversations")
    .update({ last_message_at: new Date().toISOString() })
    .eq("id", conversationId);

  revalidatePath(`/messages/${conversationId}`);
  revalidatePath("/messages");
}

/** Find or create the 1:1 conversation with `otherUserId`, then redirect into it. */
export async function startConversation(otherUserId: string) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user || user.id === otherUserId) return;

  const [userA, userB] = [user.id, otherUserId].sort();

  const { data: existing } = await supabase
    .from("conversations")
    .select("id")
    .eq("user_a", userA)
    .eq("user_b", userB)
    .maybeSingle();

  let conversationId = existing?.id as string | undefined;

  if (!conversationId) {
    const { data: created, error } = await supabase
      .from("conversations")
      .insert({ user_a: userA, user_b: userB })
      .select("id")
      .single();
    if (error || !created) return;
    conversationId = created.id;
  }

  redirect(`/messages/${conversationId}`);
}
