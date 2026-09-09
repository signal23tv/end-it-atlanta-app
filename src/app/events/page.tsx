import Nav from "@/components/Nav";
import BottomNav from "@/components/BottomNav";
import ToddLauncher from "@/components/ToddLauncher";
import EventsTabs from "@/components/EventsTabs";
import { EVENTS } from "@/lib/events-data";
import { getRsvpStates } from "@/app/events/actions";
import { createClient } from "@/lib/supabase/server";

export const metadata = {
  title: "Events | END IT ATLANTA",
  description: "Community events from END IT ATLANTA.",
};

export default async function EventsPage() {
  const supabase = await createClient();
  const [
    rsvps,
    {
      data: { user },
    },
  ] = await Promise.all([getRsvpStates(), supabase.auth.getUser()]);

  return (
    <>
      <Nav />
      <main className="eit-app flex-1 pb-24">
        <div className="eit-shell flex flex-col gap-6">
          <div
            className="rounded-2xl p-5"
            style={{
              backgroundImage:
                "linear-gradient(180deg, rgb(6 11 19 / .55), rgb(6 11 19 / .92)), url(/assets/endit/v1/backgrounds/atmosphere-red.svg)",
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          >
            <h1 className="text-3xl" style={{ fontFamily: "var(--eit-font-display)" }}>
              Events
            </h1>
            <p className="text-sm eit-muted mt-1">Community. Education. Action.</p>
          </div>
          <EventsTabs events={EVENTS} rsvps={rsvps} signedIn={Boolean(user)} />
        </div>
      </main>
      <ToddLauncher />
      <BottomNav />
    </>
  );
}
