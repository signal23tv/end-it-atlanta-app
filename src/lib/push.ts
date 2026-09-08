import webpush from "web-push";

/**
 * Server-only push sender (Section 6.5). VAPID_PRIVATE_KEY never
 * ships to the client bundle -- this file is only ever imported
 * from Server Actions / Route Handlers.
 */
webpush.setVapidDetails(
  process.env.VAPID_SUBJECT || "mailto:connect@enditatlanta.org",
  process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY || "",
  process.env.VAPID_PRIVATE_KEY || ""
);

export type PushPayload = {
  title: string;
  body: string;
  url?: string;
};

export type PushResult = {
  accepted: boolean;
  expired: boolean;
  error?: string;
};

/**
 * Sends to a single subscription. Never throws -- push delivery
 * failures must never break the calling flow. Distinguishes an
 * expired/invalid subscription (410/404, should be retired) from a
 * transient failure, per Section 6.5's "invalid subscriptions must
 * be retired" requirement.
 */
export async function sendPushToSubscription(
  subscription: { endpoint: string; keys: { p256dh: string; auth: string } },
  payload: PushPayload
): Promise<PushResult> {
  try {
    await webpush.sendNotification(subscription, JSON.stringify(payload));
    return { accepted: true, expired: false };
  } catch (err) {
    const statusCode =
      typeof err === "object" && err !== null && "statusCode" in err
        ? (err as { statusCode?: number }).statusCode
        : undefined;
    const expired = statusCode === 404 || statusCode === 410;
    return {
      accepted: false,
      expired,
      error: err instanceof Error ? err.message : "unknown push error",
    };
  }
}
