"use client";

import { useEffect } from "react";

/**
 * Registers the service worker. Feature-detected -- older/unsupported
 * browsers simply don't get offline/install/push behavior, and
 * nothing else in the app depends on it working (Section 4).
 */
export default function ServiceWorkerRegister() {
  useEffect(() => {
    if (!("serviceWorker" in navigator)) return;
    navigator.serviceWorker.register("/sw.js").catch(() => {
      // Registration failure never blocks the app.
    });
  }, []);

  return null;
}
