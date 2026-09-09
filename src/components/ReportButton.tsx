"use client";

import { useState, useTransition } from "react";
import { reportContent, type ReportReason, type ReportTarget } from "@/app/moderation/actions";

const REASONS: { value: ReportReason; label: string }[] = [
  { value: "spam", label: "Spam" },
  { value: "harassment", label: "Harassment or bullying" },
  { value: "misinformation", label: "Health misinformation" },
  { value: "explicit_content", label: "Explicit content" },
  { value: "other", label: "Something else" },
];

export default function ReportButton({ target, label = "Report" }: { target: ReportTarget; label?: string }) {
  const [open, setOpen] = useState(false);
  const [reason, setReason] = useState<ReportReason>("spam");
  const [details, setDetails] = useState("");
  const [status, setStatus] = useState<"idle" | "error" | "done">("idle");
  const [isPending, startTransition] = useTransition();

  if (status === "done") {
    return <span className="text-xs text-muted">Report filed. Thank you.</span>;
  }

  if (!open) {
    return (
      <button onClick={() => setOpen(true)} className="text-muted text-xs hover:text-red">
        {label}
      </button>
    );
  }

  return (
    <div className="mt-2 flex flex-col gap-2 rounded-md border border-black/10 p-3 bg-black/[0.02] text-sm">
      <p className="text-xs font-semibold">Why are you reporting this?</p>
      <select
        value={reason}
        onChange={(e) => setReason(e.target.value as ReportReason)}
        className="rounded-md border border-black/15 px-2 py-1.5 text-sm"
      >
        {REASONS.map((r) => (
          <option key={r.value} value={r.value}>
            {r.label}
          </option>
        ))}
      </select>
      <textarea
        value={details}
        onChange={(e) => setDetails(e.target.value)}
        placeholder="Anything else we should know? (optional)"
        rows={2}
        className="rounded-md border border-black/15 px-2 py-1.5 text-sm resize-none"
      />
      {status === "error" && (
        <p className="text-red-dark text-xs font-semibold">Couldn&apos;t file that — try again.</p>
      )}
      <div className="flex gap-2 justify-end">
        <button
          onClick={() => setOpen(false)}
          className="text-xs text-muted hover:text-black"
        >
          Cancel
        </button>
        <button
          disabled={isPending}
          onClick={() =>
            startTransition(async () => {
              const result = await reportContent(target, reason, details);
              setStatus(result.success ? "done" : "error");
            })
          }
          className="bg-red hover:bg-red-dark disabled:opacity-60 text-paper text-xs font-bold uppercase tracking-wide rounded-md px-3 py-1.5"
        >
          {isPending ? "Sending…" : "Submit report"}
        </button>
      </div>
    </div>
  );
}
