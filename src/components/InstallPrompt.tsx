"use client";

import { useEffect, useState } from "react";

type BeforeInstallPromptEvent = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
};

function isStandalone() {
  if (typeof window === "undefined") return false;
  return (
    window.matchMedia("(display-mode: standalone)").matches ||
    // iOS Safari's own standalone flag
    (window.navigator as unknown as { standalone?: boolean }).standalone ===
      true
  );
}

function isIOS() {
  if (typeof navigator === "undefined") return false;
  return /iphone|ipad|ipod/i.test(navigator.userAgent);
}

/**
 * Feature-detected install guidance (Section 4). Chrome/Android gets
 * the native beforeinstallprompt flow with a real button. iOS gets
 * accurate Share -> Add to Home Screen instructions, since Safari
 * doesn't expose a programmatic install prompt. Anything already
 * running standalone, or an unsupported/embedded browser, shows
 * nothing rather than a broken or misleading control.
 */
export default function InstallPrompt({ onContinue }: { onContinue: () => void }) {
  const [deferredPrompt, setDeferredPrompt] =
    useState<BeforeInstallPromptEvent | null>(null);
  const [standalone, setStandalone] = useState(false);
  const [ios, setIos] = useState(false);
  const [installResult, setInstallResult] = useState<
    "idle" | "accepted" | "dismissed"
  >("idle");

  useEffect(() => {
    setStandalone(isStandalone());
    setIos(isIOS());

    function handler(e: Event) {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
    }
    window.addEventListener("beforeinstallprompt", handler);
    return () => window.removeEventListener("beforeinstallprompt", handler);
  }, []);

  async function handleInstallClick() {
    if (!deferredPrompt) return;
    await deferredPrompt.prompt();
    const choice = await deferredPrompt.userChoice;
    setInstallResult(choice.outcome);
    setDeferredPrompt(null);
  }

  if (standalone) {
    return (
      <div className="bg-[#101A28] border border-[#304055] text-[#F7FAFF] rounded-xl p-6 flex flex-col gap-3 text-center">
        <h1 className="text-2xl">You&apos;re already set up</h1>
        <p className="text-sm">
          You&apos;re using the installed app already.
        </p>
        <button
          onClick={onContinue}
          className="mt-2 bg-red hover:bg-red-dark text-paper font-bold uppercase tracking-wide rounded-md py-3"
        >
          Continue
        </button>
      </div>
    );
  }

  return (
    <div className="bg-[#101A28] border border-[#304055] text-[#F7FAFF] rounded-xl p-6 flex flex-col gap-3 text-center">
      <h1 className="text-2xl">Add to your home screen</h1>

      {deferredPrompt && (
        <>
          <p className="text-sm">
            Install END IT ATLANTA for quick access and notifications.
          </p>
          <button
            onClick={handleInstallClick}
            className="bg-red hover:bg-red-dark text-paper font-bold uppercase tracking-wide rounded-md py-3"
          >
            Install
          </button>
        </>
      )}

      {!deferredPrompt && ios && (
        <p className="text-sm">
          Tap the <strong>Share</strong> button in Safari, then{" "}
          <strong>Add to Home Screen</strong>. Open the app from your home
          screen to finish setup.
        </p>
      )}

      {!deferredPrompt && !ios && installResult === "idle" && (
        <p className="text-sm text-muted">
          Your browser doesn&apos;t support one-tap install here, or it may
          already be available from your browser&apos;s menu.
        </p>
      )}

      {installResult === "accepted" && (
        <p className="text-sm">Installed. Open it from your home screen.</p>
      )}
      {installResult === "dismissed" && (
        <p className="text-sm text-muted">
          No problem — you can install later from your browser menu.
        </p>
      )}

      <button
        onClick={onContinue}
        className="mt-1 border border-[#304055] hover:border-gold text-[#F7FAFF] font-bold uppercase tracking-wide rounded-md py-3"
      >
        Skip for now
      </button>
    </div>
  );
}
