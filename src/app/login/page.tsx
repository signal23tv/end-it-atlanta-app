"use client";

import { useActionState } from "react";
import Link from "next/link";
import { login, type LoginState } from "./actions";

const initialState: LoginState = {};

export default function LoginPage() {
  const [state, formAction, pending] = useActionState(login, initialState);

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
          <h1 className="text-3xl mb-1">LOG IN</h1>

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
              autoComplete="current-password"
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
            {pending ? "Logging in…" : "Log In"}
          </button>

          <p className="text-sm text-center mt-2">
            No account yet?{" "}
            <Link href="/join/organic" className="font-semibold underline">
              Sign up
            </Link>
          </p>
        </form>
      </div>
    </main>
  );
}
