"use client";

import { useActionState, useRef } from "react";
import { createPost, type PostState } from "@/app/feed/actions";

const initialState: PostState = {};

export default function PostComposer() {
  const [state, formAction, pending] = useActionState(
    createPost,
    initialState
  );
  const formRef = useRef<HTMLFormElement>(null);

  return (
    <form
      ref={formRef}
      action={async (formData) => {
        await formAction(formData);
        formRef.current?.reset();
      }}
      className="bg-white text-black border border-black/10 rounded-xl p-4 flex flex-col gap-3"
    >
      <textarea
        name="content"
        required
        maxLength={2000}
        rows={3}
        placeholder="What's happening in Atlanta?"
        className="resize-none rounded-md border border-black/15 px-3 py-2 text-base outline-none focus:border-gold"
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
          className="bg-red hover:bg-red-dark disabled:opacity-60 text-paper font-bold uppercase tracking-wide text-sm rounded-md px-5 py-2 transition-colors"
        >
          {pending ? "Posting…" : "Post"}
        </button>
      </div>
    </form>
  );
}
