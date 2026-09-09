"use client";

import { useTransition } from "react";
import { startConversation } from "@/app/messages/actions";

export default function MessageButton({ targetUserId }: { targetUserId: string }) {
  const [isPending, startTransition] = useTransition();

  return (
    <button
      disabled={isPending}
      onClick={() => startTransition(() => startConversation(targetUserId))}
      className="border border-[#304055] hover:border-gold text-[#F7FAFF] font-bold uppercase tracking-wide text-sm rounded-md px-5 py-2 transition-colors disabled:opacity-60"
    >
      Message
    </button>
  );
}
