"use client";

import { useActionState } from "react";
import {
  updateProfile,
  type ProfileEditState,
} from "@/app/settings/profile/actions";

const initialState: ProfileEditState = {};

export default function ProfileEditForm({
  displayName,
  bio,
}: {
  displayName: string;
  bio: string;
}) {
  const [state, formAction, pending] = useActionState(
    updateProfile,
    initialState
  );

  return (
    <form
      action={formAction}
      className="bg-white border border-black/10 rounded-xl p-6 flex flex-col gap-4"
    >
      <h1 className="text-3xl">EDIT PROFILE</h1>

      <label className="flex flex-col gap-1 text-sm font-semibold">
        Display name
        <input
          name="display_name"
          type="text"
          required
          maxLength={60}
          defaultValue={displayName}
          className="rounded-md border border-black/15 px-3 py-2 text-base font-normal outline-none focus:border-gold"
        />
      </label>

      <label className="flex flex-col gap-1 text-sm font-semibold">
        Bio
        <textarea
          name="bio"
          rows={3}
          maxLength={280}
          defaultValue={bio}
          className="resize-none rounded-md border border-black/15 px-3 py-2 text-base font-normal outline-none focus:border-gold"
        />
      </label>

      {state?.error && (
        <p role="alert" className="text-red-dark text-sm font-semibold">
          {state.error}
        </p>
      )}

      <button
        type="submit"
        disabled={pending}
        className="bg-red hover:bg-red-dark disabled:opacity-60 text-paper font-bold uppercase tracking-wide rounded-md py-3 transition-colors"
      >
        {pending ? "Saving…" : "Save changes"}
      </button>
    </form>
  );
}
