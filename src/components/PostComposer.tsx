"use client";

import { useActionState, useRef } from "react";
import { createPost, type PostState } from "@/app/feed/actions";
import ImageBackdrop from "@/components/ImageBackdrop";

const initialState: PostState = {};

export default function PostComposer() {
  const [state, formAction, pending] = useActionState(
    createPost,
    initialState
  );
  const formRef = useRef<HTMLFormElement>(null);

  return (
    <ImageBackdrop
      realSrc="/assets/endit/v1/home/community_conversation_bg.webp"
      fallbackSrc="/assets/endit/v1/backgrounds/atmosphere-green.svg"
      scrim="linear-gradient(160deg, rgb(6 11 19 / .92) 0%, rgb(6 11 19 / .8) 100%)"
      className="rounded-2xl border border-[#304055] shadow-lg shadow-black/30"
    >
      <form
        ref={formRef}
        action={async (formData) => {
          await formAction(formData);
          formRef.current?.reset();
        }}
        className="text-[#F7FAFF] p-4 flex flex-col gap-3"
      >
        <label htmlFor="post-composer-textarea" className="sr-only">
          What&apos;s happening in Atlanta?
        </label>
        <textarea
          id="post-composer-textarea"
          name="content"
          required
          maxLength={2000}
          rows={3}
          placeholder="What's happening in Atlanta?"
          className="resize-none rounded-lg border border-white/15 bg-[#060B13]/95 text-[#F7FAFF] placeholder:text-[#98ADC7] px-3 py-2.5 text-base outline-none focus:border-gold"
        />
        {state?.error && (
          <p role="alert" className="text-red-dark text-sm font-semibold">
            {state.error}
          </p>
        )}
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={pending}
            className="bg-gradient-to-r from-red to-red-dark disabled:opacity-60 text-paper font-bold uppercase tracking-wide text-sm rounded-full px-6 py-2.5 shadow-lg shadow-red/30 transition-transform hover:-translate-y-px"
          >
            {pending ? "Posting…" : "Post"}
          </button>
        </div>
      </form>
    </ImageBackdrop>
  );
}
