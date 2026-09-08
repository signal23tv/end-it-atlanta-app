"use client";

import { useActionState } from "react";
import { joinNutJuiceWaitlist, type WaitlistState } from "@/app/nut-juice/actions";

const initialState: WaitlistState = {};

export default function NutJuiceWaitlistForm() {
  const [state, formAction, pending] = useActionState(joinNutJuiceWaitlist, initialState);

  if (state?.success) {
    return (
      <div className="rounded-xl border border-gold bg-gold/10 p-5 text-center">
        <p className="font-bold">You&apos;re on the list.</p>
        <p className="text-sm text-muted mt-1">
          We&apos;ll email you when Nut Juice is ready to launch.
        </p>
      </div>
    );
  }

  return (
    <form action={formAction} className="flex flex-col gap-3">
      <input
        type="email"
        name="email"
        required
        placeholder="you@email.com"
        className="rounded-md border border-white/20 bg-white/5 px-4 py-3 text-paper placeholder:text-muted outline-none focus:border-gold"
      />
      {state?.error && (
        <p role="alert" className="text-red text-sm font-semibold">
          {state.error}
        </p>
      )}
      <button
        type="submit"
        disabled={pending}
        className="bg-gradient-to-r from-purple-500 to-pink-500 hover:brightness-110 disabled:opacity-60 text-white font-bold uppercase tracking-wide rounded-md px-6 py-3 transition"
      >
        {pending ? "Joining…" : "Join the Waitlist"}
      </button>
    </form>
  );
}
