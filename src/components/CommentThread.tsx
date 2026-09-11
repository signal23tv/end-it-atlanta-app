"use client";

import { useActionState, useEffect, useState, useTransition } from "react";
import Link from "next/link";
import { addComment, getComments, type CommentItem, type CommentState } from "@/app/feed/actions";
import ReportButton from "@/components/ReportButton";
import Avatar from "@/components/Avatar";

const initialState: CommentState = {};

function timeAgo(iso: string): string {
  const seconds = Math.floor((Date.now() - new Date(iso).getTime()) / 1000);
  if (seconds < 60) return "just now";
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

export default function CommentThread({ postId }: { postId: string }) {
  const [open, setOpen] = useState(false);
  const [comments, setComments] = useState<CommentItem[] | null>(null);
  const [isLoading, startLoading] = useTransition();
  const addCommentWithId = addComment.bind(null, postId);
  const [state, formAction, pending] = useActionState(addCommentWithId, initialState);

  function load() {
    startLoading(async () => {
      const data = await getComments(postId);
      setComments(data);
    });
  }

  useEffect(() => {
    if (open && comments === null) load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  // After a successful comment post, refresh the thread.
  useEffect(() => {
    if (!pending && state && !state.error && open) {
      load();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pending]);

  return (
    <div className="mt-1">
      <button
        onClick={() => setOpen((o) => !o)}
        className="text-[#B3C2D4] text-sm hover:text-gold"
      >
        {open ? "Hide comments" : "View comments"}
      </button>

      {open && (
        <div className="mt-2 flex flex-col gap-3 border-t border-[#304055] pt-3">
          {isLoading && comments === null && (
            <p className="text-xs text-[#B3C2D4]">Loading comments…</p>
          )}
          {comments && comments.length === 0 && (
            <p className="text-xs text-[#B3C2D4]">No comments yet — be the first to reply.</p>
          )}
          {comments?.map((c) => (
            <div key={c.id} className="flex items-start gap-2 text-sm">
              <Link href={`/profile/${c.author?.username}`} className="shrink-0 mt-0.5">
                <Avatar
                  src={c.author?.avatar_url}
                  color={c.author?.avatar_color}
                  name={c.author?.display_name ?? c.author?.username ?? "?"}
                  size={28}
                />
              </Link>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <Link
                    href={`/profile/${c.author?.username}`}
                    className="font-semibold hover:text-red"
                  >
                    {c.author?.display_name ?? "Someone"}
                  </Link>
                  <span className="text-[#B3C2D4] text-xs">{timeAgo(c.created_at)}</span>
                  <span className="ml-auto">
                    <ReportButton target={{ commentId: c.id }} />
                  </span>
                </div>
                <p className="whitespace-pre-wrap break-words">{c.content}</p>
              </div>
            </div>
          ))}

          <form action={formAction} className="flex gap-2">
            <input
              name="content"
              required
              maxLength={1000}
              placeholder="Write a reply…"
              className="flex-1 rounded-md border border-[#304055] bg-[#0A1422] text-[#F7FAFF] placeholder:text-[#98ADC7] px-3 py-1.5 text-sm outline-none focus:border-gold"
            />
            <button
              type="submit"
              disabled={pending}
              className="bg-red hover:bg-red-dark disabled:opacity-60 text-paper font-bold uppercase tracking-wide text-xs rounded-md px-3"
            >
              Reply
            </button>
          </form>
          {state?.error && (
            <p role="alert" className="text-red-dark text-xs font-semibold">
              {state.error}
            </p>
          )}
        </div>
      )}
    </div>
  );
}
