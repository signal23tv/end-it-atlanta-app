import Nav from "@/components/Nav";
import BottomNav from "@/components/BottomNav";
import ToddLauncher from "@/components/ToddLauncher";
import InboxTabs from "@/components/InboxTabs";
import { listConversations } from "@/app/messages/actions";

export const metadata = {
  title: "Messages | END IT ATLANTA",
  description: "Direct messages, Todd, and your Navigator contact.",
};

export default async function MessagesPage() {
  const conversations = await listConversations();

  return (
    <>
      <Nav />
      <main className="eit-app flex-1 pb-24">
        <div className="eit-shell flex flex-col gap-4">
          <div
            className="rounded-2xl p-5"
            style={{
              backgroundImage:
                "linear-gradient(180deg, rgb(6 11 19 / .55), rgb(6 11 19 / .92)), url(/assets/endit/v1/backgrounds/atmosphere-blue.svg)",
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          >
            <h1 className="text-3xl" style={{ fontFamily: "var(--eit-font-display)" }}>
              Messages
            </h1>
            <p className="text-sm eit-muted mt-1">
              Members, Todd, and your Navigator contact -- all in one place.
            </p>
          </div>
          <InboxTabs conversations={conversations} />
        </div>
      </main>
      <ToddLauncher />
      <BottomNav />
    </>
  );
}
