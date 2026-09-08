"use client";

import type { ReactNode } from "react";
import { sendReferralEvent, type ReferralEventType } from "@/lib/tracking";

export default function TrackedLink({
  href,
  eventType,
  providerId,
  children,
  className,
}: {
  href: string;
  eventType: ReferralEventType;
  providerId?: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      onClick={() => sendReferralEvent(eventType, { provider_id: providerId, source: "learning_lab" })}
      className={className}
    >
      {children}
    </a>
  );
}
