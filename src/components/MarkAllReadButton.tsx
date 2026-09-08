"use client";

import { useTransition } from "react";
import { markAllNotificationsRead } from "@/app/notifications/actions";

export default function MarkAllReadButton() {
  const [isPending, startTransition] = useTransition();

  return (
    <button
      onClick={() => startTransition(() => markAllNotificationsRead())}
      disabled={isPending}
      className="text-xs text-gold hover:underline disabled:opacity-60"
    >
      Mark all read
    </button>
  );
}
