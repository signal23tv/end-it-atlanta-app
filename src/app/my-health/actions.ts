"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

export type ReminderKind = "test" | "pill" | "other";

export type HealthReminder = {
  id: string;
  title: string;
  note: string | null;
  due_date: string | null;
  completed: boolean;
  kind: ReminderKind;
  repeat_daily: boolean;
  created_at: string;
};

function todayISO() {
  return new Date().toISOString().slice(0, 10);
}

export async function listReminders(): Promise<HealthReminder[]> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return [];

  const { data } = await supabase
    .from("health_reminders")
    .select("id, title, note, due_date, completed, kind, repeat_daily, created_at")
    .eq("user_id", user.id)
    .order("completed", { ascending: true })
    .order("due_date", { ascending: true, nullsFirst: false })
    .order("created_at", { ascending: false });

  return data ?? [];
}

/** Real check-ins for daily pill reminders, so streaks are honest counts, not made up. */
export async function listPillCheckIns(reminderIds: string[]): Promise<Record<string, string[]>> {
  if (reminderIds.length === 0) return {};
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return {};

  const { data } = await supabase
    .from("pill_check_ins")
    .select("reminder_id, taken_on")
    .eq("user_id", user.id)
    .in("reminder_id", reminderIds)
    .order("taken_on", { ascending: false });

  const byReminder: Record<string, string[]> = {};
  for (const row of data ?? []) {
    (byReminder[row.reminder_id] ??= []).push(row.taken_on);
  }
  return byReminder;
}

export async function addReminder(
  title: string,
  note: string,
  dueDate: string,
  kind: ReminderKind,
  repeatDaily: boolean
) {
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
    due_date: kind === "pill" && repeatDaily ? null : dueDate || null,
    kind,
    repeat_daily: kind === "pill" ? repeatDaily : false,
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

/** Mark (or unmark) today's dose taken for a daily pill reminder. */
export async function togglePillToday(reminderId: string, taken: boolean) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return;

  const today = todayISO();

  if (taken) {
    await supabase
      .from("pill_check_ins")
      .upsert(
        { user_id: user.id, reminder_id: reminderId, taken_on: today },
        { onConflict: "reminder_id,taken_on" }
      );
  } else {
    await supabase
      .from("pill_check_ins")
      .delete()
      .eq("reminder_id", reminderId)
      .eq("user_id", user.id)
      .eq("taken_on", today);
  }

  revalidatePath("/my-health");
}
