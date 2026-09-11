const AVATAR_COLORS: Record<string, string> = {
  red: "#e5161c",
  gold: "#d5a94b",
  blue: "#3b82f6",
  purple: "#8b5cf6",
  cyan: "#06b6d4",
};

function initials(name: string) {
  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase() || "")
    .join("");
}

/**
 * Single shared avatar renderer -- real uploaded photo when one
 * exists (`avatar_url`), otherwise the same colored-initials circle
 * used at signup (`avatar_color`), consistent everywhere a member is
 * shown. Before this component existed, `avatar_url` and
 * `avatar_color` were both fetched from the database in several
 * places but never actually rendered -- every avatar in the app was a
 * hardcoded gold circle regardless of what a member had actually set.
 *
 * No `"use client"` here -- this is a pure render with no browser
 * APIs, so it works directly in Server Components (profile page, post
 * lists) as well as Client Components (composer previews, settings).
 */
export default function Avatar({
  src,
  color,
  name,
  size = 40,
  ring = false,
  className = "",
}: {
  src?: string | null;
  color?: string | null;
  name: string;
  size?: number;
  ring?: boolean;
  className?: string;
}) {
  const hex = AVATAR_COLORS[color ?? "gold"] ?? AVATAR_COLORS.gold;
  const ringStyle = ring
    ? { boxShadow: "0 0 0 2px var(--eit-background, #060B13), 0 0 0 4px var(--eit-blue, #0082FF)" }
    : undefined;

  if (src) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={src}
        alt=""
        width={size}
        height={size}
        style={{ width: size, height: size, ...ringStyle }}
        className={`rounded-full object-cover shrink-0 ${className}`}
      />
    );
  }

  return (
    <div
      aria-hidden="true"
      style={{
        width: size,
        height: size,
        backgroundColor: hex,
        fontSize: Math.max(11, Math.round(size * 0.38)),
        ...ringStyle,
      }}
      className={`rounded-full flex items-center justify-center font-display text-white shrink-0 ${className}`}
    >
      {initials(name) || "?"}
    </div>
  );
}
