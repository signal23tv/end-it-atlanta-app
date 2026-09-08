"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { generateToddReply } from "@/lib/todd";
import { detectUrgentCategory, urgentResponseFor } from "@/lib/todd-safety";

export type SendToddMessageResult = {
  ok: boolean;
  error?: string;
};

export async function getOrCreateConversation(): Promise<string | null> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const { data: existing } = await supabase
    .from("todd_conversations")
    .select("id")
    .eq("user_id", user.id)
    .order("updated_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (existing) return existing.id;

  const { data: created } = await supabase
    .from("todd_conversations")
    .insert({ user_id: user.id })
    .select("id")
    .single();

  return created?.id ?? null;
}

export async function sendToddMessage(
  conversationId: string,
  content: string
): Promise<SendToddMessageResult> {
  const trimmed = content.trim();
  if (!trimmed) return { ok: false, error: "Message can't be empty." };

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { ok: false, error: "Not authenticated." };

  const { error: insertError } = await supabase.from("todd_messages").insert({
    conversation_id: conversationId,
    role: "user",
    content: trimmed,
  });
  if (insertError) return { ok: false, error: "Couldn't send that message." };

  // Urgent-pathway check runs regardless of whether the AI backend
  // is configured (Section 9) -- crisis routing must never depend
  // on the model being available.
  const urgentCategory = detectUrgentCategory(trimmed);
  if (urgentCategory) {
    await supabase.from("todd_messages").insert({
      conversation_id: conversationId,
      role: "assistant",
      content: urgentResponseFor(urgentCategory),
      is_urgent_routing: true,
    });
    revalidatePath("/todd");
    return { ok: true };
  }

  const { data: history } = await supabase
    .from("todd_messages")
    .select("role, content")
    .eq("conversation_id", conversationId)
    .order("created_at", { ascending: true })
    .limit(20);

  const reply = await generateToddReply(
    supabase,
    (history ?? []).map((m) => ({
      role: m.role as "user" | "assistant",
      content: m.content,
    })),
    user.id,
    conversationId
  );

  await supabase.from("todd_messages").insert({
    conversation_id: conversationId,
    role: "assistant",
    content: reply.content,
  });

  revalidatePath("/todd");
  return { ok: true };
}
