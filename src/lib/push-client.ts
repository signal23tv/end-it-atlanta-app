"use client";

import { urlBase64ToUint8Array } from "@/lib/vapid";
import { subscribeToPush } from "@/app/notifications/actions";

export type PushSubscribeStatus =
  | "requesting"
  | "active"
  | "denied"
  | "dismissed"
  | "unsupported"
  | "failed"
  | "not_authenticated";

/**
 * Single real implementation of "subscribe this device to push," shared
 * by every entry point that can turn notifications on: the /join signup
 * wizard (`NotificationSetup`), the automatic post-install prompt
 * (`AutoPushEnable`), and the manual fallback in Account Settings
 * (`EnablePushButton`). Previously this logic only existed inline in
 * the join wizard, so there was no way to (re)enable push at all once
 * that one-time step was skipped or a subscription lapsed.
 *
 * `Notification.requestPermission()` must be called from a real user
 * gesture (a click) or the browser silently ignores/denies it -- that's
 * a hard platform rule, not something any of our code can route around.
 * Every caller of this function must therefore call it directly inside
 * a click handler.
 */
export async function subscribeThisDeviceToPush(
  campaignCode?: string
): Promise<PushSubscribeStatus> {
  const supported =
    typeof window !== "undefined" &&
    "serviceWorker" in navigator &&
    "PushManager" in window &&
    "Notification" in window;

  if (!supported) return "unsupported";

  const permission = await Notification.requestPermission();

  if (permission === "denied") return "denied";
  if (permission !== "granted") return "dismissed";

  try {
    const registration = await navigator.serviceWorker.ready;
    const publicKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY;
    if (!publicKey) return "failed";

    let subscription = await registration.pushManager.getSubscription();
    if (!subscription) {
      subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(publicKey) as BufferSource,
      });
    }

    const result = await subscribeToPush(
      subscription.toJSON() as {
        endpoint: string;
        keys: { p256dh: string; auth: string };
      },
      campaignCode
    );

    if (!result.ok && result.error === "not_authenticated") return "not_authenticated";
    return result.ok ? "active" : "failed";
  } catch {
    return "failed";
  }
}

/**
 * Silent, no-permission-prompt re-arm: if the browser already granted
 * notification permission in a past session (common after reinstalling
 * the service worker, clearing the push subscription, or an app
 * update), this re-subscribes with zero UI and zero user action --
 * fully automatic, since no permission prompt is involved when
 * permission is already "granted." Does nothing if permission is
 * "default" or "denied" -- requesting permission always needs a real
 * click, so that case is handled separately by `AutoPushEnable`'s
 * visible "Turn on notifications" button.
 *
 * Important: only calls the server action (which sends a real welcome
 * push, by design, for a brand-new subscription) when the browser
 * didn't already have a live `PushSubscription` -- otherwise this would
 * silently re-send a "You're set up" push on every single app open for
 * someone who's already fully subscribed. If a subscription already
 * exists, this is a true no-op.
 */
export async function silentlyRearmPushIfAlreadyGranted(): Promise<
  PushSubscribeStatus | "skipped" | "already_active"
> {
  const supported =
    typeof window !== "undefined" &&
    "serviceWorker" in navigator &&
    "PushManager" in window &&
    "Notification" in window;

  if (!supported) return "skipped";
  if (Notification.permission !== "granted") return "skipped";

  try {
    const registration = await navigator.serviceWorker.ready;
    const existing = await registration.pushManager.getSubscription();
    if (existing) return "already_active";

    const publicKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY;
    if (!publicKey) return "failed";

    const subscription = await registration.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: urlBase64ToUint8Array(publicKey) as BufferSource,
    });

    const result = await subscribeToPush(
      subscription.toJSON() as {
        endpoint: string;
        keys: { p256dh: string; auth: string };
      }
    );

    if (!result.ok && result.error === "not_authenticated") return "not_authenticated";
    return result.ok ? "active" : "failed";
  } catch {
    return "failed";
  }
}
