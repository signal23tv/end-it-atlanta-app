import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "END IT ATLANTA",
  description:
    "One city. One mission. One person at a time. Connect, get resources, and get involved.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
