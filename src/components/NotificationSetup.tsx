"use client";

import { useState } from "react";
import { urlBase64ToUint8Array } from "@/lib/vapid";
import { subscribeToPush } from "@/app/notifications/actions";
import { logJoinEvent } from "@/app/join/actions";

type Status =
  | "idle"
  | "requesting"
  | "granted_subscribing"
  | "active"
  | "denied"
  | "dismissed"
  | "unsupported"
  | "failed";

/**
 * Section 6.2. The permission request fires directly from this
 * button's click handler (a real user gesture) -- no async work
 * happens before it so browser activation isn't lost. Every outcome
 * (granted, denied, dismissed, unsupported, subscribe failure) gets
 * its own honest status; nothing here claims "active" until a real
 * PushSubscription is saved and the backend accepts a welcome push.
 */
export default function NotificationSetup({
  campaignCode,
  onDone,
}: {
  campaignCode?: string;
  onDone: () => void;
}) {
  const [status, setStatus] = useState<Status>("idle");

  const supported =
    typeof window !== "undefined" &&
    "serviceWorker" in navigator &&
    "PushManager" in window &&
    "Notification" in window;

  async function handleEnable() {
    if (!supported) {
      setStatus("unsupported");
      return;
    }

    setStatus("requesting");
    const permission = await Notification.requestPermission();

    if (campaignCode) {
      await logJoinEvent("notification_permission_result", campaignCode);
    }

    if (permission === "denied") {
      setStatus("denied");
      return;
    }
    if (permission !== "granted") {
      setStatus("dismissed");
      return;
    }

    setStatus("granted_subscribing");
    try {
      const registration = await navigator.serviceWorker.ready;
      const publicKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY;
      if (!publicKey) {
        setStatus("failed");
        return;
      }
      const subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(publicKey) as BufferSource,
      });

      const result = await subscribeToPush(
        subscription.toJSON() as {
          endpoint: string;
          keys: { p256dh: string; auth: string };
        },
        campaignCode
      );

      setStatus(result.ok ? "active" : "failed");
    } catch {
      setStatus("failed");
    }
  }

  return (
    <div className="bg-paper text-black rounded-xl p-6 flex flex-col gap-3 text-center">
      <h1 className="text-2xl">Stay connected</h1>
      <p className="text-sm">
        Get messages, events, and reminders you choose. Change this anytime
        in Account Settings → Notifications.
      </p>

      {status === "idle" && (
        <button
          onClick={handleEnable}
          className="bg-red hover:bg-red-dark text-paper font-bold uppercase tracking-wide rounded-md py-3"
        >
          Enable notifications
        </button>
      )}

      {(status === "requesting" || status === "granted_subscribing") && (
        <p className="text-sm text-muted">Setting up…</p>
      )}

      {status === "active" && (
        <p className="text-sm">You&apos;re set up for notifications.</p>
      )}
      {status === "denied" && (
        <p className="text-sm text-muted">
          Notifications are turned off in your browser settings. You can
          enable them there anytime — everything else still works.
        </p>
      )}
      {status === "dismissed" && (
        <p className="text-sm text-muted">
          No problem — you can turn this on later in Account Settings.
        </p>
      )}
      {status === "unsupported" && (
        <p className="text-sm text-muted">
          Your browser doesn&apos;t support notifications here. Everything
          else still works.
        </p>
      )}
      {status === "failed" && (
        <p className="text-sm text-muted">
          Something went wrong setting that up. You can try again later in
          Account Settings.
        </p>
      )}

      <button
        onClick={onDone}
        className="mt-1 border border-black/20 hover:border-gold font-bold uppercase tracking-wide rounded-md py-3"
      >
        {status === "active" ? "Continue" : "Skip for now"}
      </button>
    </div>
  );
}
