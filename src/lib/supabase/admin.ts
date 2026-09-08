import { createClient as createSupabaseClient } from "@supabase/supabase-js";

/**
 * Service-role Supabase client. SERVER-ONLY -- never import this
 * from a client component, and never send this key to the browser.
 * Used exclusively to create pre-confirmed accounts for the /join
 * quick-signup flow (Henderson's call: no email/SMS verification
 * gate for now, since outreach speed matters more than confirming
 * contact info at this stage -- see IMPLEMENTATION_STATUS.md).
 *
 * This bypasses Row Level Security entirely, so it must only ever
 * be used for the narrow, specific operations below -- never as a
 * general-purpose query client.
 */
export function createAdminClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !serviceRoleKey) {
    return null;
  }

  return createSupabaseClient(url, serviceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}

export function isAdminConfigured(): boolean {
  return Boolean(process.env.SUPABASE_SERVICE_ROLE_KEY);
}
