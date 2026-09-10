"use client";

import { useRef, useState, useTransition, type ReactNode } from "react";
import { sendToddMessage } from "@/app/todd/actions";

type Message = {
  id: string;
  role: "user" | "assistant";
  content: string;
  is_urgent_routing: boolean;
};

/**
 * Small, safe markdown renderer for Todd's replies -- handles **bold**
 * and "- " bullet lists only. Always builds real React elements from
 * plain text (React escapes text content automatically), never
 * dangerouslySetInnerHTML, so there's no way for model output to
 * inject raw HTML. Anything not recognized just renders as plain text.
 */
function parseInline(text: string, keyPrefix: string): ReactNode[] {
  const parts = text.split(/(\*\*[^*]+\*\*)/g).filter((p) => p.length > 0);
  return parts.map((part, i) =>
    part.startsWith("**") && part.endsWith("**") ? (
      <strong key={`${keyPrefix}-b-${i}`}>{part.slice(2, -2)}</strong>
    ) : (
      <span key={`${keyPrefix}-t-${i}`}>{part}</span>
    )
  );
}

function renderContent(content: string): ReactNode[] {
  const lines = content.split("\n");
  const blocks: ReactNode[] = [];
  let listBuffer: string[] = [];

  const flushList = (idx: number) => {
    if (listBuffer.length === 0) return;
    blocks.push(
      <ul key={`ul-${idx}`} className="list-disc pl-4 my-1 space-y-0.5">
        {listBuffer.map((item, i) => (
          <li key={i}>{parseInline(item, `li-${idx}-${i}`)}</li>
        ))}
      </ul>
    );
    listBuffer = [];
  };

  lines.forEach((line, idx) => {
    const trimmed = line.trim();
    if (trimmed.startsWith("- ") || trimmed.startsWith("* ")) {
      listBuffer.push(trimmed.slice(2));
      return;
    }
    flushList(idx);
    if (trimmed.length === 0) {
      blocks.push(<div key={`sp-${idx}`} className="h-1.5" />);
    } else {
      blocks.push(
        <p key={`p-${idx}`} className="m-0 leading-relaxed">
          {parseInline(line, `p-${idx}`)}
        </p>
      );
    }
  });
  flushList(lines.length);
  return blocks;
}

const ASSET = "/assets/endit/v1";
const TODD_ASSET = "/assets/endit/v1/todd";

const TOPIC_STARTERS = [
  "What is PrEP?",
  "What are my PrEP options?",
  "How effective is PrEP?",
  "What are the side effects?",
  "What's PEP?",
  "What does U=U mean?",
  "Where can I get tested?",
];

export default function ToddChat({
  conversationId,
  initialMessages,
  configured,
}: {
  conversationId: string;
  initialMessages: Message[];
  configured: boolean;
}) {
  const [messages, setMessages] = useState(initialMessages);
  const [input, setInput] = useState("");
  const [isPending, startTransition] = useTransition();
  const listRef = useRef<HTMLDivElement>(null);

  function send(text: string) {
    const trimmed = text.trim();
    if (!trimmed) return;

    const optimisticUser: Message = {
      id: `local-${Date.now()}`,
      role: "user",
      content: trimmed,
      is_urgent_routing: false,
    };
    setMessages((m) => [...m, optimisticUser]);
    setInput("");

    startTransition(async () => {
      await sendToddMessage(conversationId, trimmed);
      // The server action revalidates /todd; a full reload of
      // messages would come from the server component re-render.
      // For immediate feedback we just refresh via location reload
      // of the message list is out of scope for this scaffold --
      // in practice Next.js will re-render on navigation/revalidate.
      window.location.reload();
    });
  }

  return (
    <div className="relative flex flex-col h-[calc(100dvh-24rem)] min-h-[24rem] max-h-[40rem] text-[#F7FAFF] border border-gold/20 rounded-2xl overflow-hidden shadow-2xl shadow-black/40">
      {/* Sanctuary lounge backdrop -- real photo, kept subtle (low
          opacity + dark wash) so it reads as atmosphere behind the
          conversation, never competing with message legibility. */}
      <div className="absolute inset-0 -z-10">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={`${TODD_ASSET}/todd-chat-sanctuary-bg.webp`}
          alt=""
          className="w-full h-full object-cover opacity-[0.16]"
        />
        <div className="absolute inset-0 bg-[#060B13]/88" />
      </div>

      {!configured && (
        <div className="bg-gold/20 border-b border-gold text-black text-xs px-4 py-2 relative z-10">
          Demo mode: Todd&apos;s AI backend isn&apos;t connected yet. Messages
          are saved, but replies are placeholders until the site owner
          finishes setup.
        </div>
      )}

      <div ref={listRef} className="relative z-10 flex-1 min-h-0 overflow-y-auto p-4 flex flex-col gap-3.5">
        {messages.length === 0 && (
          <div className="flex flex-col gap-5 items-center text-center py-3">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={`${TODD_ASSET}/todd-avatar-premium.webp`}
              alt=""
              className="w-20 h-20 rounded-full object-cover"
              style={{ boxShadow: "0 0 0 2px var(--eit-gold, #FFC629), 0 0 30px rgb(255 198 41 / .28)" }}
            />
            <div className="flex flex-col gap-1.5 max-w-xs">
              <p className="font-display text-xl text-[#F7FAFF]">Welcome to the sanctuary.</p>
              <p className="text-sm text-[#B3C2D4] leading-relaxed">
                Ask Todd anything about PrEP, testing, or prevention — real, sourced answers,
                no judgment.
              </p>
            </div>

            <div className="w-full flex flex-col gap-2.5 items-center">
              <div className="flex items-center gap-1.5">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={`${ASSET}/icons/book.svg`} alt="" width={13} height={13} />
                <p className="text-xs font-semibold text-[#98ADC7] uppercase tracking-wide">
                  Try asking
                </p>
              </div>
              <div
                className="w-full rounded-2xl px-3 py-3 flex flex-wrap justify-center gap-2"
                style={{ background: "linear-gradient(90deg, rgb(139 92 246 / .10), rgb(0 130 255 / .06) 55%, rgb(255 198 41 / .08))" }}
              >
                {TOPIC_STARTERS.map((t) => (
                  <button
                    key={t}
                    onClick={() => send(t)}
                    className="text-xs font-semibold text-[#F7FAFF] bg-[#0A1422]/90 border border-white/15 hover:border-gold hover:text-gold transition-colors rounded-full px-3.5 py-2"
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {messages.map((m) => (
          <div
            key={m.id}
            className={`flex items-end gap-2 max-w-[90%] ${
              m.role === "user" ? "self-end flex-row-reverse" : "self-start"
            }`}
          >
            {m.role === "assistant" && (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={`${TODD_ASSET}/todd-avatar-premium.webp`}
                alt=""
                className="w-7 h-7 rounded-full shrink-0 object-cover"
                style={{ boxShadow: "0 0 0 1.5px var(--eit-gold, #FFC629)" }}
              />
            )}
            <div
              className={`rounded-2xl px-4 py-2.5 text-sm overflow-wrap-anywhere shadow-lg shadow-black/20 ${
                m.role === "user"
                  ? "rounded-br-md bg-gradient-to-br from-[#0082FF] to-[#0064CA] text-white"
                  : m.is_urgent_routing
                  ? "rounded-bl-md bg-[#3A0F16]/95 border border-[#FF6B81] text-[#F7FAFF]"
                  : "rounded-bl-md bg-[#142133]/92 border border-white/10 text-[#F7FAFF]"
              }`}
            >
              {renderContent(m.content)}
            </div>
          </div>
        ))}

        {isPending && (
          <div className="flex items-end gap-2 max-w-[90%] self-start">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={`${TODD_ASSET}/todd-avatar-premium.webp`}
              alt=""
              className="w-7 h-7 rounded-full shrink-0 object-cover animate-pulse"
              style={{ boxShadow: "0 0 0 1.5px var(--eit-gold, #FFC629), 0 0 10px rgb(255 198 41 / .5)" }}
            />
            <div className="rounded-2xl rounded-bl-md bg-[#142133]/92 border border-white/10 px-4 py-2.5 text-sm text-[#98ADC7]">
              Thinking…
            </div>
          </div>
        )}
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          send(input);
        }}
        className="relative z-10 shrink-0 border-t border-white/10 bg-[#060B13]/70 p-3 flex gap-2"
      >
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask Todd anything..."
          disabled={isPending}
          className="flex-1 rounded-full border border-white/15 bg-[#0A1422] px-4 py-2.5 text-sm text-[#F7FAFF] placeholder:text-[#98ADC7] outline-none focus:border-gold transition-colors"
        />
        <button
          type="submit"
          disabled={isPending}
          aria-label="Send"
          className="disabled:opacity-60 text-white rounded-full w-11 h-11 flex items-center justify-center shrink-0 transition-transform hover:scale-105"
          style={{
            background: "linear-gradient(135deg, var(--eit-purple, #8B5CF6), var(--eit-pink, #EC4899))",
            boxShadow: "0 4px 18px rgb(139 92 246 / .4)",
          }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={`${ASSET}/icons/send.svg`} alt="" width={16} height={16} style={{ filter: "invert(1)" }} />
        </button>
      </form>
    </div>
  );
}
