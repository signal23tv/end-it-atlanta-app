"use client";

import { useRef, useState, useTransition } from "react";
import { sendToddMessage } from "@/app/todd/actions";

type Message = {
  id: string;
  role: "user" | "assistant";
  content: string;
  is_urgent_routing: boolean;
};

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
    <div className="flex flex-col h-[calc(100dvh-19rem)] min-h-[22rem] max-h-[38rem] bg-white border border-black/10 rounded-xl overflow-hidden">
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
            <p className="text-sm text-muted">Try asking:</p>
            <div className="flex flex-wrap gap-2">
              {TOPIC_STARTERS.map((t) => (
                <button
                  key={t}
                  onClick={() => send(t)}
                  className="text-xs border border-black/15 hover:border-gold rounded-full px-3 py-1.5"
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
            className={`max-w-[80%] rounded-lg px-3 py-2 text-sm ${
              m.role === "user"
                ? "self-end bg-red text-paper"
                : m.is_urgent_routing
                ? "self-start bg-red-dark/10 border border-red-dark text-black"
                : "self-start bg-black/5 text-black"
            }`}
          >
            {m.content}
          </div>
        ))}
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          send(input);
        }}
        className="shrink-0 border-t border-black/10 p-3 flex gap-2"
      >
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask Todd anything..."
          disabled={isPending}
          className="flex-1 rounded-md border border-black/15 px-3 py-2 text-sm outline-none focus:border-gold"
        />
        <button
          type="submit"
          disabled={isPending}
          className="bg-red hover:bg-red-dark disabled:opacity-60 text-paper font-bold uppercase tracking-wide text-xs rounded-md px-4"
        >
          Send
        </button>
      </form>
    </div>
  );
}
