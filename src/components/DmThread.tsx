"use client";

import { useState, useTransition } from "react";
import { sendMessage, type DmMessage } from "@/app/messages/actions";

export default function DmThread({
  conversationId,
  currentUserId,
  initialMessages,
}: {
  conversationId: string;
  currentUserId: string;
  initialMessages: DmMessage[];
}) {
  const [messages, setMessages] = useState(initialMessages);
  const [input, setInput] = useState("");
  const [isPending, startTransition] = useTransition();

  function send() {
    const trimmed = input.trim();
    if (!trimmed) return;

    const optimistic: DmMessage = {
      id: `local-${Date.now()}`,
      sender_id: currentUserId,
      body: trimmed,
      created_at: new Date().toISOString(),
    };
    setMessages((m) => [...m, optimistic]);
    setInput("");

    startTransition(async () => {
      await sendMessage(conversationId, trimmed);
    });
  }

  return (
    <div className="flex flex-col h-[calc(100dvh-16rem)] min-h-[22rem] max-h-[42rem] bg-[#101A28] text-[#F7FAFF] border border-[#304055] rounded-xl overflow-hidden">
      <div className="flex-1 min-h-0 overflow-y-auto p-4 flex flex-col gap-3">
        {messages.length === 0 && (
          <p className="text-sm text-[#98ADC7] text-center py-8">
            No messages yet -- say hello.
          </p>
        )}
        {messages.map((m) => (
          <div
            key={m.id}
            className={`max-w-[85%] rounded-2xl px-3.5 py-2.5 text-sm break-words ${
              m.sender_id === currentUserId
                ? "self-end rounded-br-md bg-[#0064CA] text-white"
                : "self-start rounded-bl-md bg-[#142133] border border-[#304055] text-[#F7FAFF]"
            }`}
          >
            {m.body}
          </div>
        ))}
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          send();
        }}
        className="shrink-0 border-t border-[#304055] p-3 flex gap-2"
      >
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Write a message..."
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
