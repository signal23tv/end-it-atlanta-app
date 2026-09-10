"use client";

import { useEffect, useState } from "react";
import { isStandalone } from "@/lib/pwa";
import { subscribeThisDeviceToPush, silentlyRearmPushIfAlreadyGranted } from "@/lib/push-client";

const DISMISS_KEY = "eia_push_prompt_dismissed_session";

type Status = "idle" | "requesting" | "active" | "denied" | "dismissed" | "unsupported" | "failed";

/**
 * Automatic push re-arm/prompt, mounted once inside `BottomNav` so it's
 * present on every authenticated screen without editing every page.
 * Henderson (2026-09-10): "make sure push notifications are turned on
 * automatically."
 *
 * There's a hard browser-security limit here that no code can route
 * around: `Notification.requestPermission()` only works from a real
 * user click, and browsers refuse (or auto-deny) attempts to trigger it
 * without one -- across iOS Safari, Chrome/Android, and desktop. So
 * "fully silent, zero-tap" is only possible for someone who *already*
 * granted permission in the past. This component does the most
 * automatic thing actually possible for each case:
 *
 * - Permission already "granted": silently re-subscribes with no UI at
 *   all if the browser's `PushSubscription` was ever lost (service
 *   worker update, browser data clear, etc.) -- truly automatic, zero
 *   taps.
 * - Permission "default" (never asked): instead of requiring the
 *   person to go find Account Settings, this surfaces the real "Turn
 *   on notifications" ask immediately when they open the installed app
 *   -- the one remaining tap (Allow) is unavoidable.
 * - Permission "denied": does nothing. Respecting an explicit decline
 *   is not optional.
 *
 * Only runs in standalone (installed) mode -- matches the note shown in
 * `GetAppSheet` that push only works reliably once opened from the
 * installed icon, especially on iOS.
 */
export default function AutoPushEnable() {
  const [visible, setVisible] = useState(false);
  const [status, setStatus] = useState<Status>("idle");

  useEffect(() => {
    let cancelled = false;

    async function run() {
      if (!isStandalone()) return;
      const supported =
        typeof window !== "undefined" &&
        "serviceWorker" in navigator &&
        "PushManager" in window &&
        "Notification" in window;
      if (!supported) return;

      if (Notification.permission === "granted") {
        await silentlyRearmPushIfAlreadyGranted();
        return;
      }
      if (Notification.permission === "denied") return;

      // permission === "default" -- never been asked on this device.
      if (sessionStorage.getItem(DISMISS_KEY)) return;
      if (!cancelled) setVisible(true);
    }

    run();
    return () => {
      cancelled = true;
    };
  }, []);

  async function handleEnable() {
    setStatus("requesting");
    const result = await subscribeThisDeviceToPush();
    setStatus(result === "not_authenticated" ? "failed" : (result as Status));
    if (result === "active") {
      setTimeout(() => setVisible(false), 2200);
    }
  }

  function dismiss() {
    sessionStorage.setItem(DISMISS_KEY, "1");
    setVisible(false);
  }

  if (!visible) return null;

  return (
    <div
      role="status"
      className="fixed left-3 right-3 z-40 mx-auto max-w-md rounded-2xl border border-[#304055] bg-[#101A28] shadow-2xl shadow-black/50 px-4 py-3.5 flex items-center gap-3"
      style={{ bottom: "calc(76px + env(safe-area-inset-bottom) + 12px)" }}
    >
      <span
        className="shrink-0 w-10 h-10 rounded-full flex items-center justify-center"
        style={{ background: "linear-gradient(135deg, var(--eit-purple, #8B5CF6), var(--eit-pink, #EC4899))" }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/assets/endit/v1/icons/bell.svg"
          alt=""
          width={18}
          height={18}
          style={{ filter: "invert(1)" }}
        />
      </span>

      <div className="flex-1 min-w-0">
        {status === "idle" && (
          <>
            <p className="text-sm font-semibold text-[#F7FAFF]">Turn on notifications</p>
            <p className="text-xs text-[#98ADC7]">Messages, events, and reminders you choose.</p>
          </>
        )}
        {status === "requesting" && <p className="text-sm text-[#B3C2D4]">Setting up…</p>}
        {status === "active" && <p className="text-sm text-[#F7FAFF]">You&apos;re set up.</p>}
        {status === "denied" && (
          <p className="text-xs text-[#B3C2D4]">
            Turned off in your browser settings — you can enable them there anytime.
          </p>
        )}
        {(status === "dismissed" || status === "failed" || status === "unsupported") && (
          <p className="text-xs text-[#B3C2D4]">No problem — find this later in Account Settings.</p>
        )}
      </div>

      {status === "idle" ? (
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={handleEnable}
            className="rounded-full bg-red hover:bg-red-dark text-paper text-xs font-bold uppercase tracking-wide px-3.5 py-2"
          >
            Allow
          </button>
          <button
            onClick={dismiss}
            aria-label="Dismiss"
            className="text-[#98ADC7] hover:text-[#F7FAFF] text-lg leading-none px-1"
          >
            ×
          </button>
        </div>
      ) : (
        <button
          onClick={dismiss}
          aria-label="Dismiss"
          className="shrink-0 text-[#98ADC7] hover:text-[#F7FAFF] text-lg leading-none px-1"
        >
          ×
        </button>
      )}
    </div>
  );
}
