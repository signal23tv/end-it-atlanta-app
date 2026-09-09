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
    <div className="flex flex-col h-[calc(100dvh-19rem)] min-h-[22rem] max-h-[38rem] bg-[#101A28] text-[#F7FAFF] border border-[#304055] rounded-xl overflow-hidden">
      {!configured && (
        <div className="bg-gold/20 border-b border-gold text-black text-xs px-4 py-2">
          Demo mode: Todd&apos;s AI backend isn&apos;t connected yet. Messages
          are saved, but replies are placeholders until the site owner
          finishes setup.
        </div>
      )}

      <div ref={listRef} className="flex-1 min-h-0 overflow-y-auto p-4 flex flex-col gap-3">
        {messages.length === 0 && (
          <div className="flex flex-col gap-2">
            <p className="text-sm text-[#B3C2D4]">Try asking:</p>
            <div className="flex flex-wrap gap-2">
              {TOPIC_STARTERS.map((t) => (
                <button
                  key={t}
                  onClick={() => send(t)}
                  className="text-xs text-[#F7FAFF] bg-[#0A1422] border border-[#304055] hover:border-[#0082FF] rounded-full px-3 py-1.5"
                >
                  {t}
                </button>
              ))}
            </div>
          </div>
        )}

        {messages.map((m) => (
          <div
            key={m.id}
            className={`max-w-[85%] rounded-2xl px-3.5 py-2.5 text-sm overflow-wrap-anywhere ${
              m.role === "user"
                ? "self-end rounded-br-md bg-[#0064CA] text-white"
                : m.is_urgent_routing
                ? "self-start rounded-bl-md bg-[#3A0F16] border border-[#FF6B81] text-[#F7FAFF]"
                : "self-start rounded-bl-md bg-[#142133] border border-[#304055] text-[#F7FAFF]"
            }`}
          >
            {renderContent(m.content)}
          </div>
        ))}
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          send(input);
        }}
        className="shrink-0 border-t border-[#304055] p-3 flex gap-2"
      >
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask Todd anything..."
          disabled={isPending}
          className="flex-1 rounded-full border border-[#304055] bg-[#0A1422] px-4 py-2 text-sm text-[#F7FAFF] placeholder:text-[#98ADC7] outline-none focus:border-[#0082FF]"
        />
        <button
          type="submit"
          disabled={isPending}
          className="bg-red hover:bg-red-dark disabled:opacity-60 text-paper font-bold uppercase tracking-wide text-xs rounded-full px-4"
        >
          Send
        </button>
      </form>
    </div>
  );
}
