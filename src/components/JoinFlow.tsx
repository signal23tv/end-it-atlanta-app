"use client";

import { useActionState, useEffect, useState } from "react";
import Link from "next/link";
import {
  startJoin,
  verifyJoinOtp,
  logJoinEvent,
  type StartJoinState,
  type VerifyJoinState,
} from "@/app/join/actions";

type Step = "age_gate" | "blocked" | "form" | "otp" | "success";

const AVATAR_SWATCHES: { value: string; hex: string; label: string }[] = [
  { value: "red", hex: "#e5161c", label: "Red" },
  { value: "gold", hex: "#d5a94b", label: "Gold" },
  { value: "blue", hex: "#3b82f6", label: "Blue" },
  { value: "purple", hex: "#8b5cf6", label: "Purple" },
  { value: "cyan", hex: "#06b6d4", label: "Cyan" },
];

function initials(name: string) {
  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase() || "")
    .join("");
}

const startJoinInitial: StartJoinState = {};
const verifyInitial: VerifyJoinState = {};

export default function JoinFlow({
  campaignCode,
  campaignName,
}: {
  campaignCode: string;
  campaignName: string;
}) {
  const [step, setStep] = useState<Step>("age_gate");
  const [displayName, setDisplayName] = useState("");
  const [avatarColor, setAvatarColor] = useState("gold");
  const [ageBand, setAgeBand] = useState<"" | "13_17" | "18_plus">("");

  const [startState, startAction, startPending] = useActionState(
    startJoin,
    startJoinInitial
  );
  const [verifyState, verifyAction, verifyPending] = useActionState(
    verifyJoinOtp,
    verifyInitial
  );

  useEffect(() => {
    logJoinEvent("join_landing_view", campaignCode);
  }, [campaignCode]);

  useEffect(() => {
    if (startState.otpSent) setStep("otp");
  }, [startState.otpSent]);

  useEffect(() => {
    if (verifyState.verified) setStep("success");
  }, [verifyState.verified]);

  function chooseAge(band: "under_13" | "13_17" | "18_plus") {
    if (band === "under_13") {
      logJoinEvent("age_gate_blocked", campaignCode);
      setStep("blocked");
      return;
    }
    setAgeBand(band);
    logJoinEvent("eligible_form_started", campaignCode);
    setStep("form");
  }

  const swatchHex =
    AVATAR_SWATCHES.find((s) => s.value === avatarColor)?.hex ?? "#d5a94b";

  return (
    <main className="min-h-screen flex items-center justify-center bg-black text-paper px-4 py-12">
      <div className="w-full max-w-sm">
        <Link
          href="/"
          className="block text-center font-display text-3xl tracking-wide mb-2"
        >
          END IT ATLANTA
        </Link>
        <p className="text-center text-muted text-sm mb-8">{campaignName}</p>

        {step === "age_gate" && (
          <div className="bg-paper text-black rounded-xl p-6 flex flex-col gap-4">
            <h1 className="text-2xl">Before we get started</h1>
            <p className="text-sm">
              What&apos;s your age? This helps us show you the right
              experience.
            </p>
            <div className="flex flex-col gap-2">
              <button
                onClick={() => chooseAge("18_plus")}
                className="bg-red hover:bg-red-dark text-paper font-bold uppercase tracking-wide rounded-md py-3"
              >
                18 or older
              </button>
              <button
                onClick={() => chooseAge("13_17")}
                className="border border-black/20 hover:border-gold font-bold uppercase tracking-wide rounded-md py-3"
              >
                13–17
              </button>
              <button
                onClick={() => chooseAge("under_13")}
                className="border border-black/20 hover:border-gold font-bold uppercase tracking-wide rounded-md py-3"
              >
                Under 13
              </button>
            </div>
          </div>
        )}

        {step === "blocked" && (
          <div className="bg-paper text-black rounded-xl p-6 flex flex-col gap-3 text-center">
            <h1 className="text-2xl">Thanks for stopping by</h1>
            <p className="text-sm">
              This account experience isn&apos;t available yet for this age
              group. You can still explore public education and resources
              without an account.
            </p>
            <Link
              href="/"
              className="mt-2 bg-red hover:bg-red-dark text-paper font-bold uppercase tracking-wide rounded-md py-3"
            >
              Explore resources
            </Link>
          </div>
        )}

        {step === "form" && (
          <form
            action={startAction}
            className="bg-paper text-black rounded-xl p-6 flex flex-col gap-4"
          >
            <h1 className="text-2xl">Create your account</h1>

            <input type="hidden" name="age_band" value={ageBand} />
            <input type="hidden" name="campaign_code" value={campaignCode} />
            <input type="hidden" name="avatar_color" value={avatarColor} />

            <div className="flex items-center gap-3">
              <div
                className="w-14 h-14 rounded-full flex items-center justify-center font-display text-xl text-white shrink-0"
                style={{ backgroundColor: swatchHex }}
                aria-hidden="true"
              >
                {initials(displayName) || "?"}
              </div>
              <div className="flex gap-2">
                {AVATAR_SWATCHES.map((s) => (
                  <button
                    key={s.value}
                    type="button"
                    onClick={() => setAvatarColor(s.value)}
                    aria-label={`Use ${s.label} avatar`}
                    aria-pressed={avatarColor === s.value}
                    className={`w-6 h-6 rounded-full border-2 ${
                      avatarColor === s.value
                        ? "border-black"
                        : "border-transparent"
                    }`}
                    style={{ backgroundColor: s.hex }}
                  />
                ))}
              </div>
            </div>

            <label className="flex flex-col gap-1 text-sm font-semibold">
              Name (a nickname is fine)
              <input
                name="display_name"
                type="text"
                required
                maxLength={60}
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                className="rounded-md border border-black/15 px-3 py-2 text-base font-normal outline-none focus:border-gold"
              />
            </label>

            <label className="flex flex-col gap-1 text-sm font-semibold">
              Email
              <input
                name="email"
                type="email"
                required
                autoComplete="email"
                className="rounded-md border border-black/15 px-3 py-2 text-base font-normal outline-none focus:border-gold"
              />
            </label>

            <label className="flex flex-col gap-1 text-sm font-semibold">
              Phone <span className="font-normal text-muted">(optional)</span>
              <input
                name="phone"
                type="tel"
                autoComplete="tel"
                className="rounded-md border border-black/15 px-3 py-2 text-base font-normal outline-none focus:border-gold"
              />
            </label>

            <p className="text-xs text-muted">
              Your email and phone are private contact info, never shown on
              your profile. We&apos;ll send a one-time code to your email to
              confirm it&apos;s you.
            </p>

            {startState?.error && (
              <p role="alert" className="text-red-dark text-sm font-semibold">
                {startState.error}
              </p>
            )}

            <button
              type="submit"
              disabled={startPending}
              className="mt-1 bg-red hover:bg-red-dark disabled:opacity-60 text-paper font-bold uppercase tracking-wide rounded-md py-3 transition-colors"
            >
              {startPending ? "Sending code…" : "Send me a code"}
            </button>
          </form>
        )}

        {step === "otp" && (
          <form
            action={verifyAction}
            className="bg-paper text-black rounded-xl p-6 flex flex-col gap-4"
          >
            <h1 className="text-2xl">Check your email</h1>
            <p className="text-sm">
              Enter the code we sent to {startState.email}.
            </p>

            <input type="hidden" name="email" value={startState.email} />
            <input type="hidden" name="campaign_code" value={campaignCode} />

            <label className="flex flex-col gap-1 text-sm font-semibold">
              6-digit code
              <input
                name="token"
                type="text"
                inputMode="numeric"
                pattern="[0-9]*"
                maxLength={6}
                required
                autoFocus
                className="rounded-md border border-black/15 px-3 py-2 text-lg tracking-widest text-center font-normal outline-none focus:border-gold"
              />
            </label>

            {verifyState?.error && (
              <p role="alert" className="text-red-dark text-sm font-semibold">
                {verifyState.error}
              </p>
            )}

            <button
              type="submit"
              disabled={verifyPending}
              className="mt-1 bg-red hover:bg-red-dark disabled:opacity-60 text-paper font-bold uppercase tracking-wide rounded-md py-3 transition-colors"
            >
              {verifyPending ? "Verifying…" : "Verify"}
            </button>
          </form>
        )}

        {step === "success" && (
          <div className="bg-paper text-black rounded-xl p-6 flex flex-col gap-3 text-center">
            <h1 className="text-2xl">You&apos;re in.</h1>
            <p className="text-sm">Welcome to END IT ATLANTA.</p>
            <Link
              href="/feed"
              className="mt-2 bg-red hover:bg-red-dark text-paper font-bold uppercase tracking-wide rounded-md py-3"
            >
              Continue
            </Link>
          </div>
        )}
      </div>
    </main>
  );
}
