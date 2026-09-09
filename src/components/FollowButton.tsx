"use client";

import { useOptimistic, useTransition } from "react";
import { toggleFollow } from "@/app/profile/actions";

export default function FollowButton({
  targetUserId,
  username,
  initiallyFollowing,
}: {
  targetUserId: string;
  username: string;
  initiallyFollowing: boolean;
}) {
  const [isPending, startTransition] = useTransition();
  const [following, setFollowing] = useOptimistic(
    initiallyFollowing,
    (_state, next: boolean) => next
  );

  return (
    <button
      disabled={isPending}
      onClick={() =>
        startTransition(async () => {
          setFollowing(!following);
          await toggleFollow(targetUserId, following, username);
        })
      }
      className={
        following
          ? "border border-[#304055] hover:border-red hover:text-red font-bold uppercase tracking-wide text-sm rounded-md px-5 py-2 transition-colors"
          : "bg-red hover:bg-red-dark disabled:opacity-60 text-paper font-bold uppercase tracking-wide text-sm rounded-md px-5 py-2 transition-colors"
      }
    >
      {following ? "Following" : "Follow"}
    </button>
  );
}
