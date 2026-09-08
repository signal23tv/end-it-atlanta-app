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
      aria-label="Chat with Todd"
      className="fixed z-40 right-4 bottom-[calc(72px+env(safe-area-inset-bottom))] w-14 h-14 rounded-full bg-gradient-to-br from-gold to-red flex items-center justify-center shadow-lg shadow-black/40 ring-2 ring-black/20 hover:brightness-110 transition"
    >
      <svg viewBox="0 0 24 24" width="26" height="26" fill="none" stroke="black" strokeWidth={1.5}>
        <path d="M12 2 9.5 8H4l4.5 4L7 18l5-3.5L17 18l-1.5-6L20 8h-5.5L12 2Z" strokeLinejoin="round" fill="black" />
      </svg>
    </Link>
  );
}
