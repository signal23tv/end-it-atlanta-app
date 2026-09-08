import Link from "next/link";
import Nav from "@/components/Nav";
import BottomNav from "@/components/BottomNav";
import ToddLauncher from "@/components/ToddLauncher";
import { getNotifications } from "./actions";
import MarkAllReadButton from "@/components/MarkAllReadButton";

function timeAgo(iso: string): string {
  const seconds = Math.floor((Date.now() - new Date(iso).getTime()) / 1000);
  if (seconds < 60) return "just now";
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

function describeNotification(n: Awaited<ReturnType<typeof getNotifications>>[number]) {
  const name = n.actor?.display_name ?? "Someone";
  switch (n.type) {
    case "follow":
      return `${name} started following you.`;
    case "like":
      return `${name} liked your post.`;
    case "comment":
      return `${name} commented on your post.`;
    default:
      return `${name} did something.`;
  }
}

export default async function NotificationsPage() {
  const notifications = await getNotifications();

  return (
    <>
      <Nav />
      <main className="flex-1 bg-black text-paper pb-24">
        <div className="max-w-2xl mx-auto px-4 py-8 flex flex-col gap-5">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="font-display text-3xl">Notifications</h1>
              <p className="text-sm text-muted mt-1">
                Real activity on your account — follows, likes, and comments.
              </p>
            </div>
            {notifications.some((n) => !n.read) && <MarkAllReadButton />}
          </div>

          {notifications.length === 0 ? (
            <p className="text-muted text-center py-16">
              Nothing here yet. When someone follows you, likes, or comments on your posts,
              it'll show up here.
            </p>
          ) : (
            <div className="flex flex-col divide-y divide-white/10 rounded-xl border border-white/10 overflow-hidden">
              {notifications.map((n) => (
                <Link
                  key={n.id}
                  href={n.actor ? `/profile/${n.actor.username}` : "/feed"}
                  className={`flex items-center justify-between gap-3 px-4 py-3.5 hover:bg-white/5 ${
                    !n.read ? "bg-gold/5" : ""
                  }`}
                >
                  <span className="text-sm">{describeNotification(n)}</span>
                  <span className="text-xs text-muted whitespace-nowrap">
                    {timeAgo(n.created_at)}
                  </span>
                </Link>
              ))}
            </div>
          )}

          <p className="text-xs text-muted text-center">
            Want push alerts for these too?{" "}
            <Link href="/settings/notifications" className="text-gold hover:underline">
              Manage notification settings
            </Link>
          </p>
        </div>
      </main>
      <ToddLauncher />
      <BottomNav />
    </>
  );
}
