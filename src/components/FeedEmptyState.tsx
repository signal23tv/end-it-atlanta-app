"use client";

/**
 * Empty-feed illustration copy. This is real, live UI text (not baked
 * into the background art) -- clicking it focuses the actual composer
 * textarea above it rather than doing nothing.
 */
export default function FeedEmptyState() {
  return (
    <div className="flex flex-col gap-2 max-w-[75%] sm:max-w-[60%]">
      <p className="text-sm font-semibold text-[#F7FAFF]">Start the conversation.</p>
      <p className="text-xs text-[#B3C2D4]">
        Share what&apos;s going on in your city — be the first to post.
      </p>
      <button
        type="button"
        onClick={() => {
          const el = document.getElementById("post-composer-textarea") as HTMLTextAreaElement | null;
          el?.focus();
          el?.scrollIntoView({ behavior: "smooth", block: "center" });
        }}
        className="self-start mt-1 inline-flex items-center gap-1.5 rounded-full border border-white/30 text-[#F7FAFF] text-xs font-bold uppercase tracking-wide px-4 py-2 hover:bg-white/10 transition-colors"
      >
        Write a Post
      </button>
    </div>
  );
}
