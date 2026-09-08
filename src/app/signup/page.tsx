"use client";

import { useActionState } from "react";
import Link from "next/link";
import { signup, type SignupState } from "./actions";

const initialState: SignupState = {};

export default function SignupPage() {
  const [state, formAction, pending] = useActionState(signup, initialState);

  if (state?.success) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-black px-4 py-16">
        <div className="w-full max-w-sm bg-paper rounded-xl p-8 text-center">
          <h1 className="text-3xl mb-3">CHECK YOUR EMAIL</h1>
          <p className="text-sm">
            We sent a confirmation link to finish creating your account.
            Click it, then come back and log in.
          </p>
          <Link
            href="/login"
            className="inline-block mt-6 font-semibold underline"
          >
            Go to login
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen flex items-center justify-center bg-black px-4 py-16">
      <div className="w-full max-w-sm">
        <Link
          href="/"
          className="block text-center font-display text-3xl tracking-wide text-paper mb-8"
        >
          END IT ATLANTA
        </Link>

        <form
          action={formAction}
          className="bg-paper rounded-xl p-8 flex flex-col gap-4"
        >
          <h1 className="text-3xl mb-1">SIGN UP</h1>

          <label className="flex flex-col gap-1 text-sm font-semibold">
            Display name
            <input
              name="display_name"
              type="text"
              required
              maxLength={60}
              className="rounded-md border border-black/15 px-3 py-2 text-base font-normal outline-none focus:border-gold"
            />
          </label>

          <label className="flex flex-col gap-1 text-sm font-semibold">
            Username
            <input
              name="username"
              type="text"
              required
              pattern="[a-z0-9_]{3,24}"
              title="3-24 characters: lowercase letters, numbers, underscores"
              placeholder="lowercase, no spaces"
              className="rounded-md border border-black/15 px-3 py-2 text-base font-normal outline-none focus:border-gold"
            />
          </label>

          <label className="flex flex-col gap-1 text-sm font-semibold">
            Email
            <input
              name="email"
              type="email"
              required
              autoComplete="email"
              className="rounded-md border border-black/15 px-3 py-2 text-base font-normal outline-none focus:border-gold"
            />
          </label>

          <label className="flex flex-col gap-1 text-sm font-semibold">
            Password
            <input
              name="password"
              type="password"
              required
              minLength={8}
              autoComplete="new-password"
              className="rounded-md border border-black/15 px-3 py-2 text-base font-normal outline-none focus:border-gold"
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
            className="mt-2 bg-red hover:bg-red-dark disabled:opacity-60 text-paper font-bold uppercase tracking-wide rounded-md py-3 transition-colors"
          >
            {pending ? "Creating account…" : "Sign Up"}
          </button>

          <p className="text-sm text-center mt-2">
            Already have an account?{" "}
            <Link href="/login" className="font-semibold underline">
              Log in
            </Link>
          </p>
        </form>
      </div>
    </main>
  );
}
