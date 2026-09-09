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
      <main className="eit-app flex-1 pb-24">
        <div className="eit-shell flex flex-col gap-5">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <span className="eit-menu-icon">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="/assets/endit/v1/icons/bell.svg" alt="" width={20} height={20} />
              </span>
              <div>
                <h1 className="text-3xl" style={{ fontFamily: "var(--eit-font-display)" }}>
                  Notifications
                </h1>
                <p className="text-sm eit-muted mt-1">
                  Real activity on your account — follows, likes, and comments.
                </p>
              </div>
            </div>
            {notifications.some((n) => !n.read) && <MarkAllReadButton />}
          </div>

          {notifications.length === 0 ? (
            <div className="eit-card eit-empty">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/assets/endit/v1/empty-states/notifications.svg" alt="" />
              <p>
                Nothing here yet. When someone follows you, likes, or comments on your posts,
                it&apos;ll show up here.
              </p>
            </div>
          ) : (
            <div className="eit-menu-group">
              {notifications.map((n) => (
                <Link
                  key={n.id}
                  href={n.actor ? `/profile/${n.actor.username}` : "/feed"}
                  className={`eit-menu-row justify-between ${!n.read ? "bg-gold/5" : ""}`}
                >
                  <span className="text-sm">{describeNotification(n)}</span>
                  <span className="text-xs eit-muted whitespace-nowrap">
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
