"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { sendPushToSubscription } from "@/lib/push";

export async function sendTestNotification(endpoint: string) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { ok: false };

  const { data: sub } = await supabase
    .from("push_subscriptions")
    .select("endpoint, p256dh, auth")
    .eq("endpoint", endpoint)
    .eq("user_id", user.id)
    .is("revoked_at", null)
    .maybeSingle();

  if (!sub) return { ok: false };

  const result = await sendPushToSubscription(
    { endpoint: sub.endpoint, keys: { p256dh: sub.p256dh, auth: sub.auth } },
    { title: "END IT ATLANTA", body: "This is a test notification.", url: "/settings/notifications" }
  );

  if (result.expired) {
    await supabase
      .from("push_subscriptions")
      .update({ revoked_at: new Date().toISOString() })
      .eq("endpoint", endpoint)
      .eq("user_id", user.id);
    revalidatePath("/settings/notifications");
  }

  return { ok: result.accepted };
}
