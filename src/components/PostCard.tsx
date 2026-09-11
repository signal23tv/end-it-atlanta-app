"use client";

import Link from "next/link";
import { useOptimistic, useTransition } from "react";
import { toggleLike } from "@/app/feed/actions";
import CommentThread from "@/components/CommentThread";
import ReportButton from "@/components/ReportButton";
import Avatar from "@/components/Avatar";
import type { Post } from "@/lib/types";

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

export default function PostCard({ post }: { post: Post }) {
  const [isPending, startTransition] = useTransition();
  const [optimistic, setOptimistic] = useOptimistic(
    { liked: post.liked_by_me, count: post.like_count },
    (_state, liked: boolean) => ({
      liked,
      count: liked ? post.like_count + 1 : post.like_count - 1,
    })
  );

  return (
    <article className="bg-[#101A28] text-[#F7FAFF] border border-[#304055] rounded-xl p-4 flex flex-col gap-2">
      <div className="flex items-center gap-2.5">
        <Link href={`/profile/${post.author.username}`} className="shrink-0">
          <Avatar
            src={post.author.avatar_url}
            color={post.author.avatar_color}
            name={post.author.display_name || post.author.username}
            size={40}
          />
        </Link>
        <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5">
          <Link
            href={`/profile/${post.author.username}`}
            className="font-bold hover:text-red"
          >
            {post.author.display_name}
          </Link>
          <Link
            href={`/profile/${post.author.username}`}
            className="text-[#B3C2D4] text-sm hover:underline"
          >
            @{post.author.username}
          </Link>
          <span className="text-[#B3C2D4] text-sm">· {timeAgo(post.created_at)}</span>
        </div>
      </div>

      <p className="whitespace-pre-wrap break-words">{post.content}</p>

      <div className="flex items-center gap-4 mt-1 text-sm">
        <button
          disabled={isPending}
          onClick={() =>
            startTransition(async () => {
              setOptimistic(!optimistic.liked);
              await toggleLike(post.id, optimistic.liked);
            })
          }
          className={`font-semibold ${
            optimistic.liked ? "text-red" : "text-[#B3C2D4] hover:text-red"
          }`}
        >
          ♥ {optimistic.count}
        </button>
        <span className="text-[#B3C2D4]">
          {post.comment_count} {post.comment_count === 1 ? "comment" : "comments"}
        </span>
        <span className="ml-auto">
          <ReportButton target={{ postId: post.id }} />
        </span>
      </div>

      <CommentThread postId={post.id} />
    </article>
  );
}
