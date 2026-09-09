import Nav from "@/components/Nav";
import BottomNav from "@/components/BottomNav";
import ToddLauncher from "@/components/ToddLauncher";
import HealthReminders from "@/components/HealthReminders";
import { listReminders } from "@/app/my-health/actions";

export const metadata = {
  title: "My Health | END IT ATLANTA",
  description: "Private appointment and refill reminders, visible only to you.",
};

export default async function MyHealthPage() {
  const reminders = await listReminders();

  return (
    <>
      <Nav />
      <main className="eit-app flex-1 pb-24">
        <div className="eit-shell flex flex-col gap-4">
          <div
            className="rounded-2xl p-5"
            style={{
              backgroundImage:
                "linear-gradient(180deg, rgb(6 11 19 / .55), rgb(6 11 19 / .92)), url(/assets/endit/v1/backgrounds/atmosphere-purple.svg)",
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          >
            <h1 className="text-3xl" style={{ fontFamily: "var(--eit-font-display)" }}>
              My Health
            </h1>
            <p className="eit-muted text-sm">
              Private reminders and appointments -- visible only to you.
            </p>
          </div>

          <div className="rounded-lg border border-white/10 bg-white/5 p-4 text-xs text-[#B3C2D4]">
            These reminders are private. They&apos;re not shared with your profile, other
            members, or anyone else -- only you can see them.
          </div>

          <HealthReminders initial={reminders} />
        </div>
      </main>
      <ToddLauncher />
      <BottomNav />
    </>
  );
}
