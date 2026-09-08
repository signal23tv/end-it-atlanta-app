"use server";

import { createClient } from "@/lib/supabase/server";

const AVATAR_COLORS = ["red", "gold", "blue", "purple", "cyan"] as const;
export type AvatarColor = (typeof AVATAR_COLORS)[number];

/**
 * Anonymous analytics logging, reusing the existing referral_events
 * table. Never includes name, email, phone, or any entered field
 * value — only the event type and campaign code, per Section 22.
 */
export type JoinEventType =
  | "join_landing_view"
  | "age_gate_blocked"
  | "eligible_form_started"
  | "form_submitted"
  | "contact_verification_completed"
  | "account_activated"
  | "installed_context_observed"
  | "notification_permission_result"
  | "push_subscription_registered"
  | "welcome_push_accepted"
  | "welcome_push_opened";

export async function logJoinEvent(eventType: JoinEventType, campaignCode: string) {
  const supabase = await createClient();
  await supabase.from("referral_events").insert({
    anonymous_session_id: `join-${crypto.randomUUID()}`,
    event_type: eventType,
    source: "join_flow",
    provider_id: campaignCode,
  });
}

export type StartJoinState = {
  error?: string;
  otpSent?: boolean;
  email?: string;
};

/**
 * Step 1: collect the 4 core fields, validate server-side (never
 * trust the client's age gate alone), and send a single email OTP.
 * This does NOT create a visible member yet -- the profile row is
 * only created by the database trigger once the code is verified
 * (see the on_auth_user_confirmed trigger).
 */
export async function startJoin(
  _prevState: StartJoinState,
  formData: FormData
): Promise<StartJoinState> {
  const displayName = String(formData.get("display_name") || "").trim();
  const email = String(formData.get("email") || "").trim();
  const phone = String(formData.get("phone") || "").trim();
  const ageBand = String(formData.get("age_band") || "");
  const avatarColor = String(formData.get("avatar_color") || "gold");
  const campaignCode = String(formData.get("campaign_code") || "").trim();

  if (!displayName || !email) {
    return { error: "Name and email are required." };
  }
  if (ageBand !== "13_17" && ageBand !== "18_plus") {
    // Defense in depth: the age gate should already have blocked
    // under-13 and unset values from reaching this form.
    return { error: "Age eligibility could not be confirmed." };
  }
  if (!(AVATAR_COLORS as readonly string[]).includes(avatarColor)) {
    return { error: "Invalid avatar selection." };
  }

  const supabase = await createClient();

  const username = `member_${crypto.randomUUID().slice(0, 8)}`;

  const { error } = await supabase.auth.signInWithOtp({
    email,
    options: {
      shouldCreateUser: true,
      data: {
        display_name: displayName,
        username,
        phone: phone || null,
        age_band: ageBand,
        avatar_color: avatarColor,
        campaign_code: campaignCode || null,
      },
    },
  });

  if (error) {
    return { error: "Couldn't send a verification code. Try again." };
  }

  await logJoinEvent("form_submitted", campaignCode);

  return { otpSent: true, email };
}

export type VerifyJoinState = {
  error?: string;
  verified?: boolean;
};

/**
 * Step 2: verify the single OTP code. On success this confirms the
 * email, which fires the trigger that creates the profile, records
 * attribution, and generates the signup receipt -- all in one
 * transactional path, and idempotent if retried.
 */
export async function verifyJoinOtp(
  _prevState: VerifyJoinState,
  formData: FormData
): Promise<VerifyJoinState> {
  const email = String(formData.get("email") || "").trim();
  const token = String(formData.get("token") || "").trim();
  const campaignCode = String(formData.get("campaign_code") || "").trim();

  if (!email || !token) {
    return { error: "Enter the code we sent you." };
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.verifyOtp({
    email,
    token,
    type: "email",
  });

  if (error) {
    return { error: "That code is incorrect or expired. Try again or resend." };
  }

  await logJoinEvent("contact_verification_completed", campaignCode);
  await logJoinEvent("account_activated", campaignCode);

  return { verified: true };
}
