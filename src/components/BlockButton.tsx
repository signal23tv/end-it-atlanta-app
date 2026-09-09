"use client";

import { useState, useTransition } from "react";
import { toggleBlock } from "@/app/moderation/actions";

export default function BlockButton({
  targetUserId,
  initiallyBlocked,
}: {
  targetUserId: string;
  initiallyBlocked: boolean;
}) {
  const [blocked, setBlocked] = useState(initiallyBlocked);
  const [confirming, setConfirming] = useState(false);
  const [isPending, startTransition] = useTransition();

  if (blocked) {
    return (
      <button
        disabled={isPending}
        onClick={() =>
          startTransition(async () => {
            await toggleBlock(targetUserId, true);
            setBlocked(false);
          })
        }
        className="text-xs text-muted hover:text-black underline"
      >
        Unblock
      </button>
    );
  }

  if (confirming) {
    return (
      <span className="inline-flex items-center gap-2 text-xs">
        Block this person?
        <button
          disabled={isPending}
          onClick={() =>
            startTransition(async () => {
              await toggleBlock(targetUserId, false);
              setBlocked(true);
              setConfirming(false);
            })
          }
          className="text-red font-bold"
        >
          Yes
        </button>
        <button onClick={() => setConfirming(false)} className="text-muted">
          Cancel
        </button>
      </span>
    );
  }

  return (
    <button
      onClick={() => setConfirming(true)}
      className="text-xs text-muted hover:text-red underline"
    >
      Block
    </button>
  );
}
