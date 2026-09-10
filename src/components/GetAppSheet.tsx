"use client";

import { useEffect, useState } from "react";
import { isStandalone, isIOS, isAndroid, type BeforeInstallPromptEvent } from "@/lib/pwa";

const ASSET = "/assets/endit/v1";

/**
 * Global "Get the App" install sheet -- a real PWA install experience,
 * not a native-app-store link (there is no App Store listing; this
 * installs straight from the browser). Mounted once in the root layout
 * so its `beforeinstallprompt` listener is always attached from first
 * load (Chrome/Android only fires that event once per page load, so it
 * has to be listened for before the sheet is ever opened) -- any part
 * of the app can open it by dispatching `window` event
 * `"eia:open-get-app"` (see the trigger button in the /more menu).
 *
 * Device is feature/UA-detected so the right, accurate steps show:
 * iOS Safari has no programmatic install prompt at all (Apple doesn't
 * expose one), so it always gets manual Share -> Add to Home Screen
 * instructions. Chrome/Android (and desktop Chrome/Edge) can fire a
 * real `beforeinstallprompt` -- when that's available we show a real
 * one-tap Install button that triggers the native OS prompt directly;
 * otherwise Android also falls back to the same manual steps.
 */
export default function GetAppSheet() {
  const [open, setOpen] = useState(false);
  const [standalone, setStandalone] = useState(false);
  const [ios, setIos] = useState(false);
  const [android, setAndroid] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [installResult, setInstallResult] = useState<"idle" | "accepted" | "dismissed">("idle");

  useEffect(() => {
    setStandalone(isStandalone());
    setIos(isIOS());
    setAndroid(isAndroid());

    function onBeforeInstall(e: Event) {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
    }
    function onOpenRequest() {
      setOpen(true);
    }

    window.addEventListener("beforeinstallprompt", onBeforeInstall);
    window.addEventListener("eia:open-get-app", onOpenRequest);
    return () => {
      window.removeEventListener("beforeinstallprompt", onBeforeInstall);
      window.removeEventListener("eia:open-get-app", onOpenRequest);
    };
  }, []);

  // Lock body scroll while the sheet is open.
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  async function handleInstallClick() {
    if (!deferredPrompt) return;
    await deferredPrompt.prompt();
    const choice = await deferredPrompt.userChoice;
    setInstallResult(choice.outcome);
    setDeferredPrompt(null);
  }

  function close() {
    setOpen(false);
  }

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center">
      {/* Scrim */}
      <button
        aria-label="Close"
        onClick={close}
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
      />

      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="get-app-title"
        className="relative w-full sm:max-w-md rounded-t-3xl sm:rounded-3xl sm:mb-8 bg-[#0A1422] border border-white/10 shadow-2xl shadow-black/60 max-h-[88dvh] overflow-y-auto"
      >
        <div className="sticky top-0 bg-[#0A1422] pt-3 pb-2 flex justify-center">
          <span className="w-10 h-1.5 rounded-full bg-white/20" />
        </div>

        <div className="px-6 pb-8 flex flex-col gap-5">
          <div className="flex items-center gap-3">
            <span
              className="shrink-0 w-14 h-14 rounded-2xl flex items-center justify-center border border-red/40"
              style={{ background: "linear-gradient(150deg, rgb(215 15 49 / .18), rgb(6 11 19 / .6))" }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={`${ASSET}/icons/phone.svg`} alt="" width={26} height={26} style={{ filter: "invert(1)" }} />
            </span>
            <div>
              <p className="text-[.7rem] tracking-[.18em] uppercase font-extrabold text-gold">Devices</p>
              <h2 id="get-app-title" className="font-display text-2xl text-[#F7FAFF] leading-tight">
                Get the App
              </h2>
            </div>
          </div>

          {standalone ? (
            <div className="rounded-xl border border-[#304055] bg-[#101A28] px-4 py-4 text-sm text-[#B3C2D4]">
              <span className="font-semibold text-[#F7FAFF]">You&apos;re already using the installed app.</span>{" "}
              Nothing else to do here.
            </div>
          ) : (
            <>
              <p className="text-sm text-[#B3C2D4]">
                Install END IT ATLANTA straight from your browser -- no app store needed. It
                works like a real app: its own icon, full-screen, and notifications.
              </p>

              {deferredPrompt && (
                <div className="flex flex-col gap-2">
                  <button
                    onClick={handleInstallClick}
                    className="inline-flex items-center justify-center gap-2 rounded-full bg-red hover:bg-red-dark text-paper font-bold uppercase tracking-wide text-sm px-5 py-3.5"
                  >
                    Install Now
                  </button>
                  {installResult === "accepted" && (
                    <p className="text-xs text-[#B3C2D4] text-center">
                      Installed -- open it from your home screen.
                    </p>
                  )}
                  {installResult === "dismissed" && (
                    <p className="text-xs text-[#B3C2D4] text-center">
                      No problem -- the steps below still work anytime.
                    </p>
                  )}
                </div>
              )}

              {ios && (
                <div className="flex flex-col gap-3">
                  <p className="text-xs font-bold uppercase tracking-wide text-[#98ADC7]">
                    iPhone (Safari)
                  </p>
                  <ol className="flex flex-col gap-2.5">
                    <StepRow n={1}>Open this site in Safari</StepRow>
                    <StepRow n={2}>
                      Tap the <strong className="text-[#F7FAFF]">Share</strong> button (the box
                      with the ↑ arrow)
                    </StepRow>
                    <StepRow n={3}>
                      Scroll down → <strong className="text-[#F7FAFF]">Add to Home Screen</strong>{" "}
                      → <strong className="text-[#F7FAFF]">Add</strong>
                    </StepRow>
                  </ol>
                </div>
              )}

              {!ios && (android || !deferredPrompt) && (
                <div className="flex flex-col gap-3">
                  <p className="text-xs font-bold uppercase tracking-wide text-[#98ADC7]">
                    Android (Chrome)
                  </p>
                  <ol className="flex flex-col gap-2.5">
                    <StepRow n={1}>Open this site in Chrome</StepRow>
                    <StepRow n={2}>
                      Tap the <strong className="text-[#F7FAFF]">⋮</strong> menu (top right)
                    </StepRow>
                    <StepRow n={3}>
                      Tap <strong className="text-[#F7FAFF]">Install app</strong> (or{" "}
                      <strong className="text-[#F7FAFF]">Add to Home screen</strong>)
                    </StepRow>
                  </ol>
                </div>
              )}

              <div className="rounded-xl border border-gold/30 bg-gold/10 px-4 py-3.5 flex gap-2.5">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={`${ASSET}/icons/bell.svg`} alt="" width={16} height={16} className="mt-0.5 shrink-0" style={{ filter: "invert(1)" }} />
                <p className="text-xs text-[#F7FAFF] leading-relaxed">
                  Open the app from your new home-screen icon, then tap{" "}
                  <strong>&quot;Turn on notifications&quot;</strong> → Allow. On iPhone, push
                  notifications only work when the app is opened from the installed icon, not a
                  Safari tab -- so this step matters.
                </p>
              </div>
            </>
          )}

          <button
            onClick={close}
            className="text-sm font-semibold text-[#98ADC7] hover:text-[#F7FAFF] transition-colors py-1"
          >
            Maybe later
          </button>
        </div>
      </div>
    </div>
  );
}

function StepRow({ n, children }: { n: number; children: React.ReactNode }) {
  return (
    <li className="flex items-start gap-3">
      <span className="shrink-0 w-6 h-6 rounded-full bg-white/10 text-[#F7FAFF] text-xs font-bold flex items-center justify-center mt-0.5">
        {n}
      </span>
      <span className="text-sm text-[#B3C2D4] leading-relaxed pt-0.5">{children}</span>
    </li>
  );
}
