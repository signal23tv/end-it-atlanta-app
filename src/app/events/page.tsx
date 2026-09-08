import Nav from "@/components/Nav";
import BottomNav from "@/components/BottomNav";
import ToddLauncher from "@/components/ToddLauncher";
import EventsTabs from "@/components/EventsTabs";
import { EVENTS } from "@/lib/events-data";

export const metadata = {
  title: "Events | END IT ATLANTA",
  description: "Community events from END IT ATLANTA.",
};

export default function EventsPage() {
  return (
    <>
      <Nav />
      <main className="flex-1 bg-black text-paper pb-24">
        <div className="max-w-2xl mx-auto px-4 py-8 flex flex-col gap-6">
          <div>
            <h1 className="font-display text-3xl">Events</h1>
            <p className="text-sm text-muted mt-1">Community. Education. Action.</p>
          </div>
          <EventsTabs events={EVENTS} />
        </div>
      </main>
      <ToddLauncher />
      <BottomNav />
    </>
  );
}
