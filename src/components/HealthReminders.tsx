"use client";

import { useState, useTransition } from "react";
import {
  addReminder,
  deleteReminder,
  toggleReminder,
  type HealthReminder,
} from "@/app/my-health/actions";

const ASSET = "/assets/endit/v1";

function formatDate(iso: string | null) {
  if (!iso) return null;
  const d = new Date(`${iso}T00:00:00`);
  return d.toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" });
}

export default function HealthReminders({ initial }: { initial: HealthReminder[] }) {
  const [reminders, setReminders] = useState(initial);
  const [title, setTitle] = useState("");
  const [note, setNote] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [isPending, startTransition] = useTransition();

  function handleAdd(e: React.FormEvent) {
    e.preventDefault();
    const trimmed = title.trim();
    if (!trimmed) return;

    const optimistic: HealthReminder = {
      id: `local-${Date.now()}`,
      title: trimmed,
      note: note.trim() || null,
      due_date: dueDate || null,
      completed: false,
      created_at: new Date().toISOString(),
    };
    setReminders((r) => [optimistic, ...r]);
    setTitle("");
    setNote("");
    setDueDate("");
    setShowForm(false);

    startTransition(async () => {
      await addReminder(trimmed, note, dueDate);
    });
  }

  function handleToggle(id: string, completed: boolean) {
    setReminders((r) => r.map((x) => (x.id === id ? { ...x, completed } : x)));
    startTransition(async () => {
      await toggleReminder(id, completed);
    });
  }

  function handleDelete(id: string) {
    setReminders((r) => r.filter((x) => x.id !== id));
    startTransition(async () => {
      await deleteReminder(id);
    });
  }

  return (
    <div className="flex flex-col gap-4">
      {!showForm ? (
        <button
          onClick={() => setShowForm(true)}
          className="rounded-md border border-[#304055] hover:border-gold text-[#F7FAFF] font-bold uppercase tracking-wide text-sm px-4 py-2.5 transition-colors self-start"
        >
          + Add reminder
        </button>
      ) : (
        <form
          onSubmit={handleAdd}
          className="rounded-xl border border-[#304055] bg-[#101A28] p-4 flex flex-col gap-3"
        >
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="What do you want to remember? (e.g. PrEP refill)"
            className="w-full rounded-md border border-[#304055] bg-[#0A1422] text-[#F7FAFF] placeholder:text-[#98ADC7] px-3 py-2.5 text-sm outline-none focus:border-gold"
            autoFocus
          />
          <input
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="Notes (optional)"
            className="w-full rounded-md border border-[#304055] bg-[#0A1422] text-[#F7FAFF] placeholder:text-[#98ADC7] px-3 py-2.5 text-sm outline-none focus:border-gold"
          />
          <input
            type="date"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
            className="w-full rounded-md border border-[#304055] bg-[#0A1422] text-[#F7FAFF] px-3 py-2.5 text-sm outline-none focus:border-gold"
          />
          <div className="flex gap-2">
            <button
              type="submit"
              disabled={isPending || !title.trim()}
              className="bg-red hover:bg-red-dark disabled:opacity-60 text-paper font-bold uppercase tracking-wide text-xs rounded-md px-4 py-2.5"
            >
              Save
            </button>
            <button
              type="button"
              onClick={() => setShowForm(false)}
              className="text-[#98ADC7] hover:text-[#F7FAFF] text-xs font-bold uppercase tracking-wide px-4 py-2.5"
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      {reminders.length === 0 ? (
        <div className="eit-card eit-empty">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={`${ASSET}/empty-states/notifications.svg`} alt="" />
          <p>No reminders yet -- add one to keep track of appointments and refills.</p>
        </div>
      ) : (
        <div className="flex flex-col divide-y divide-[#304055] rounded-xl border border-[#304055] overflow-hidden">
          {reminders.map((r) => (
            <div key={r.id} className="flex items-start gap-3 px-4 py-3.5 bg-[#101A28]">
              <button
                aria-label={r.completed ? "Mark incomplete" : "Mark complete"}
                onClick={() => handleToggle(r.id, !r.completed)}
                className={`mt-0.5 w-5 h-5 shrink-0 rounded-full border flex items-center justify-center ${
                  r.completed ? "bg-gold border-gold" : "border-[#304055]"
                }`}
              >
                {r.completed && (
                  <svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="black" strokeWidth={3}>
                    <path d="M5 13l4 4L19 7" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                )}
              </button>
              <div className="flex-1 min-w-0">
                <p className={`text-sm font-semibold ${r.completed ? "text-[#98ADC7] line-through" : "text-[#F7FAFF]"}`}>
                  {r.title}
                </p>
                {r.note && <p className="text-xs text-[#98ADC7] mt-0.5">{r.note}</p>}
                {r.due_date && (
                  <p className="text-xs text-[#98ADC7] mt-0.5">Due {formatDate(r.due_date)}</p>
                )}
              </div>
              <button
                aria-label="Delete reminder"
                onClick={() => handleDelete(r.id)}
                className="text-[#98ADC7] hover:text-red shrink-0"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={`${ASSET}/icons/delete.svg`} alt="" width={16} height={16} />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
