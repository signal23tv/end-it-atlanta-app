"use client";

import { useActionState, useEffect, useState, type ChangeEvent } from "react";
import Link from "next/link";
import {
  startJoin,
  logJoinEvent,
  type StartJoinState,
} from "@/app/join/actions";
import InstallPrompt from "@/components/InstallPrompt";
import NotificationSetup from "@/components/NotificationSetup";
import { resizeImageToDataUrl } from "@/lib/resizeImage";

type Step =
  | "age_gate"
  | "blocked"
  | "form"
  | "success"
  | "install"
  | "notifications";

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
  const [avatarDataUrl, setAvatarDataUrl] = useState<string | null>(null);
  const [photoError, setPhotoError] = useState<string | null>(null);
  const [ageBand, setAgeBand] = useState<"" | "13_17" | "18_plus">("");

  async function onPhotoPicked(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      setPhotoError("Please choose an image file.");
      return;
    }
    try {
      setPhotoError(null);
      const dataUrl = await resizeImageToDataUrl(file);
      setAvatarDataUrl(dataUrl);
    } catch {
      setPhotoError("Couldn't use that photo -- try a different one.");
    }
  }

  const [startState, startAction, startPending] = useActionState(
    startJoin,
    startJoinInitial
  );

  useEffect(() => {
    logJoinEvent("join_landing_view", campaignCode);
  }, [campaignCode]);

  useEffect(() => {
    if (startState.activated) setStep("success");
  }, [startState.activated]);

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
    <main
      className="min-h-screen flex items-center justify-center bg-black text-paper px-4 py-12 relative"
      style={{
        backgroundImage:
          "linear-gradient(180deg, rgb(6 11 19 / .85), rgb(6 11 19 / .97)), url(/assets/endit/v1/backgrounds/atmosphere-blue.svg)",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div className="w-full max-w-sm">
        <Link href="/" className="flex justify-center mb-2">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/assets/endit/v1/brand/endit-wordmark-vector.svg"
            alt="END IT ATLANTA"
            className="h-8 w-auto"
          />
        </Link>
        <p className="text-center text-muted text-sm mb-8">{campaignName}</p>

        {step === "age_gate" && (
          <div className="bg-[#101A28] border border-[#304055] text-[#F7FAFF] rounded-xl p-6 flex flex-col gap-4">
            <h1 className="text-2xl">Before we get started</h1>
            <p className="text-sm text-[#B3C2D4]">
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
                className="border border-[#304055] hover:border-gold text-[#F7FAFF] font-bold uppercase tracking-wide rounded-md py-3"
              >
                13–17
              </button>
              <button
                onClick={() => chooseAge("under_13")}
                className="border border-[#304055] hover:border-gold text-[#F7FAFF] font-bold uppercase tracking-wide rounded-md py-3"
              >
                Under 13
              </button>
            </div>
          </div>
        )}

        {step === "blocked" && (
          <div className="bg-[#101A28] border border-[#304055] text-[#F7FAFF] rounded-xl p-6 flex flex-col gap-3 text-center">
            <h1 className="text-2xl">Thanks for stopping by</h1>
            <p className="text-sm text-[#B3C2D4]">
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
            className="bg-[#101A28] border border-[#304055] text-[#F7FAFF] rounded-xl p-6 flex flex-col gap-4"
          >
            <h1 className="text-2xl">Create your account</h1>

            <input type="hidden" name="age_band" value={ageBand} />
            <input type="hidden" name="campaign_code" value={campaignCode} />
            <input type="hidden" name="avatar_color" value={avatarColor} />
            <input type="hidden" name="avatar_data_url" value={avatarDataUrl ?? ""} />

            <div className="flex items-center gap-3">
              <label className="relative shrink-0 cursor-pointer group">
                {avatarDataUrl ? (
                  /* eslint-disable-next-line @next/next/no-img-element */
                  <img
                    src={avatarDataUrl}
                    alt=""
                    className="w-14 h-14 rounded-full object-cover ring-2 ring-white/10"
                  />
                ) : (
                  <div
                    className="w-14 h-14 rounded-full flex items-center justify-center font-display text-xl text-white ring-2 ring-white/10"
                    style={{ backgroundColor: swatchHex }}
                    aria-hidden="true"
                  >
                    {initials(displayName) || "?"}
                  </div>
                )}
                <span className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-[#0A1422] border border-[#304055] flex items-center justify-center group-hover:border-gold transition-colors">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src="/assets/endit/v1/icons/camera.svg"
                    alt=""
                    width={10}
                    height={10}
                    style={{ filter: "invert(1)" }}
                  />
                </span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={onPhotoPicked}
                  className="sr-only"
                />
              </label>
              <div className="flex flex-col gap-1.5">
                <p className="text-xs text-[#98ADC7]">
                  {avatarDataUrl ? "Photo added -- tap to change" : "Add a photo, or pick a color"}
                </p>
                <div className="flex gap-2">
                  {AVATAR_SWATCHES.map((s) => (
                    <button
                      key={s.value}
                      type="button"
                      onClick={() => {
                        setAvatarColor(s.value);
                        setAvatarDataUrl(null);
                      }}
                      aria-label={`Use ${s.label} avatar`}
                      aria-pressed={!avatarDataUrl && avatarColor === s.value}
                      className={`w-6 h-6 rounded-full border-2 ${
                        !avatarDataUrl && avatarColor === s.value
                          ? "border-[#7DD3FC]"
                          : "border-transparent"
                      }`}
                      style={{ backgroundColor: s.hex }}
                    />
                  ))}
                </div>
              </div>
            </div>
            {photoError && (
              <p className="text-[#FF91A2] text-xs font-semibold -mt-2">{photoError}</p>
            )}

            <label className="flex flex-col gap-1 text-sm font-semibold">
              Name (a nickname is fine)
              <input
                name="display_name"
                type="text"
                required
                maxLength={60}
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                className="rounded-md border border-[#304055] bg-[#0A1422] text-[#F7FAFF] px-3 py-2 text-base font-normal outline-none focus:border-gold"
              />
            </label>

            <label className="flex flex-col gap-1 text-sm font-semibold">
              Email
              <input
                name="email"
                type="email"
                required
                autoComplete="email"
                className="rounded-md border border-[#304055] bg-[#0A1422] text-[#F7FAFF] px-3 py-2 text-base font-normal outline-none focus:border-gold"
              />
            </label>

            <label className="flex flex-col gap-1 text-sm font-semibold">
              Phone <span className="font-normal text-[#B3C2D4]">(optional)</span>
              <input
                name="phone"
                type="tel"
                autoComplete="tel"
                className="rounded-md border border-[#304055] bg-[#0A1422] text-[#F7FAFF] px-3 py-2 text-base font-normal outline-none focus:border-gold"
              />
            </label>

            <p className="text-xs text-[#B3C2D4]">
              Your email and phone are private contact info, never shown on
              your profile.
            </p>

            {startState?.error && (
              <p role="alert" className="text-[#FF91A2] text-sm font-semibold">
                {startState.error}
              </p>
            )}

            <button
              type="submit"
              disabled={startPending}
              className="mt-1 bg-red hover:bg-red-dark disabled:opacity-60 text-paper font-bold uppercase tracking-wide rounded-md py-3 transition-colors"
            >
              {startPending ? "Creating your account…" : "Join now"}
            </button>
          </form>
        )}

        {step === "success" && (
          <div className="bg-[#101A28] border border-[#304055] text-[#F7FAFF] rounded-xl p-6 flex flex-col gap-3 text-center">
            <h1 className="text-2xl">You&apos;re in.</h1>
            <p className="text-sm text-[#B3C2D4]">Welcome to END IT ATLANTA.</p>
            <button
              onClick={() => setStep("install")}
              className="mt-2 bg-red hover:bg-red-dark text-paper font-bold uppercase tracking-wide rounded-md py-3"
            >
              Continue
            </button>
          </div>
        )}

        {step === "install" && (
          <InstallPrompt onContinue={() => setStep("notifications")} />
        )}

        {step === "notifications" && (
          <NotificationSetup
            campaignCode={campaignCode}
            onDone={() => (window.location.href = "/feed")}
          />
        )}
      </div>
    </main>
  );
}
