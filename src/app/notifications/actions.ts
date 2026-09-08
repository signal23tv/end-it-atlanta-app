"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { sendPushToSubscription } from "@/lib/push";
import { logJoinEvent } from "@/app/join/actions";

export type SubscribeResult = {
  ok: boolean;
  welcomePushAccepted?: boolean;
  error?: string;
};

/**
 * Called right after the browser grants permission and the service
 * worker creates a real PushSubscription. Saves it, then sends a
 * REAL welcome push through the backend sender -- not a local toast
 * (Section 6.2: "A local toast ... is not proof that remote push
 * works").
 */
export async function subscribeToPush(
  subscriptionJson: {
    endpoint: string;
    keys: { p256dh: string; auth: string };
  },
  campaignCode?: string
): Promise<SubscribeResult> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return { ok: false, error: "not_authenticated" };

  const { error: upsertError } = await supabase
    .from("push_subscriptions")
    .upsert(
      {
        user_id: user.id,
        endpoint: subscriptionJson.endpoint,
        p256dh: subscriptionJson.keys.p256dh,
        auth: subscriptionJson.keys.auth,
        last_seen_at: new Date().toISOString(),
        revoked_at: null,
      },
      { onConflict: "endpoint" }
    );

  if (upsertError) {
    return { ok: false, error: "save_failed" };
  }

  if (campaignCode) await logJoinEvent("push_subscription_registered", campaignCode);

  const result = await sendPushToSubscription(subscriptionJson, {
    title: "END IT ATLANTA",
    body: "You're set up. We'll reach you here when it matters.",
    url: "/feed",
  });

  if (campaignCode && result.accepted) {
    await logJoinEvent("welcome_push_accepted", campaignCode);
  }

  revalidatePath("/settings/notifications");
  return { ok: true, welcomePushAccepted: result.accepted };
}

export async function unsubscribePush(endpoint: string) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return;

  await supabase
    .from("push_subscriptions")
    .update({ revoked_at: new Date().toISOString() })
    .eq("endpoint", endpoint)
    .eq("user_id", user.id);

  revalidatePath("/settings/notifications");
}

export type NotificationPreferences = {
  master: boolean;
  category_service: boolean;
  category_messages: boolean;
  category_navigator: boolean;
  category_events: boolean;
  category_education: boolean;
  category_prep_tv: boolean;
  category_ambassador: boolean;
  category_reminders: boolean;
};

export type NotificationItem = {
  id: string;
  type: "follow" | "like" | "comment";
  read: boolean;
  created_at: string;
  post_id: string | null;
  actor: { username: string; display_name: string } | null;
};

/**
 * Real, in-app notification feed -- separate from the push-preference
 * toggles in /settings/notifications. Backed by the `notifications`
 * table (already had SELECT/UPDATE RLS from the original schema; we
 * added the missing INSERT policy so like/comment/follow actions can
 * write rows as the acting user). Nothing here is fabricated -- an
 * empty list means no real notification events have happened yet.
 */
export async function getNotifications(): Promise<NotificationItem[]> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return [];

  const { data } = await supabase
    .from("notifications")
    .select(
      "id, type, read, created_at, post_id, actor:profiles!notifications_actor_id_fkey(username, display_name)"
    )
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })
    .limit(50);

  return (data as unknown as NotificationItem[]) ?? [];
}

export async function getUnreadNotificationCount(): Promise<number> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return 0;

  const { count } = await supabase
    .from("notifications")
    .select("*", { count: "exact", head: true })
    .eq("user_id", user.id)
    .eq("read", false);

  return count ?? 0;
}

export async function markAllNotificationsRead() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return;

  await supabase
    .from("notifications")
    .update({ read: true })
    .eq("user_id", user.id)
    .eq("read", false);

  revalidatePath("/notifications");
}

export async function updateNotificationPreference(
  key: keyof NotificationPreferences,
  value: boolean
) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return;

  await supabase
    .from("notification_preferences")
    .update({ [key]: value, updated_at: new Date().toISOString() })
    .eq("user_id", user.id);

  revalidatePath("/settings/notifications");
}
