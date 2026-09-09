import type { Metadata } from "next";
import Nav from "@/components/Nav";
import MarketingHeader from "@/components/MarketingHeader";
import BottomNav from "@/components/BottomNav";
import ToddLauncher from "@/components/ToddLauncher";
import GetConnectedClient from "@/components/GetConnectedClient";
import { createClient } from "@/lib/supabase/server";

export const metadata: Metadata = {
  title: "Get Connected to HIV Testing and PrEP Resources | END IT ATLANTA",
  description:
    "Find Atlanta-area HIV testing, PrEP, sexual-health resources, clinic contact information, directions, and personal connection support.",
};

export default async function GetConnectedPage() {
  // This page is reachable two ways: signed-in members via the Explore
  // tab (app shell), and anonymous visitors from outreach QR codes /
  // campaign links (marketing funnel, no account yet). Show the right
  // header for each rather than forcing one experience on both.
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <>
      {user ? <Nav /> : <MarketingHeader />}
      <main className="eit-app flex-1 pb-24">
        <GetConnectedClient />
      </main>
      {user && <ToddLauncher />}
      <BottomNav />
    </>
  );
}
