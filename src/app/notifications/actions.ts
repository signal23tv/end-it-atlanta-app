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
