"use client";

import { useOptimistic, useTransition } from "react";
import { toggleRsvp } from "@/app/events/actions";

export default function RsvpButton({
  eventId,
  initiallyGoing,
  initialCount,
  signedIn,
}: {
  eventId: string;
  initiallyGoing: boolean;
  initialCount: number;
  signedIn: boolean;
}) {
  const [isPending, startTransition] = useTransition();
  const [state, setState] = useOptimistic(
    { going: initiallyGoing, count: initialCount },
    (_prev, next: { going: boolean; count: number }) => next
  );

  if (!signedIn) {
    return (
      <span className="text-xs text-[#98ADC7]">
        {initialCount} going · sign in to RSVP
      </span>
    );
  }

  return (
    <button
      disabled={isPending}
      onClick={() =>
        startTransition(async () => {
          const next = !state.going;
          setState({ going: next, count: state.count + (next ? 1 : -1) });
          await toggleRsvp(eventId, state.going);
        })
      }
      className={
        state.going
          ? "border border-[#304055] hover:border-red hover:text-red text-[#F7FAFF] font-bold uppercase tracking-wide text-xs rounded-md px-4 py-2 transition-colors disabled:opacity-60"
          : "bg-red hover:bg-red-dark disabled:opacity-60 text-paper font-bold uppercase tracking-wide text-xs rounded-md px-4 py-2 transition-colors"
      }
    >
      {state.going ? `Going · ${state.count}` : `RSVP · ${state.count} going`}
    </button>
  );
}
