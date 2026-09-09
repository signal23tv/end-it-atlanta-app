"use server";

import { createClient } from "@/lib/supabase/server";

export type AmbassadorCampaign = {
  id: string;
  code: string;
  name: string;
  status: string;
  signupCount: number;
  attributionCount: number;
};

/**
 * Real ambassador status for the signed-in user. Campaigns are assigned an
 * `ambassador_id` manually by the site owner (there's no self-serve
 * "become an ambassador" flow yet) -- so most users will have none, and
 * that's shown honestly rather than faked.
 */
export async function getAmbassadorCampaigns(): Promise<AmbassadorCampaign[]> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return [];

  const { data: campaigns } = await supabase
    .from("campaigns")
    .select("id, code, name, status")
    .eq("ambassador_id", user.id);

  if (!campaigns || campaigns.length === 0) return [];

  const results = await Promise.all(
    campaigns.map(async (c) => {
      const [{ count: signupCount }, { count: attributionCount }] = await Promise.all([
        supabase
          .from("signup_receipts")
          .select("*", { count: "exact", head: true })
          .eq("campaign_id", c.id),
        supabase
          .from("referral_attribution")
          .select("*", { count: "exact", head: true })
          .eq("campaign_id", c.id),
      ]);
      return {
        id: c.id,
        code: c.code,
        name: c.name,
        status: c.status,
        signupCount: signupCount ?? 0,
        attributionCount: attributionCount ?? 0,
      };
    })
  );

  return results;
}
