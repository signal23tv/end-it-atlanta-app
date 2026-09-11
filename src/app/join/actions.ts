"use server";

import { createClient } from "@/lib/supabase/server";
import { createAdminClient, isAdminConfigured } from "@/lib/supabase/admin";

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
  activated?: boolean;
  email?: string;
};

/**
 * Collect the 4 core fields, validate server-side (never trust the
 * client's age gate alone), and create the account immediately --
 * no email/SMS verification step. This is a deliberate product
 * decision (documented in IMPLEMENTATION_STATUS.md): reducing
 * signup friction matters more than confirming contact info right
 * now, and there's no SMS provider configured anyway. Email and
 * phone are still captured and stored -- just not verified.
 *
 * Implementation: the service-role admin client creates the auth
 * user with email_confirm: true, which makes it look identical (to
 * the rest of the app) to a normal confirmed signup -- the existing
 * on_auth_user_created trigger fires immediately and creates the
 * profile, referral attribution, and signup receipt in one shot.
 * We then sign the new user in with the anon-key server client so
 * they land in an authenticated session right away.
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
  const avatarDataUrl = String(formData.get("avatar_data_url") || "").trim();
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

  if (!isAdminConfigured()) {
    return {
      error:
        "Signup isn't fully configured yet on the server (missing admin key). Contact the site owner.",
    };
  }
  const admin = createAdminClient();
  if (!admin) {
    return { error: "Signup isn't available right now. Try again shortly." };
  }

  const username = `member_${crypto.randomUUID().slice(0, 8)}`;
  const randomPassword = crypto.randomUUID() + crypto.randomUUID();

  const { data: created, error: createError } = await admin.auth.admin.createUser({
    email,
    password: randomPassword,
    email_confirm: true,
    user_metadata: {
      display_name: displayName,
      username,
      phone: phone || null,
      age_band: ageBand,
      avatar_color: avatarColor,
      campaign_code: campaignCode || null,
    },
  });

  if (createError) {
    // Most common case: email already has an account.
    if (createError.message?.toLowerCase().includes("already been registered")) {
      return {
        error: "An account with that email already exists. Try logging in instead.",
      };
    }
    return { error: "Couldn't create your account. Try again." };
  }
  if (!created?.user) {
    return { error: "Couldn't create your account. Try again." };
  }

  // Establish a real session for the new user via the cookie-aware
  // server client (separate from the admin client above).
  const supabase = await createClient();
  const { error: signInError } = await supabase.auth.signInWithPassword({
    email,
    password: randomPassword,
  });

  if (signInError) {
    // Account exists but we couldn't start a session automatically.
    // Not fatal -- they can log in with "forgot password" later --
    // but flag it rather than pretending everything's normal.
    return {
      error:
        "Your account was created, but we couldn't sign you in automatically. Try logging in.",
    };
  }

  // Optional real photo, captured as a resized data URL by the
  // client (canvas-resized before it ever hits the wire). Uploaded
  // via the admin client -- it bypasses RLS, which is fine here
  // since this is the one-shot account-creation path and we already
  // used the admin client to create the auth user above.
  if (avatarDataUrl.startsWith("data:image/")) {
    const match = avatarDataUrl.match(/^data:(image\/\w+);base64,(.+)$/);
    if (match) {
      const [, contentType, base64] = match;
      const ext = contentType === "image/png" ? "png" : "jpg";
      try {
        const bytes = Buffer.from(base64, "base64");
        const path = `${created.user.id}/avatar.${ext}`;
        const { error: uploadError } = await admin.storage
          .from("avatars")
          .upload(path, bytes, { contentType, upsert: true });
        if (!uploadError) {
          const {
            data: { publicUrl },
          } = admin.storage.from("avatars").getPublicUrl(path);
          await admin
            .from("profiles")
            .update({ avatar_url: `${publicUrl}?v=${Date.now()}` })
            .eq("id", created.user.id);
        }
      } catch {
        // Non-fatal -- the account is already created. Worst case
        // the new member falls back to their color+initials avatar
        // and can add a photo later from Settings.
      }
    }
  }

  await logJoinEvent("form_submitted", campaignCode);
  await logJoinEvent("account_activated", campaignCode);

  return { activated: true, email };
}
