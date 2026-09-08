import type { Metadata } from "next";
import MarketingHeader from "@/components/MarketingHeader";
import SiteFooter from "@/components/SiteFooter";
import GetConnectedClient from "@/components/GetConnectedClient";

export const metadata: Metadata = {
  title: "Get Connected to HIV Testing and PrEP Resources | END IT ATLANTA",
  description:
    "Find Atlanta-area HIV testing, PrEP, sexual-health resources, clinic contact information, directions, and personal connection support.",
};

export default function GetConnectedPage() {
  return (
    <>
      <MarketingHeader />
      <main className="flex-1 bg-paper text-black">
        <GetConnectedClient />
      </main>
      <SiteFooter />
    </>
  );
}
