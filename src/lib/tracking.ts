"use client";

/**
 * Privacy-preserving referral tracking, ported from the original
 * static site's js/tracking.js. Fires anonymous, non-sensitive
 * events into the existing `referral_events` table. No names,
 * phone numbers, emails, ZIP codes, or free text are ever sent
 * through this file. Uses the same anon-key RLS-scoped insert
 * policy the static site relied on (see supabase/schema.sql).
 */

import { createClient } from "@/lib/supabase/client";

export type ReferralEventType =
  | "first_step_clicked"
  | "service_selected"
  | "resource_viewed"
  | "call_clicked"
  | "text_clicked"
  | "email_clicked"
  | "directions_clicked"
  | "official_site_clicked"
  | "help_form_started"
  | "help_form_submitted"
  | "followup_confirmed"
  | "education_section_viewed"
  | "education_board_opened"
  | "education_source_clicked"
  | "education_to_action_clicked";

type EventProps = {
  provider_id?: string;
  location_id?: string;
  service_type?: "testing" | "prep" | "pep" | "sti" | "unsure";
  action?: "call" | "text" | "email" | "directions" | "official_site";
  source?: string;
};

const SESSION_KEY = "eia_session_id";

function getAnonymousSessionId(): string {
  try {
    let id = window.localStorage.getItem(SESSION_KEY);
    if (!id) {
      id =
        window.crypto && "randomUUID" in window.crypto
          ? window.crypto.randomUUID()
          : `${Date.now()}-${Math.random().toString(36).slice(2)}`;
      window.localStorage.setItem(SESSION_KEY, id);
    }
    return id;
  } catch {
    return `${Date.now()}-${Math.random().toString(36).slice(2)}`;
  }
}

function getUtmParams() {
  const params = new URLSearchParams(window.location.search);
  return {
    utm_source: params.get("utm_source") || undefined,
    utm_medium: params.get("utm_medium") || undefined,
    utm_campaign: params.get("utm_campaign") || undefined,
  };
}

/**
 * Fire a referral event. Never throws, never blocks navigation.
 */
export function sendReferralEvent(eventType: ReferralEventType, props: EventProps = {}) {
  try {
    const supabase = createClient();
    supabase
      .from("referral_events")
      .insert({
        anonymous_session_id: getAnonymousSessionId(),
        event_type: eventType,
        ...getUtmParams(),
        ...props,
      })
      .then(() => {});
  } catch {
    // Never let tracking break the page.
  }
}

export type ConnectionRequestFields = {
  first_name_or_nickname: string;
  contact_method: "phone" | "text" | "email";
  contact_value: string;
  zip_code: string | null;
  service_interest: "testing" | "prep" | "pep" | "sti" | "unsure";
  preferred_time: "morning" | "afternoon" | "evening" | null;
  consent_at: string;
  status: "new";
};

export async function submitConnectionRequest(
  fields: ConnectionRequestFields
): Promise<{ ok: boolean }> {
  try {
    const supabase = createClient();
    const { error } = await supabase.from("connection_requests").insert(fields);
    return { ok: !error };
  } catch {
    return { ok: false };
  }
}
