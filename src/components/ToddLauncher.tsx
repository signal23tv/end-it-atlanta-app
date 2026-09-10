import Link from "next/link";

/**
 * Persistent floating shortcut to Todd, shown on app-shell screens
 * other than /todd itself. Matches the mockup's always-available
 * assistant access. Positioned above BottomNav; BottomNav's own
 * "Chat" tab still works too, this is just a faster reach from
 * anywhere in the app.
 */
export default function ToddLauncher() {
  return (
    <Link
      href="/todd"
      aria-label="Chat with Todd the PrEP God"
      className="fixed z-40 right-4 bottom-[calc(72px+env(safe-area-inset-bottom))] w-14 h-14 rounded-full overflow-hidden shadow-lg shadow-black/40 ring-2 ring-gold/70 hover:brightness-110 transition"
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/assets/endit/v1/todd/todd-avatar-premium.webp"
        alt=""
        className="w-full h-full object-cover"
      />
    </Link>
  );
}
