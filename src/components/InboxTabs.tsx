"use client";

import { useState } from "react";
import Link from "next/link";
import { TODD_CONTACT } from "@/lib/resources-data";
import type { ConversationSummary } from "@/app/messages/actions";

const ASSET = "/assets/endit/v1";

type Tab = "direct" | "todd" | "navigator";

function timeAgo(iso: string) {
  const diffMs = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diffMs / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days}d`;
  return new Date(iso).toLocaleDateString();
}

function DirectPanel({ conversations }: { conversations: ConversationSummary[] }) {
  if (conversations.length === 0) {
    return (
      <div className="eit-card eit-empty">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={`${ASSET}/empty-states/messages.svg`} alt="" />
        <p>No conversations yet -- message someone from their profile to start one.</p>
        <Link href="/discover" className="text-gold text-sm hover:underline mt-1">
          Find people
        </Link>
      </div>
    );
  }

  return (
    <div className="flex flex-col divide-y divide-[#304055] rounded-xl border border-[#304055] overflow-hidden">
      {conversations.map((c) => (
        <Link
          key={c.id}
          href={`/messages/${c.id}`}
          className="flex items-center gap-3 px-4 py-3.5 bg-[#101A28] hover:bg-[#142133] transition-colors"
        >
          <div className="w-11 h-11 shrink-0 rounded-full bg-gold/20 text-gold flex items-center justify-center font-bold uppercase">
            {c.otherUser.display_name?.[0] ?? c.otherUser.username[0]}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between gap-2">
              <p className="font-semibold text-sm text-[#F7FAFF] truncate">
                {c.otherUser.display_name ?? c.otherUser.username}
              </p>
              <span className="text-[11px] text-[#98ADC7] shrink-0">{timeAgo(c.lastMessageAt)}</span>
            </div>
            <p className={`text-xs truncate ${c.unread ? "text-[#F7FAFF] font-semibold" : "text-[#98ADC7]"}`}>
              {c.lastMessageBody ?? "Say hello…"}
            </p>
          </div>
          {c.unread && <span className="w-2 h-2 rounded-full bg-red shrink-0" />}
        </Link>
      ))}
    </div>
  );
}

function ToddPanel() {
  return (
    <Link href="/todd" className="eit-card eit-todd-card">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={`${ASSET}/todd/todd-avatar.webp`}
        alt="Todd the PrEP God"
        className="eit-avatar"
      />
      <div>
        <h3>Todd the PrEP God</h3>
        <p className="eit-muted">
          Your 24/7 sexual health assistant. Ask him anything, any time.
        </p>
      </div>
    </Link>
  );
}

function NavigatorPanel() {
  return (
    <div className="rounded-xl border border-[#304055] bg-[#101A28] p-5 flex flex-col gap-4">
      <div className="flex items-center gap-3">
        <div className="w-14 h-14 shrink-0 rounded-full bg-[#0082FF]/20 text-[#0082FF] flex items-center justify-center font-bold uppercase text-lg">
          {TODD_CONTACT.name[0]}
        </div>
        <div>
          <p className="font-semibold text-[#F7FAFF]">{TODD_CONTACT.name}</p>
          <p className="text-xs text-[#98ADC7]">{TODD_CONTACT.role}</p>
        </div>
      </div>
      <p className="text-sm text-[#B3C2D4]">
        Your real point of contact for help connecting to testing, PrEP, and other
        resources. Not a chatbot -- reach out directly.
      </p>
      <div className="flex flex-col gap-2">
        <a
          href={`tel:${TODD_CONTACT.phoneTel}`}
          className="rounded-md border border-[#304055] hover:border-gold text-[#F7FAFF] text-sm font-semibold px-4 py-2.5 text-center transition-colors"
        >
          Call · {TODD_CONTACT.phoneDisplay}
        </a>
        <a
          href={`sms:${TODD_CONTACT.phoneTel}`}
          className="rounded-md border border-[#304055] hover:border-gold text-[#F7FAFF] text-sm font-semibold px-4 py-2.5 text-center transition-colors"
        >
          Text · {TODD_CONTACT.phoneDisplay}
        </a>
        <a
          href={`mailto:${TODD_CONTACT.email}?subject=${encodeURIComponent(
            TODD_CONTACT.emailSubject
          )}&body=${encodeURIComponent(TODD_CONTACT.emailBody)}`}
          className="rounded-md border border-[#304055] hover:border-gold text-[#F7FAFF] text-sm font-semibold px-4 py-2.5 text-center transition-colors break-all"
        >
          Email · {TODD_CONTACT.email}
        </a>
      </div>
    </div>
  );
}

export default function InboxTabs({ conversations }: { conversations: ConversationSummary[] }) {
  const [tab, setTab] = useState<Tab>("direct");
  const unreadCount = conversations.filter((c) => c.unread).length;

  return (
    <div className="flex flex-col gap-4">
      <div role="tablist" aria-label="Messages" className="flex gap-2 rounded-lg bg-white/5 p-1 w-fit">
        {(
          [
            { key: "direct", label: unreadCount > 0 ? `Direct (${unreadCount})` : "Direct" },
            { key: "todd", label: "Todd" },
            { key: "navigator", label: "Navigator" },
          ] as { key: Tab; label: string }[]
        ).map((t) => (
          <button
            key={t.key}
            role="tab"
            aria-selected={tab === t.key}
            onClick={() => setTab(t.key)}
            className={`px-4 py-1.5 rounded-md text-sm font-semibold transition-colors ${
              tab === t.key ? "bg-gold text-black" : "text-[#B3C2D4] hover:text-[#F7FAFF]"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {tab === "direct" && <DirectPanel conversations={conversations} />}
      {tab === "todd" && <ToddPanel />}
      {tab === "navigator" && <NavigatorPanel />}
    </div>
  );
}
