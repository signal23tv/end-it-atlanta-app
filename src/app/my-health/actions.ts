"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

export type HealthReminder = {
  id: string;
  title: string;
  note: string | null;
  due_date: string | null;
  completed: boolean;
  created_at: string;
};

export async function listReminders(): Promise<HealthReminder[]> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return [];

  const { data } = await supabase
    .from("health_reminders")
    .select("id, title, note, due_date, completed, created_at")
    .eq("user_id", user.id)
    .order("completed", { ascending: true })
    .order("due_date", { ascending: true, nullsFirst: false })
    .order("created_at", { ascending: false });

  return data ?? [];
}

export async function addReminder(title: string, note: string, dueDate: string) {
  const trimmedTitle = title.trim();
  if (!trimmedTitle) return;

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return;

  await supabase.from("health_reminders").insert({
    user_id: user.id,
    title: trimmedTitle,
    note: note.trim() || null,
    due_date: dueDate || null,
  });

  revalidatePath("/my-health");
}

export async function toggleReminder(id: string, completed: boolean) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return;

  await supabase
    .from("health_reminders")
    .update({ completed })
    .eq("id", id)
    .eq("user_id", user.id);

  revalidatePath("/my-health");
}

export async function deleteReminder(id: string) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return;

  await supabase.from("health_reminders").delete().eq("id", id).eq("user_id", user.id);

  revalidatePath("/my-health");
}
