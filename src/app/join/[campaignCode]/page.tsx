import { createClient } from "@/lib/supabase/server";
import JoinFlow from "@/components/JoinFlow";

export default async function JoinPage({
  params,
}: {
  params: Promise<{ campaignCode: string }>;
}) {
  const { campaignCode } = await params;
  const supabase = await createClient();

  const { data: campaign } = await supabase
    .from("campaigns")
    .select("id, code, name, intent")
    .eq("code", campaignCode)
    .eq("status", "active")
    .maybeSingle();

  if (!campaign) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-black text-paper px-4 text-center">
        <div className="max-w-sm">
          <h1 className="text-3xl mb-3">This link isn&apos;t active</h1>
          <p className="text-muted mb-6">
            This invite link may have expired or been mistyped. You can still
            explore END IT ATLANTA and its resources without it.
          </p>
          <a
            href="/"
            className="inline-block bg-red hover:bg-red-dark font-bold uppercase tracking-wide rounded-md px-6 py-3 transition-colors"
          >
            Go to the homepage
          </a>
        </div>
      </main>
    );
  }

  return <JoinFlow campaignCode={campaign.code} campaignName={campaign.name} />;
}
