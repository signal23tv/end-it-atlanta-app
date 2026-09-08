import { redirect } from "next/navigation";
import Nav from "@/components/Nav";
import BottomNav from "@/components/BottomNav";
import { createClient } from "@/lib/supabase/server";
import NotificationSettingsForm from "@/components/NotificationSettingsForm";

export default async function NotificationSettingsPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const [{ data: prefs }, { data: devices }] = await Promise.all([
    supabase
      .from("notification_preferences")
      .select(
        "master, category_service, category_messages, category_navigator, category_events, category_education, category_prep_tv, category_ambassador, category_reminders"
      )
      .eq("user_id", user.id)
      .single(),
    supabase
      .from("push_subscriptions")
      .select("endpoint, last_seen_at, revoked_at")
      .eq("user_id", user.id)
      .order("last_seen_at", { ascending: false }),
  ]);

  if (!prefs) redirect("/login");

  return (
    <>
      <Nav />
      <main className="flex-1 bg-black text-paper pb-24">
        <div className="max-w-lg mx-auto px-4 py-6">
          <h1 className="text-3xl mb-4">NOTIFICATIONS</h1>
          <NotificationSettingsForm initialPrefs={prefs} devices={devices ?? []} />
        </div>
      </main>
      <BottomNav />
    </>
  );
}
