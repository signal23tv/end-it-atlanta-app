"use client";

import { useEffect, useState } from "react";
import { subscribeThisDeviceToPush, type PushSubscribeStatus } from "@/lib/push-client";

/**
 * Manual fallback for turning push on for the device you're using right
 * now. Before this existed, the ONLY place that ever called
 * `Notification.requestPermission()` was the one-time /join signup
 * wizard step -- if someone skipped it, dismissed the automatic
 * post-install prompt (`AutoPushEnable`), or their subscription lapsed,
 * there was no way back in except re-running the join flow. This lives
 * in Account Settings -> Notifications as a permanent, always-available
 * control.
 */
export default function EnablePushButton() {
  const [status, setStatus] = useState<PushSubscribeStatus | "idle">("idle");
  const [browserPermission, setBrowserPermission] = useState<NotificationPermission | null>(null);

  useEffect(() => {
    if (typeof window !== "undefined" && "Notification" in window) {
      setBrowserPermission(Notification.permission);
    }
  }, []);

  async function handleEnable() {
    setStatus("requesting");
    const result = await subscribeThisDeviceToPush();
    setStatus(result);
    if (typeof window !== "undefined" && "Notification" in window) {
      setBrowserPermission(Notification.permission);
    }
  }

  return (
    <section className="bg-white border border-black/10 rounded-xl p-5">
      <h2 className="font-semibold mb-1">This device</h2>
      <p className="text-xs text-muted mb-3">
        Turn on push notifications for the browser or app you&apos;re using right now.
      </p>

      {status === "active" && (
        <p className="text-sm font-medium text-green-700">This device is set up for notifications.</p>
      )}
      {status === "idle" && browserPermission === "denied" && (
        <p className="text-sm text-muted">
          Notifications are blocked for this site in your browser settings. Enable them there,
          then reload this page.
        </p>
      )}
      {(status === "idle" && browserPermission !== "denied") && (
        <button
          onClick={handleEnable}
          className="bg-red hover:bg-red-dark text-paper font-bold uppercase tracking-wide text-sm rounded-md px-4 py-2.5"
        >
          Enable notifications on this device
        </button>
      )}
      {status === "requesting" && <p className="text-sm text-muted">Setting up…</p>}
      {status === "denied" && (
        <p className="text-sm text-muted">
          Notifications are turned off in your browser settings. You can enable them there
          anytime.
        </p>
      )}
      {status === "dismissed" && (
        <p className="text-sm text-muted">No problem — you can try again anytime.</p>
      )}
      {status === "unsupported" && (
        <p className="text-sm text-muted">Your browser doesn&apos;t support notifications here.</p>
      )}
      {status === "not_authenticated" && (
        <p className="text-sm text-muted">You need to be signed in for this to work.</p>
      )}
      {status === "failed" && (
        <p className="text-sm text-muted">Something went wrong. Try again in a moment.</p>
      )}
    </section>
  );
}
