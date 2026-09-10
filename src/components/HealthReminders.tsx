"use client";

import { useState, useTransition } from "react";
import {
  addReminder,
  deleteReminder,
  toggleReminder,
  togglePillToday,
  type HealthReminder,
  type ReminderKind,
} from "@/app/my-health/actions";

const ASSET = "/assets/endit/v1";

function formatDate(iso: string | null) {
  if (!iso) return null;
  const d = new Date(`${iso}T00:00:00`);
  return d.toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" });
}

function todayISO() {
  return new Date().toISOString().slice(0, 10);
}

/** Real, honest streak: consecutive days with a check-in, counting back from
 * today (or from yesterday if today isn't checked in yet, so a streak isn't
 * broken just because it's early in the day). */
function computeStreak(takenDates: string[]): number {
  const set = new Set(takenDates);
  let cursor = new Date();
  if (!set.has(todayISO())) {
    cursor.setDate(cursor.getDate() - 1);
  }
  let streak = 0;
  for (;;) {
    const iso = cursor.toISOString().slice(0, 10);
    if (!set.has(iso)) break;
    streak += 1;
    cursor.setDate(cursor.getDate() - 1);
  }
  return streak;
}

function PillCard({
  reminder,
  takenDates,
}: {
  reminder: HealthReminder;
  takenDates: string[];
}) {
  const [dates, setDates] = useState(takenDates);
  const [isPending, startTransition] = useTransition();
  const takenToday = dates.includes(todayISO());
  const streak = computeStreak(dates);

  function toggle() {
    const next = !takenToday;
    setDates((d) => (next ? [...d, todayISO()] : d.filter((x) => x !== todayISO())));
    startTransition(async () => {
      await togglePillToday(reminder.id, next);
    });
  }

  return (
    <div className="rounded-xl border border-[#304055] bg-[#101A28] p-4 flex items-center gap-4">
      <button
        onClick={toggle}
        disabled={isPending}
        aria-label={takenToday ? "Mark today's dose not taken" : "Mark today's dose taken"}
        className={`w-12 h-12 shrink-0 rounded-full flex items-center justify-center border-2 transition-colors ${
          takenToday ? "bg-gold border-gold" : "border-[#304055] hover:border-gold"
        }`}
      >
        {takenToday ? (
          <svg viewBox="0 0 24 24" width={20} height={20} fill="none" stroke="black" strokeWidth={3}>
            <path d="M5 13l4 4L19 7" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        ) : (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={`${ASSET}/icons/pill.svg`} alt="" width={18} height={18} />
        )}
      </button>
      <div className="flex-1 min-w-0">
        <p className="font-semibold text-sm text-[#F7FAFF] truncate">{reminder.title}</p>
        <p className="text-xs text-[#98ADC7] mt-0.5">
          {takenToday ? "Taken today" : "Not marked yet today"}
          {streak > 0 && ` · ${streak}-day streak`}
        </p>
      </div>
    </div>
  );
}

export default function HealthReminders({
  initial,
  initialCheckIns,
}: {
  initial: HealthReminder[];
  initialCheckIns: Record<string, string[]>;
}) {
  const [reminders, setReminders] = useState(initial);
  const [title, setTitle] = useState("");
  const [note, setNote] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [kind, setKind] = useState<ReminderKind>("test");
  const [repeatDaily, setRepeatDaily] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [isPending, startTransition] = useTransition();

  const pillReminders = reminders.filter((r) => r.kind === "pill" && !r.completed);
  const otherReminders = reminders.filter((r) => r.kind !== "pill");

  function handleAdd(e: React.FormEvent) {
    e.preventDefault();
    const trimmed = title.trim();
    if (!trimmed) return;

    const isPill = kind === "pill";
    const optimistic: HealthReminder = {
      id: `local-${Date.now()}`,
      title: trimmed,
      note: note.trim() || null,
      due_date: isPill && repeatDaily ? null : dueDate || null,
      completed: false,
      kind,
      repeat_daily: isPill ? repeatDaily : false,
      created_at: new Date().toISOString(),
    };
    setReminders((r) => [optimistic, ...r]);
    const savedTitle = trimmed;
    const savedNote = note;
    const savedDue = dueDate;
    const savedKind = kind;
    const savedRepeat = repeatDaily;
    setTitle("");
    setNote("");
    setDueDate("");
    setKind("test");
    setRepeatDaily(true);
    setShowForm(false);

    startTransition(async () => {
      await addReminder(savedTitle, savedNote, savedDue, savedKind, savedRepeat);
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
    <div className="flex flex-col gap-6">
      {pillReminders.length > 0 && (
        <div>
          <p className="eit-kicker mb-2">Daily Pill</p>
          <div className="flex flex-col gap-3">
            {pillReminders.map((r) => (
              <PillCard key={r.id} reminder={r} takenDates={initialCheckIns[r.id] ?? []} />
            ))}
          </div>
        </div>
      )}

      <div>
        <div className="flex items-center justify-between mb-2">
          <p className="eit-kicker">Calendar &amp; Reminders</p>
          {!showForm && (
            <button
              onClick={() => setShowForm(true)}
              className="rounded-md border border-[#304055] hover:border-gold text-[#F7FAFF] font-bold uppercase tracking-wide text-xs px-3 py-2 transition-colors"
            >
              + Add
            </button>
          )}
        </div>

        {showForm && (
          <form
            onSubmit={handleAdd}
            className="rounded-xl border border-[#304055] bg-[#101A28] p-4 flex flex-col gap-3 mb-3"
          >
            <div className="flex gap-2">
              {(
                [
                  { key: "test", label: "Testing date" },
                  { key: "pill", label: "Daily pill" },
                  { key: "other", label: "Other" },
                ] as { key: ReminderKind; label: string }[]
              ).map((k) => (
                <button
                  key={k.key}
                  type="button"
                  onClick={() => setKind(k.key)}
                  className={`flex-1 rounded-md text-xs font-bold uppercase tracking-wide px-2 py-2 border transition-colors ${
                    kind === k.key
                      ? "bg-gold text-black border-gold"
                      : "border-[#304055] text-[#B3C2D4] hover:border-gold"
                  }`}
                >
                  {k.label}
                </button>
              ))}
            </div>

            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder={
                kind === "pill"
                  ? "e.g. Daily PrEP pill"
                  : kind === "test"
                  ? "e.g. HIV/STI testing"
                  : "What do you want to remember?"
              }
              className="w-full rounded-md border border-[#304055] bg-[#0A1422] text-[#F7FAFF] placeholder:text-[#98ADC7] px-3 py-2.5 text-sm outline-none focus:border-gold"
              autoFocus
            />
            <input
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Notes (optional)"
              className="w-full rounded-md border border-[#304055] bg-[#0A1422] text-[#F7FAFF] placeholder:text-[#98ADC7] px-3 py-2.5 text-sm outline-none focus:border-gold"
            />

            {kind === "pill" ? (
              <label className="flex items-center gap-2 text-sm text-[#B3C2D4]">
                <input
                  type="checkbox"
                  checked={repeatDaily}
                  onChange={(e) => setRepeatDaily(e.target.checked)}
                  className="accent-gold"
                />
                Repeats every day
              </label>
            ) : null}

            {!(kind === "pill" && repeatDaily) && (
              <input
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="w-full rounded-md border border-[#304055] bg-[#0A1422] text-[#F7FAFF] px-3 py-2.5 text-sm outline-none focus:border-gold"
              />
            )}

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

        {otherReminders.length === 0 ? (
          <div className="eit-card eit-empty">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={`${ASSET}/empty-states/notifications.svg`} alt="" />
            <p>No testing dates or reminders yet -- add one to keep track.</p>
          </div>
        ) : (
          <div className="flex flex-col divide-y divide-[#304055] rounded-xl border border-[#304055] overflow-hidden">
            {otherReminders.map((r) => (
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
                  <div className="flex items-center gap-1.5">
                    {r.kind === "test" && (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={`${ASSET}/icons/science.svg`} alt="" width={12} height={12} />
                    )}
                    <p className={`text-sm font-semibold ${r.completed ? "text-[#98ADC7] line-through" : "text-[#F7FAFF]"}`}>
                      {r.title}
                    </p>
                  </div>
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
    </div>
  );
}
